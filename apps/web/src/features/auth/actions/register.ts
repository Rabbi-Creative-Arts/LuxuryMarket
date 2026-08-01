"use server";

import { prisma } from "../../../lib/prisma";
import { registerSchema, type RegisterInput } from "../schemas/register";
import { hashPassword } from "../services/password.service";

export type RegisterResult = {
  success: boolean;
  message: string;
};

export async function register(
  input: RegisterInput
): Promise<RegisterResult> {
  try {
    // Validate input
    const parsed = registerSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message:
          parsed.error.issues[0]?.message ??
          "Invalid registration data.",
      };
    }

    const {
      firstName,
      lastName,
      email,
      password,
    } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Registration successful.",
    };
  } catch (error) {
    console.error("Registration Error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
