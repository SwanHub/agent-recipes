import {
  isValidEmail,
  isValidSource,
  subscribeEmail,
} from "@/lib/subscribers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { email?: string; source?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const email = body.email?.trim();
  const source = body.source;

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  if (!source || !isValidSource(source)) {
    return NextResponse.json({ error: "invalid_source" }, { status: 400 });
  }

  const result = await subscribeEmail(email, source);

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }

  if (result.code === "duplicate") {
    return NextResponse.json({ error: "already_subscribed" }, { status: 409 });
  }

  return NextResponse.json({ error: "server_error" }, { status: 500 });
}
