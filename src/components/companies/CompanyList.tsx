"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Company, CompleteCompany } from "@/lib/db/schema/companies";
import Modal from "@/components/shared/Modal";

import { useOptimisticCompanies } from "@/app/(app)/companies/useOptimisticCompanies";
import { Button } from "@/components/ui/button";
import CompanyForm from "./CompanyForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (company?: Company) => void;

export default function CompanyList({
  companies,
   
}: {
  companies: CompleteCompany[];
   
}) {
  const { optimisticCompanies, addOptimisticCompany } = useOptimisticCompanies(
    companies,
     
  );
  const [open, setOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const openModal = (company?: Company) => {
    setOpen(true);
    company ? setActiveCompany(company) : setActiveCompany(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCompany ? "Edit Company" : "Create Company"}
      >
        <CompanyForm
          company={activeCompany}
          addOptimistic={addOptimisticCompany}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticCompanies.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticCompanies.map((company) => (
            <Company
              company={company}
              key={company.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Company = ({
  company,
  openModal,
}: {
  company: CompleteCompany;
  openModal: TOpenModal;
}) => {
  const optimistic = company.id === "optimistic";
  const deleting = company.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("companies")
    ? pathname
    : pathname + "/companies/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{company.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + company.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No companies
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new company.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Companies </Button>
      </div>
    </div>
  );
};
