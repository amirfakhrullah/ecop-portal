import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createClientRequest,
  deleteClientRequest,
  updateClientRequest,
} from "@/lib/api/clientRequests/mutations";
import { 
  clientRequestIdSchema,
  insertClientRequestParams,
  updateClientRequestParams 
} from "@/lib/db/schema/clientRequests";

export async function POST(req: Request) {
  try {
    const validatedData = insertClientRequestParams.parse(await req.json());
    const { clientRequest } = await createClientRequest(validatedData);

    revalidatePath("/clientRequests"); // optional - assumes you will have named route same as entity

    return NextResponse.json(clientRequest, { status: 201 });
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

    const validatedData = updateClientRequestParams.parse(await req.json());
    const validatedParams = clientRequestIdSchema.parse({ id });

    const { clientRequest } = await updateClientRequest(validatedParams.id, validatedData);

    return NextResponse.json(clientRequest, { status: 200 });
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

    const validatedParams = clientRequestIdSchema.parse({ id });
    const { clientRequest } = await deleteClientRequest(validatedParams.id);

    return NextResponse.json(clientRequest, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
