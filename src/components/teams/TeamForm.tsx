import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/teams/useOptimisticTeams";

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
  type Team,
  insertTeamParams,
  teamRoleType,
} from "@/lib/db/schema/teams";
import {
  createTeamAction,
  deleteTeamAction,
  updateTeamAction,
} from "@/lib/actions/teams";
import { type Company, type CompanyId } from "@/lib/db/schema/companies";

const TeamForm = ({
  companies,
  companyId,
  team,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  team?: Team | null;
  companies: Company[];
  companyId?: CompanyId;
  openModal?: (team?: Team) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Team>(insertTeamParams);
  const editing = !!team?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("teams");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Team }
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
      toast.success(`Team ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const teamParsed = await insertTeamParams.safeParseAsync({
      companyId,
      ...payload,
    });
    if (!teamParsed.success) {
      setErrors(teamParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = teamParsed.data;
    const pendingTeam: Team = {
      updatedAt: team?.updatedAt ?? new Date(),
      createdAt: team?.createdAt ?? new Date(),
      id: team?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingTeam,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateTeamAction({ ...values, id: team.id })
          : await createTeamAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingTeam,
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
            errors?.title ? "text-destructive" : ""
          )}
        >
          Title
        </Label>
        <Input
          type="text"
          name="title"
          className={cn(errors?.title ? "ring ring-destructive" : "")}
          defaultValue={team?.title ?? ""}
        />
        {errors?.title ? (
          <p className="text-xs text-destructive mt-2">{errors.title[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {companyId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.companyId ? "text-destructive" : ""
            )}
          >
            Company
          </Label>
          <Select defaultValue={team?.companyId} name="companyId">
            <SelectTrigger
              className={cn(errors?.companyId ? "ring ring-destructive" : "")}
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
          {errors?.companyId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.companyId[0]}
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
            errors?.roleType ? "text-destructive" : ""
          )}
        >
          Role Type
        </Label>
        <Select defaultValue={team?.roleType} name="roleType">
          <SelectTrigger
            className={cn(errors?.roleType ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent>
            {teamRoleType.enumValues?.map((roleType) => (
              <SelectItem key={roleType} value={roleType}>
                {roleType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.roleType ? (
          <p className="text-xs text-destructive mt-2">{errors.roleType[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: team });
              const error = await deleteTeamAction(team.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: team,
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

export default TeamForm;

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
