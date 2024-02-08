import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createCompany,
  deleteCompany,
  updateCompany,
} from "@/lib/api/companies/mutations";
import {
  companyIdSchema,
  insertCompanyParams,
  updateCompanyParams,
} from "@/lib/db/schema/companies";

export async function POST(req: Request) {
  try {
    const validatedData = insertCompanyParams.parse(await req.json());
    const { company } = await createCompany(validatedData);

    revalidatePath("/companies"); // optional - assumes you will have named route same as entity

    return NextResponse.json(company, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateCompanyParams.parse(await req.json());
    const validatedParams = companyIdSchema.parse({ id });

    const { company } = await updateCompany(validatedParams.id, validatedData);

    return NextResponse.json(company, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = companyIdSchema.parse({ id });
    const { company } = await deleteCompany(validatedParams.id);

    return NextResponse.json(company, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
