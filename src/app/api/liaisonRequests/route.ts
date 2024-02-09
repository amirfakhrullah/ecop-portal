import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createLiaisonRequest,
  deleteLiaisonRequest,
  updateLiaisonRequest,
} from "@/lib/api/liaisonRequests/mutations";
import { 
  liaisonRequestIdSchema,
  insertLiaisonRequestParams,
  updateLiaisonRequestParams 
} from "@/lib/db/schema/liaisonRequests";

export async function POST(req: Request) {
  try {
    const validatedData = insertLiaisonRequestParams.parse(await req.json());
    const { liaisonRequest } = await createLiaisonRequest(validatedData);

    revalidatePath("/liaisonRequests"); // optional - assumes you will have named route same as entity

    return NextResponse.json(liaisonRequest, { status: 201 });
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

    const validatedData = updateLiaisonRequestParams.parse(await req.json());
    const validatedParams = liaisonRequestIdSchema.parse({ id });

    const { liaisonRequest } = await updateLiaisonRequest(validatedParams.id, validatedData);

    return NextResponse.json(liaisonRequest, { status: 200 });
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

    const validatedParams = liaisonRequestIdSchema.parse({ id });
    const { liaisonRequest } = await deleteLiaisonRequest(validatedParams.id);

    return NextResponse.json(liaisonRequest, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
