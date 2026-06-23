import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "#/lib/auth-client";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({ error: "Invalid email" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInValues) {
    const { error } = await authClient.signIn.email(values);
    if (error) {
      setError("root", { message: error.message ?? "Sign in failed" });
      return;
    }
    router.navigate({ to: "/" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signin-email" className="text-sm text-muted-foreground">
          Email
        </Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="signin-password"
          className="text-sm text-muted-foreground"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-sm text-muted-foreground"
        >
          Forgot password?
        </Button>
      </div>

      {errors.root && (
        <p className="text-sm text-center text-destructive">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          "Signing in…"
        ) : (
          <>
            Sign in <ArrowRight />
          </>
        )}
      </Button>
    </form>
  );
}

function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  async function onSubmit(values: SignUpValues) {
    const { error } = await authClient.signUp.email(values);
    if (error) {
      setError("root", { message: error.message ?? "Sign up failed" });
      return;
    }
    router.navigate({ to: "/" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-name" className="text-sm text-muted-foreground">
          Full name
        </Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-email" className="text-sm text-muted-foreground">
          Email
        </Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="signup-password"
          className="text-sm text-muted-foreground"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="text-sm text-center text-destructive">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          "Creating account…"
        ) : (
          <>
            Create account <ArrowRight />
          </>
        )}
      </Button>
    </form>
  );
}

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen flex">
      {/* Left — form panel */}
      <div className="flex flex-col w-full lg:w-[45%] px-10 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-auto">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            MyEGDentist
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </Button>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold tracking-tight mb-8">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h1>

            {mode === "signin" ? <SignInForm /> : <SignUpForm />}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  New to MyEGDentist?{" "}
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => setMode("signup")}
                    className="h-auto p-0 font-semibold text-foreground text-sm"
                  >
                    Create an account
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => setMode("signin")}
                    className="h-auto p-0 font-semibold text-foreground text-sm"
                  >
                    Sign in
                  </Button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
          <span>© 2026 MyEGDentist</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>

      {/* Right — photo panel */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img
          src="/pyramids.jpg"
          alt="Pyramids of Egypt"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
