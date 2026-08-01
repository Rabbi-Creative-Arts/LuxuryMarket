"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";

import {
  registerSchema,
  type RegisterInput,
} from "../schemas/register";

import { register } from "../actions/register";

export default function RegisterForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    setServerError("");

    const result = await register(data);

    setLoading(false);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    alert("Registration successful!");

    router.push("/login");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <div>
        <Label htmlFor="firstName">First Name</Label>

        <Input
          id="firstName"
          placeholder="John"
          {...registerField("firstName")}
        />

        {errors.firstName && (
          <p style={{ color: "red", marginTop: 5 }}>
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="lastName">Last Name</Label>

        <Input
          id="lastName"
          placeholder="Doe"
          {...registerField("lastName")}
        />

        {errors.lastName && (
          <p style={{ color: "red", marginTop: 5 }}>
            {errors.lastName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...registerField("email")}
        />

        {errors.email && (
          <p style={{ color: "red", marginTop: 5 }}>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          type="password"
          {...registerField("password")}
        />

        {errors.password && (
          <p style={{ color: "red", marginTop: 5 }}>
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">
          Confirm Password
        </Label>

        <Input
          id="confirmPassword"
          type="password"
          {...registerField("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p style={{ color: "red", marginTop: 5 }}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          style={{
            color: "red",
            fontWeight: 600,
          }}
        >
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
