import { db } from "@/lib/supabase/db";

export type SubscribeSource = "hero" | "footer";

export type SubscribeResult =
  | { ok: true }
  | {
      ok: false;
      code: "invalid_email" | "invalid_source" | "duplicate" | "server_error";
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export function isValidSource(source: string): source is SubscribeSource {
  return source === "hero" || source === "footer";
}

export async function subscribeEmail(
  email: string,
  source: SubscribeSource,
): Promise<SubscribeResult> {
  const { error } = await db.from("subscribers").insert({
    email: email.toLowerCase(),
    source,
  });

  if (!error) {
    return { ok: true };
  }

  if (error.code === "23505") {
    return { ok: false, code: "duplicate" };
  }

  return { ok: false, code: "server_error" };
}
