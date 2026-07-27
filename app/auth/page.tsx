"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

const authSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Invalid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

enum AuthMode {
  LOGIN = "login",
  REGISTER = "register",
}

const loginSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .required();

const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    phoneNumber: z.string().min(10, "Invalid phone number"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["buyer", "owner"]).default("buyer"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;

type RegisterFormData = z.infer<typeof registerSchema>;

type AuthFormData = LoginFormData | RegisterFormData;

const loginDefaultValues = {
  email: "",
  password: "",
};

const registerDefaultValues = {
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  role: "buyer" as const,
};

export default function Auth() {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [authenticate, setAuthenticate] = useState({
    loggingIn: false,
    registering: false,
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(
      authMode === AuthMode.LOGIN ? loginSchema : registerSchema,
    ),
    defaultValues: loginDefaultValues,
  });

  useEffect(() => {
    console.log("ERRORS: ", errors);
  }, [errors]);

  const router = useRouter();

  // Deep link: /auth?role=owner opens the Register tab with that role
  // preselected (used by the "For owners" navbar link).
  useEffect(() => {
    const role = new URLSearchParams(window.location.search).get("role");
    if (role === "owner" || role === "buyer") {
      setAuthMode(AuthMode.REGISTER);
      reset({ ...registerDefaultValues, role });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Where a user lands after authenticating, based on their role.
  // Honors a ?next= param set by the proxy when it bounced them here.
  const postAuthDestination = (role?: string) => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next?.startsWith("/")) return next;
    return role === "owner" ? "/owner/dashboard" : "/listing";
  };

  const onSubmit = handleSubmit(async (data) => {
    const supabase = createClient();

    if (authMode === AuthMode.LOGIN) {
      setAuthenticate((prev) => ({ ...prev, loggingIn: true }));
      const loginData = data as LoginFormData;
      try {
        const { data: session, error } = await supabase.auth.signInWithPassword(
          {
            email: loginData.email,
            password: loginData.password,
          },
        );

        if (error) {
          if (error.code === "email_not_confirmed") {
            const { error: resendError } = await supabase.auth.resend({
              type: "signup",
              email: loginData.email,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/confirm`,
              },
            });
            if (resendError) {
              toast.error(resendError.message);
            } else {
              toast.success(
                "Please confirm your email — a new confirmation link was sent",
                { duration: 10000 },
              );
            }
            return;
          }
          toast.error(error.message ?? "Error Signing In");
          return;
        }

        toast.success("Sign In Successful");
        const role = session.user?.user_metadata?.role as string | undefined;
        router.push(postAuthDestination(role));
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error Signing In",
        );
        console.error(error);
      } finally {
        setAuthenticate((prev) => ({ ...prev, loggingIn: false }));
      }
      return;
    }

    // register
    const registerData = data as RegisterFormData;
    setAuthenticate((prev) => ({ ...prev, registering: true }));
    try {
      const destination = postAuthDestination(registerData.role);
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(destination)}`,
          data: {
            first_name: registerData.firstName,
            last_name: registerData.lastName,
            phone: registerData.phoneNumber,
            role: registerData.role,
          },
        },
      });

      if (error) {
        toast.error(error.message ?? "Error Signing Up");
        return;
      }

      // Supabase returns a user with no identities when the email is
      // already registered (to avoid leaking account existence).
      if (signUpData.user?.identities?.length === 0) {
        toast.error(
          "An account with this email already exists. Try logging in.",
        );
        return;
      }

      if (signUpData.session) {
        // Email confirmation disabled — user is signed in immediately
        toast.success("Sign Up Successful");
        router.push(destination);
        router.refresh();
        return;
      }

      toast.success("Check your email to confirm your account", {
        duration: 10000,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error Signing Up");
      console.error(err);
    } finally {
      setAuthenticate((prev) => ({ ...prev, registering: false }));
    }
  });
  return (
    <div className="w-full flex flex-col lg:flex-row">
      <div className="hidden lg:flex w-full lg:w-1/2 min-h-screen bg-[#051d15] flex-col items-center justify-center p-12">
        <div className="max-w-[500px] flex flex-col items-start justify-center gap-12">
          <h3 className="text-white">VETTA</h3>
          <div className="flex flex-col items-start gap-8">
            <p className="font-mono text-[#8a948e]">// inspect from anywhere</p>
            <h1 className="text-white text-4xl font-extrabold">
              Trust a property before you ever set foot in it.
            </h1>
            <p className="text-[#8a948e]">
              Verified walkthrough videos and live guided inspections for buyers
              and renters across the diaspora.
            </p>

            <div className="flex gap-8 items-center text-white">
              <h4>✓ verified owners</h4>
              <h4>✓ live video tours</h4>
              <h4>✓ 24/7 support</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center gap-8 p-6 sm:p-12 min-h-screen bg-[#eceeeb]">
        <div className="lg:hidden text-center">
          <span className="font-mono font-semibold tracking-[0.3em] text-[17px] text-[#051d15]">
            VETTA
          </span>
          <p className="font-mono text-[11px] text-[#8a948e] mt-1">
            {"// inspect from anywhere"}
          </p>
        </div>
        <div className="w-full max-w-md mx-auto flex flex-col justify-start">
          <form
            onSubmit={onSubmit}
            className="w-full mx-auto flex flex-col rounded-xl p-4 bg-white border border-[#eef1ee]"
          >
            <Tabs
              className="flex flex-col flex-1 h-full"
              value={authMode}
              onValueChange={(val) => {
                const mode = val as AuthMode;
                setAuthMode(mode);
                reset(
                  mode === AuthMode.LOGIN
                    ? loginDefaultValues
                    : registerDefaultValues,
                );
                console.log("Trigger value: ", val);
              }}
            >
              <TabsList>
                <TabsTrigger
                  value={AuthMode.LOGIN}
                  // onChange={(val) => console.log("Trigger value: ", val)}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger value={AuthMode.REGISTER}>Register</TabsTrigger>
              </TabsList>
              <TabsContent
                value={AuthMode.LOGIN}
                className="flex flex-col flex-1"
              >
                <FieldSet>
                  <FieldLegend>Log In</FieldLegend>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Email Address</FieldLabel>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Input
                              {...field}
                              type="email"
                              placeholder="johndoe@gmail.com"
                              autoComplete="off"
                            />
                            {errors.email && (
                              <FieldError>{errors.email.message}</FieldError>
                            )}
                          </>
                        )}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Password</FieldLabel>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Input
                              {...field}
                              type="password"
                              autoComplete="off"
                            />
                            {errors.password && (
                              <FieldError>{errors.password.message}</FieldError>
                            )}
                          </>
                        )}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <Button
                  size="lg"
                  className="mt-10"
                  type="submit"
                  disabled={authenticate.loggingIn}
                >
                  {authenticate.loggingIn ? <Spinner /> : "Log In"}
                </Button>
              </TabsContent>
              <TabsContent
                value={AuthMode.REGISTER}
                className="flex flex-col flex-1"
              >
                <FieldSet className="mt-5">
                  <FieldLegend>Create Account</FieldLegend>

                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-3 mb-4 mt-2">
                        <span className="text-[11px] font-mono tracking-widest text-muted-foreground uppercase">
                          I am a
                        </span>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="button"
                            onClick={() => field.onChange("buyer")}
                            className={`flex-1 relative flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all ${
                              field.value === "buyer"
                                ? "border-[#0c1411] bg-[#eef3f0]"
                                : "border-border/60 bg-white hover:border-gray-300"
                            }`}
                          >
                            <span className="font-bold text-[#0c1411] text-base mb-1">
                              Buyer / Renter
                            </span>
                            <span className="text-muted-foreground text-xs">
                              Inspect & book homes remotely
                            </span>
                            {field.value === "buyer" && (
                              <svg
                                className="absolute top-4 right-4 w-5 h-5 text-[#0c1411]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => field.onChange("owner")}
                            className={`flex-1 relative flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all ${
                              field.value === "owner"
                                ? "border-[#0c1411] bg-[#eef3f0]"
                                : "border-border/60 bg-white hover:border-gray-300"
                            }`}
                          >
                            <span className="font-bold text-[#0c1411] text-base mb-1">
                              Owner / Agent
                            </span>
                            <span className="text-muted-foreground text-xs">
                              List homes & take requests
                            </span>
                            {field.value === "owner" && (
                              <svg
                                className="absolute top-4 right-4 w-5 h-5 text-[#0c1411]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  />

                  <FieldGroup className="flex flex-col sm:flex-row">
                    <Field>
                      <FieldLabel>First Name</FieldLabel>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <>
                            <Input
                              {...field}
                              placeholder="John"
                              autoComplete="off"
                            />
                            {fieldState.error?.message && (
                              <FieldError>
                                {fieldState.error?.message}
                              </FieldError>
                            )}
                          </>
                        )}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Last Name</FieldLabel>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <>
                            <Input
                              {...field}
                              placeholder="Doe"
                              autoComplete="off"
                            />
                            {fieldState.error?.message && (
                              <FieldError>
                                {fieldState.error.message}
                              </FieldError>
                            )}
                          </>
                        )}
                      />
                    </Field>
                  </FieldGroup>

                  <FieldGroup className="flex flex-col sm:flex-row">
                    <Field>
                      <FieldLabel>Email Address</FieldLabel>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Input
                              {...field}
                              type="email"
                              placeholder="johndoe@gmail.com"
                              autoComplete="off"
                            />
                            {errors.email && (
                              <FieldError>{errors.email.message}</FieldError>
                            )}
                          </>
                        )}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Phone Number</FieldLabel>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field, fieldState }) => (
                          <>
                            <Input {...field} autoComplete="off" />
                            {fieldState.error?.message && (
                              <FieldError>
                                {fieldState.error.message}
                              </FieldError>
                            )}
                          </>
                        )}
                      />
                    </Field>
                  </FieldGroup>

                  <FieldGroup>
                    <Field>
                      <FieldLabel>Password</FieldLabel>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Input
                              {...field}
                              type="password"
                              autoComplete="off"
                            />
                            {errors.password && (
                              <FieldError>{errors.password.message}</FieldError>
                            )}
                          </>
                        )}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Confirm Password</FieldLabel>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field, fieldState }) => (
                          <>
                            <Input
                              {...field}
                              type="password"
                              autoComplete="off"
                            />
                            {fieldState.error?.message && (
                              <FieldError>
                                {fieldState.error.message}
                              </FieldError>
                            )}
                          </>
                        )}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <Button
                  size="lg"
                  className="mt-10"
                  type="submit"
                  disabled={authenticate.registering}
                >
                  {authenticate.registering ? <Spinner /> : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </div>
    </div>
  );
}
