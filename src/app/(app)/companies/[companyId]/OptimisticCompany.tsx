"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/companies/useOptimisticCompanies";
import { type Company } from "@/lib/db/schema/companies";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CompanyForm from "@/components/companies/CompanyForm";

export default function OptimisticCompany({ company }: { company: Company }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Company) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCompany, setOptimisticCompany] = useOptimistic(company);
  const updateCompany: TAddOptimistic = (input) =>
    setOptimisticCompany({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CompanyForm
          company={company}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCompany}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{company.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticCompany.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticCompany, null, 2)}
      </pre>
    </div>
  );
}
