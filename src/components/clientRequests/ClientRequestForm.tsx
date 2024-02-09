import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/client-requests/useOptimisticClientRequests";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import { Checkbox } from "@/components/ui/checkbox";

import {
  type ClientRequest,
  insertClientRequestParams,
  importanceType,
} from "@/lib/db/schema/clientRequests";
import {
  createClientRequestAction,
  deleteClientRequestAction,
  updateClientRequestAction,
} from "@/lib/actions/clientRequests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ClientRequestForm = ({
  clientRequest,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  clientRequest?: ClientRequest | null;

  openModal?: (clientRequest?: ClientRequest) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<ClientRequest>(insertClientRequestParams);
  const editing = !!clientRequest?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("client-requests");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: ClientRequest }
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
      toast.success(`ClientRequest ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const clientRequestParsed = await insertClientRequestParams.safeParseAsync({
      ...payload,
    });
    if (!clientRequestParsed.success) {
      setErrors(clientRequestParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = clientRequestParsed.data;
    const pendingClientRequest: ClientRequest = {
      updatedAt: clientRequest?.updatedAt ?? new Date(),
      createdAt: clientRequest?.createdAt ?? new Date(),
      id: clientRequest?.id ?? "",
      fromClientUserId: clientRequest?.fromClientUserId ?? "",
      ...values,
      fields: clientRequest?.fields ?? null,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingClientRequest,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateClientRequestAction({ ...values, id: clientRequest.id })
          : await createClientRequestAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingClientRequest,
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
            errors?.productId ? "text-destructive" : ""
          )}
        >
          Product Id
        </Label>
        <Input
          type="text"
          name="productId"
          className={cn(errors?.productId ? "ring ring-destructive" : "")}
          defaultValue={clientRequest?.productId ?? ""}
        />
        {errors?.productId ? (
          <p className="text-xs text-destructive mt-2">{errors.productId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.productId ? "text-destructive" : ""
          )}
        >
          Importance Type
        </Label>
        <Select
          defaultValue={clientRequest?.importanceType ?? ""}
          name="importanceType"
        >
          <SelectTrigger
            className={cn(
              errors?.importanceType ? "ring ring-destructive" : ""
            )}
          >
            <SelectValue placeholder="Select importance type" />
          </SelectTrigger>
          <SelectContent>
            {importanceType.enumValues.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.importanceType ? (
          <p className="text-xs text-destructive mt-2">
            {errors.importanceType[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.isArchived ? "text-destructive" : ""
          )}
        >
          Is Archived
        </Label>
        <br />
        <Checkbox
          defaultChecked={clientRequest?.isArchived}
          name={"isArchived"}
          className={cn(errors?.isArchived ? "ring ring-destructive" : "")}
        />
        {errors?.isArchived ? (
          <p className="text-xs text-destructive mt-2">
            {errors.isArchived[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.isFavorite ? "text-destructive" : ""
          )}
        >
          Is Favorite
        </Label>
        <br />
        <Checkbox
          defaultChecked={clientRequest?.isFavorite}
          name={"isFavorite"}
          className={cn(errors?.isFavorite ? "ring ring-destructive" : "")}
        />
        {errors?.isFavorite ? (
          <p className="text-xs text-destructive mt-2">
            {errors.isFavorite[0]}
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
          defaultValue={clientRequest?.email ?? ""}
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
            errors?.counter ? "text-destructive" : ""
          )}
        >
          Counter
        </Label>
        <Input
          type="text"
          name="counter"
          className={cn(errors?.counter ? "ring ring-destructive" : "")}
          defaultValue={clientRequest?.counter ?? ""}
        />
        {errors?.counter ? (
          <p className="text-xs text-destructive mt-2">{errors.counter[0]}</p>
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
                addOptimistic({ action: "delete", data: clientRequest });
              const error = await deleteClientRequestAction(clientRequest.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: clientRequest,
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

export default ClientRequestForm;

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
