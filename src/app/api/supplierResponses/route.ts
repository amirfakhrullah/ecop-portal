import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createSupplierResponse,
  deleteSupplierResponse,
  updateSupplierResponse,
} from "@/lib/api/supplierResponses/mutations";
import { 
  supplierResponseIdSchema,
  insertSupplierResponseParams,
  updateSupplierResponseParams 
} from "@/lib/db/schema/supplierResponses";

export async function POST(req: Request) {
  try {
    const validatedData = insertSupplierResponseParams.parse(await req.json());
    const { supplierResponse } = await createSupplierResponse(validatedData);

    revalidatePath("/supplierResponses"); // optional - assumes you will have named route same as entity

    return NextResponse.json(supplierResponse, { status: 201 });
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

    const validatedData = updateSupplierResponseParams.parse(await req.json());
    const validatedParams = supplierResponseIdSchema.parse({ id });

    const { supplierResponse } = await updateSupplierResponse(validatedParams.id, validatedData);

    return NextResponse.json(supplierResponse, { status: 200 });
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

    const validatedParams = supplierResponseIdSchema.parse({ id });
    const { supplierResponse } = await deleteSupplierResponse(validatedParams.id);

    return NextResponse.json(supplierResponse, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
