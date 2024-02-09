import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/liaison-requests/useOptimisticLiaisonRequests";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  type LiaisonRequest,
  insertLiaisonRequestParams,
} from "@/lib/db/schema/liaisonRequests";
import {
  createLiaisonRequestAction,
  deleteLiaisonRequestAction,
  updateLiaisonRequestAction,
} from "@/lib/actions/liaisonRequests";
import {
  type ClientRequest,
  type ClientRequestId,
} from "@/lib/db/schema/clientRequests";
import { type Company, type CompanyId } from "@/lib/db/schema/companies";

const LiaisonRequestForm = ({
  clientRequests,
  clientRequestId,
  companies,
  companyId,
  liaisonRequest,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  liaisonRequest?: LiaisonRequest | null;
  clientRequests: ClientRequest[];
  clientRequestId?: ClientRequestId;
  companies: Company[];
  companyId?: CompanyId;
  openModal?: (liaisonRequest?: LiaisonRequest) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<LiaisonRequest>(insertLiaisonRequestParams);
  const editing = !!liaisonRequest?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("liaison-requests");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: LiaisonRequest }
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
      toast.success(`LiaisonRequest ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const liaisonRequestParsed =
      await insertLiaisonRequestParams.safeParseAsync({
        clientRequestId,
        companyId,
        ...payload,
      });
    if (!liaisonRequestParsed.success) {
      setErrors(liaisonRequestParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = liaisonRequestParsed.data;
    const pendingLiaisonRequest: LiaisonRequest = {
      updatedAt: liaisonRequest?.updatedAt ?? new Date(),
      createdAt: liaisonRequest?.createdAt ?? new Date(),
      id: liaisonRequest?.id ?? "",
      fromLiaisonUserId: liaisonRequest?.fromLiaisonUserId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingLiaisonRequest,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateLiaisonRequestAction({
              ...values,
              id: liaisonRequest.id,
            })
          : await createLiaisonRequestAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingLiaisonRequest,
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

      {clientRequestId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.originatingClientRequestId ? "text-destructive" : ""
            )}
          >
            ClientRequest
          </Label>
          <Select
            defaultValue={liaisonRequest?.originatingClientRequestId}
            name="originatingClientRequestId"
          >
            <SelectTrigger
              className={cn(
                errors?.originatingClientRequestId
                  ? "ring ring-destructive"
                  : ""
              )}
            >
              <SelectValue placeholder="Select a clientRequest" />
            </SelectTrigger>
            <SelectContent>
              {clientRequests?.map((clientRequest) => (
                <SelectItem
                  key={clientRequest.id}
                  value={clientRequest.id.toString()}
                >
                  {clientRequest.id}
                  {/* TODO: Replace with a field from the clientRequest model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.originatingClientRequestId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.originatingClientRequestId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

      {companyId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.forwardedToSupplierId ? "text-destructive" : ""
            )}
          >
            Company
          </Label>
          <Select
            defaultValue={liaisonRequest?.forwardedToSupplierId}
            name="forwardedToSupplierId"
          >
            <SelectTrigger
              className={cn(
                errors?.forwardedToSupplierId ? "ring ring-destructive" : ""
              )}
            >
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.id}
                  {/* TODO: Replace with a field from the company model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.forwardedToSupplierId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.forwardedToSupplierId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.notes ? "text-destructive" : ""
          )}
        >
          Notes
        </Label>
        <Input
          type="text"
          name="notes"
          className={cn(errors?.notes ? "ring ring-destructive" : "")}
          defaultValue={liaisonRequest?.notes ?? ""}
        />
        {errors?.notes ? (
          <p className="text-xs text-destructive mt-2">{errors.notes[0]}</p>
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
                addOptimistic({ action: "delete", data: liaisonRequest });
              const error = await deleteLiaisonRequestAction(liaisonRequest.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: liaisonRequest,
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

export default LiaisonRequestForm;

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
