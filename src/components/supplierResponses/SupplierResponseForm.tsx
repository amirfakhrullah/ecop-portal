import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/supplier-responses/useOptimisticSupplierResponses";

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
import { Checkbox } from "@/components/ui/checkbox";

import {
  type SupplierResponse,
  insertSupplierResponseParams,
} from "@/lib/db/schema/supplierResponses";
import {
  createSupplierResponseAction,
  deleteSupplierResponseAction,
  updateSupplierResponseAction,
} from "@/lib/actions/supplierResponses";
import {
  type LiaisonRequest,
  type LiaisonRequestId,
} from "@/lib/db/schema/liaisonRequests";

const SupplierResponseForm = ({
  liaisonRequests,
  liaisonRequestId,
  supplierResponse,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  supplierResponse?: SupplierResponse | null;
  liaisonRequests: LiaisonRequest[];
  liaisonRequestId?: LiaisonRequestId;
  openModal?: (supplierResponse?: SupplierResponse) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<SupplierResponse>(insertSupplierResponseParams);
  const editing = !!supplierResponse?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("supplier-responses");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: SupplierResponse }
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
      toast.success(`SupplierResponse ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const supplierResponseParsed =
      await insertSupplierResponseParams.safeParseAsync({
        liaisonRequestId,
        ...payload,
      });
    if (!supplierResponseParsed.success) {
      setErrors(supplierResponseParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = supplierResponseParsed.data;
    const pendingSupplierResponse: SupplierResponse = {
      updatedAt: supplierResponse?.updatedAt ?? new Date(),
      createdAt: supplierResponse?.createdAt ?? new Date(),
      id: supplierResponse?.id ?? "",
      fromSupplierUserId: supplierResponse?.fromSupplierUserId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingSupplierResponse,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateSupplierResponseAction({
              ...values,
              id: supplierResponse.id,
            })
          : await createSupplierResponseAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingSupplierResponse,
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

      {liaisonRequestId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.respondsToLiaisonRequestId ? "text-destructive" : ""
            )}
          >
            LiaisonRequest
          </Label>
          <Select
            defaultValue={supplierResponse?.respondsToLiaisonRequestId ?? ""}
            name="respondsToLiaisonRequestId"
          >
            <SelectTrigger
              className={cn(
                errors?.respondsToLiaisonRequestId
                  ? "ring ring-destructive"
                  : ""
              )}
            >
              <SelectValue placeholder="Select a liaisonRequest" />
            </SelectTrigger>
            <SelectContent>
              {liaisonRequests?.map((liaisonRequest) => (
                <SelectItem
                  key={liaisonRequest.id}
                  value={liaisonRequest.id.toString()}
                >
                  {liaisonRequest.id}
                  {/* TODO: Replace with a field from the liaisonRequest model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.respondsToLiaisonRequestId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.respondsToLiaisonRequestId[0]}
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
            errors?.isApproved ? "text-destructive" : ""
          )}
        >
          Is Approved
        </Label>
        <br />
        <Checkbox
          defaultChecked={!!supplierResponse?.isApproved}
          name={"isApproved"}
          className={cn(errors?.isApproved ? "ring ring-destructive" : "")}
        />
        {errors?.isApproved ? (
          <p className="text-xs text-destructive mt-2">
            {errors.isApproved[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.price ? "text-destructive" : ""
          )}
        >
          Price
        </Label>
        <Input
          type="text"
          name="price"
          className={cn(errors?.price ? "ring ring-destructive" : "")}
          defaultValue={supplierResponse?.price ?? ""}
        />
        {errors?.price ? (
          <p className="text-xs text-destructive mt-2">{errors.price[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.unitCost ? "text-destructive" : ""
          )}
        >
          Unit Cost
        </Label>
        <Input
          type="text"
          name="unitCost"
          className={cn(errors?.unitCost ? "ring ring-destructive" : "")}
          defaultValue={supplierResponse?.unitCost ?? ""}
        />
        {errors?.unitCost ? (
          <p className="text-xs text-destructive mt-2">{errors.unitCost[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.printPlateCost ? "text-destructive" : ""
          )}
        >
          Print Plate Cost
        </Label>
        <Input
          type="text"
          name="printPlateCost"
          className={cn(errors?.printPlateCost ? "ring ring-destructive" : "")}
          defaultValue={supplierResponse?.printPlateCost ?? ""}
        />
        {errors?.printPlateCost ? (
          <p className="text-xs text-destructive mt-2">
            {errors.printPlateCost[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.dieCost ? "text-destructive" : ""
          )}
        >
          Die Cost
        </Label>
        <Input
          type="text"
          name="dieCost"
          className={cn(errors?.dieCost ? "ring ring-destructive" : "")}
          defaultValue={supplierResponse?.dieCost ?? ""}
        />
        {errors?.dieCost ? (
          <p className="text-xs text-destructive mt-2">{errors.dieCost[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.otherSetupCost ? "text-destructive" : ""
          )}
        >
          Other Setup Cost
        </Label>
        <Input
          type="text"
          name="otherSetupCost"
          className={cn(errors?.otherSetupCost ? "ring ring-destructive" : "")}
          defaultValue={supplierResponse?.otherSetupCost ?? ""}
        />
        {errors?.otherSetupCost ? (
          <p className="text-xs text-destructive mt-2">
            {errors.otherSetupCost[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.deliveryCost ? "text-destructive" : ""
          )}
        >
          Delivery Cost
        </Label>
        <Input
          type="text"
          name="deliveryCost"
          className={cn(errors?.deliveryCost ? "ring ring-destructive" : "")}
          defaultValue={supplierResponse?.deliveryCost ?? ""}
        />
        {errors?.deliveryCost ? (
          <p className="text-xs text-destructive mt-2">
            {errors.deliveryCost[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.tax ? "text-destructive" : ""
          )}
        >
          Tax
        </Label>
        <Input
          type="text"
          name="tax"
          className={cn(errors?.tax ? "ring ring-destructive" : "")}
          defaultValue={supplierResponse?.tax ?? ""}
        />
        {errors?.tax ? (
          <p className="text-xs text-destructive mt-2">{errors.tax[0]}</p>
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
                addOptimistic({ action: "delete", data: supplierResponse });
              const error = await deleteSupplierResponseAction(
                supplierResponse.id
              );
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: supplierResponse,
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

export default SupplierResponseForm;

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
