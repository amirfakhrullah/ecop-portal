import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createLiaisonResponse,
  deleteLiaisonResponse,
  updateLiaisonResponse,
} from "@/lib/api/liaisonResponses/mutations";
import {
  liaisonResponseIdSchema,
  insertLiaisonResponseParams,
  updateLiaisonResponseParams,
} from "@/lib/db/schema/liaisonResponses";

export async function POST(req: Request) {
  try {
    const validatedData = insertLiaisonResponseParams.parse(await req.json());
    const { liaisonResponse } = await createLiaisonResponse(validatedData);

    revalidatePath("/liaisonResponses"); // optional - assumes you will have named route same as entity

    return NextResponse.json(liaisonResponse, { status: 201 });
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

    const validatedData = updateLiaisonResponseParams.parse(await req.json());
    const validatedParams = liaisonResponseIdSchema.parse({ id });

    const { liaisonResponse } = await updateLiaisonResponse(
      validatedParams.id,
      validatedData
    );

    return NextResponse.json(liaisonResponse, { status: 200 });
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

    const validatedParams = liaisonResponseIdSchema.parse({ id });
    const { liaisonResponse } = await deleteLiaisonResponse(validatedParams.id);

    return NextResponse.json(liaisonResponse, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
