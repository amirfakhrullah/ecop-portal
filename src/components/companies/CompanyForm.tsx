import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/companies/useOptimisticCompanies";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  type Company,
  insertCompanyParams,
  companyType,
} from "@/lib/db/schema/companies";
import {
  createCompanyAction,
  deleteCompanyAction,
  updateCompanyAction,
} from "@/lib/actions/companies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CompanyForm = ({
  company,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  company?: Company | null;

  openModal?: (company?: Company) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Company>(insertCompanyParams);
  const editing = !!company?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("companies");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Company }
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Company ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const companyParsed = await insertCompanyParams.safeParseAsync({
      ...payload,
      domains: payload.domains.toString().split(",") ?? [],
    });
    if (!companyParsed.success) {
      setErrors(companyParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = companyParsed.data;
    const pendingCompany: Company = {
      updatedAt: company?.updatedAt ?? new Date(),
      createdAt: company?.createdAt ?? new Date(),
      id: company?.id ?? "",
      ...values,
      domains: values.domains as string[],
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingCompany,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateCompanyAction({ ...values, id: company.id })
          : await createCompanyAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingCompany,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : ""
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={company?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.companyType ? "text-destructive" : ""
          )}
        >
          Company Type
        </Label>
        <Select name="companyType" 
          defaultValue={company?.companyType ?? ""}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Company Type" />
          </SelectTrigger>
          <SelectContent>
            {companyType.enumValues.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.companyType ? (
          <p className="text-xs text-destructive mt-2">
            {errors.companyType[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.email ? "text-destructive" : ""
          )}
        >
          Email
        </Label>
        <Input
          type="text"
          name="email"
          className={cn(errors?.email ? "ring ring-destructive" : "")}
          defaultValue={company?.email ?? ""}
        />
        {errors?.email ? (
          <p className="text-xs text-destructive mt-2">{errors.email[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.phoneNumber ? "text-destructive" : ""
          )}
        >
          Phone Number
        </Label>
        <Input
          type="text"
          name="phoneNumber"
          className={cn(errors?.phoneNumber ? "ring ring-destructive" : "")}
          defaultValue={company?.phoneNumber ?? ""}
        />
        {errors?.phoneNumber ? (
          <p className="text-xs text-destructive mt-2">
            {errors.phoneNumber[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.websiteUrl ? "text-destructive" : ""
          )}
        >
          Website Url
        </Label>
        <Input
          type="text"
          name="websiteUrl"
          className={cn(errors?.websiteUrl ? "ring ring-destructive" : "")}
          defaultValue={company?.websiteUrl ?? ""}
        />
        {errors?.websiteUrl ? (
          <p className="text-xs text-destructive mt-2">
            {errors.websiteUrl[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.billingAddress ? "text-destructive" : ""
          )}
        >
          Billing Address
        </Label>
        <Input
          type="text"
          name="billingAddress"
          className={cn(errors?.billingAddress ? "ring ring-destructive" : "")}
          defaultValue={company?.billingAddress ?? ""}
        />
        {errors?.billingAddress ? (
          <p className="text-xs text-destructive mt-2">
            {errors.billingAddress[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.shippingAddress ? "text-destructive" : ""
          )}
        >
          Shipping Address
        </Label>
        <Input
          type="text"
          name="shippingAddress"
          className={cn(errors?.shippingAddress ? "ring ring-destructive" : "")}
          defaultValue={company?.shippingAddress ?? ""}
        />
        {errors?.shippingAddress ? (
          <p className="text-xs text-destructive mt-2">
            {errors.shippingAddress[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.domains ? "text-destructive" : ""
          )}
        >
          Domains
        </Label>
        <Input
          type="text"
          name="domains"
          className={cn(errors?.domains ? "ring ring-destructive" : "")}
          defaultValue={company?.domains ?? ""}
        />
        {errors?.domains ? (
          <p className="text-xs text-destructive mt-2">{errors.domains[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.passphrase ? "text-destructive" : ""
          )}
        >
          Passphrase
        </Label>
        <Input
          type="text"
          name="passphrase"
          className={cn(errors?.passphrase ? "ring ring-destructive" : "")}
          defaultValue={company?.passphrase ?? ""}
        />
        {errors?.passphrase ? (
          <p className="text-xs text-destructive mt-2">
            {errors.passphrase[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic &&
                addOptimistic({ action: "delete", data: company });
              const error = await deleteCompanyAction(company.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: company,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default CompanyForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
