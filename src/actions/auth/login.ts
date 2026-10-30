"use server";

import { signIn } from "@/src/auth.config";
import { AuthError } from "next-auth";

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // console.log(Object.fromEntries(formData));
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Error desconocido.";
      }
    }
    throw error;
  }
}

export const login = async (email: string, password: string) => {
  // Implementation for login function
  try {
    await signIn("credentials", { email, password });
    return { ok: true };
  } catch (error) {
    console.error("Login error:", error);
    return { ok: false };
  }
}