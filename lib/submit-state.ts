/**
 * Shape of the property-submission result.
 *
 * Kept out of the action module on purpose: a "use server" file may only export
 * async functions, so a plain object exported alongside the action does not
 * survive to the client.
 */
export type SubmitState = {
  status: "idle" | "error" | "ready";
  /** Keys into dict.submit.errors, resolved to text by the client. */
  errors: Partial<Record<"name" | "phone" | "type" | "status" | "location" | "notes" | "form", string>>;
  waUrl?: string;
};

export const initialSubmitState: SubmitState = { status: "idle", errors: {} };
