"use client";
import { toast } from "sonner";
import { errorMessage } from "./api";

export { toast };

/** Show the server's success message (or a fallback). */
export const notifySuccess = (res: { message?: string } | undefined, fallback: string) =>
  toast.success(res?.message || fallback);

/** Show the server's error message (or a fallback). */
export const notifyError = (err: unknown, fallback?: string) => toast.error(errorMessage(err, fallback));

export default function legacyToast(message: string) {
  toast(message);
}
