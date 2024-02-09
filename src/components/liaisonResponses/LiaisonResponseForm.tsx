import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/liaison-responses/useOptimisticLiaisonResponses";

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
  type LiaisonResponse,
  insertLiaisonResponseParams,
} from "@/lib/db/schema/liaisonResponses";
import {
  createLiaisonResponseAction,
  deleteLiaisonResponseAction,
  updateLiaisonResponseAction,
} from "@/lib/actions/liaisonResponses";
import {
  type SupplierResponse,
  type SupplierResponseId,
} from "@/lib/db/schema/supplierResponses";
import {
  type ClientRequest,
  type ClientRequestId,
} from "@/lib/db/schema/clientRequests";

const LiaisonResponseForm = ({
  supplierResponses,
  supplierResponseId,
  clientRequests,
  clientRequestId,
  liaisonResponse,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  liaisonResponse?: LiaisonResponse | null;
  supplierResponses: SupplierResponse[];
  supplierResponseId?: SupplierResponseId;
  clientRequests: ClientRequest[];
  clientRequestId?: ClientRequestId;
  openModal?: (liaisonResponse?: LiaisonResponse) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<LiaisonResponse>(insertLiaisonResponseParams);
  const editing = !!liaisonResponse?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("liaison-responses");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: LiaisonResponse }
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
      toast.success(`LiaisonResponse ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const liaisonResponseParsed =
      await insertLiaisonResponseParams.safeParseAsync({
        supplierResponseId,
        clientRequestId,
        ...payload,
      });
    if (!liaisonResponseParsed.success) {
      setErrors(liaisonResponseParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = liaisonResponseParsed.data;
    const pendingLiaisonResponse: LiaisonResponse = {
      updatedAt: liaisonResponse?.updatedAt ?? new Date(),
      createdAt: liaisonResponse?.createdAt ?? new Date(),
      id: liaisonResponse?.id ?? "",
      fromLiaisonUserId: liaisonResponse?.fromLiaisonUserId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingLiaisonResponse,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateLiaisonResponseAction({
              ...values,
              id: liaisonResponse.id,
            })
          : await createLiaisonResponseAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingLiaisonResponse,
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

      {supplierResponseId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.originatingSupplierResponseId ? "text-destructive" : ""
            )}
          >
            SupplierResponse
          </Label>
          <Select
            defaultValue={liaisonResponse?.originatingSupplierResponseId}
            name="originatingSupplierResponseId"
          >
            <SelectTrigger
              className={cn(
                errors?.originatingSupplierResponseId
                  ? "ring ring-destructive"
                  : ""
              )}
            >
              <SelectValue placeholder="Select a supplierResponse" />
            </SelectTrigger>
            <SelectContent>
              {supplierResponses?.map((supplierResponse) => (
                <SelectItem
                  key={supplierResponse.id}
                  value={supplierResponse.id}
                >
                  {supplierResponse.id}
                  {/* TODO: Replace with a field from the supplierResponse model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.originatingSupplierResponseId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.originatingSupplierResponseId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

      {clientRequestId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.respondsToClientRequestId ? "text-destructive" : ""
            )}
          >
            ClientRequest
          </Label>
          <Select
            defaultValue={liaisonResponse?.respondsToClientRequestId}
            name="respondsToClientRequestId"
          >
            <SelectTrigger
              className={cn(
                errors?.respondsToClientRequestId ? "ring ring-destructive" : ""
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
          {errors?.respondsToClientRequestId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.respondsToClientRequestId[0]}
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
            errors?.margin ? "text-destructive" : ""
          )}
        >
          Margin
        </Label>
        <Input
          type="text"
          name="margin"
          className={cn(errors?.margin ? "ring ring-destructive" : "")}
          defaultValue={liaisonResponse?.margin ?? ""}
        />
        {errors?.margin ? (
          <p className="text-xs text-destructive mt-2">{errors.margin[0]}</p>
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
          defaultValue={liaisonResponse?.unitCost ?? ""}
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
          defaultValue={liaisonResponse?.printPlateCost ?? ""}
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
          defaultValue={liaisonResponse?.dieCost ?? ""}
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
          defaultValue={liaisonResponse?.otherSetupCost ?? ""}
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
          defaultValue={liaisonResponse?.deliveryCost ?? ""}
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
          defaultValue={liaisonResponse?.tax ?? ""}
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
                addOptimistic({ action: "delete", data: liaisonResponse });
              const error = await deleteLiaisonResponseAction(
                liaisonResponse.id
              );
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: liaisonResponse,
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

export default LiaisonResponseForm;

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
