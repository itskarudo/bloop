"use client";

import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FieldErrors, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { LoginArgs, useLogin } from "@/hooks/api/auth/useLogin";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "bloop-utils/validation";
import { AxiosError } from "axios";
import { ServerError } from "bloop-utils/types";
import { getErrorMessage } from "bloop-utils/validation/getErrorMessage";
import { Label } from "@/components/ui/label";

const Login = () => {
  const auth = useAuth();

  const mutation = useLogin();

  const form = useForm<LoginArgs>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const handleError = (errors: FieldErrors<LoginArgs>) => {
    if (errors.username?.message)
      toast.error(getErrorMessage(errors.username.message));
    else if (errors.password?.message)
      toast.error(getErrorMessage(errors.password.message));
  };

  const handleSubmit = async (values: LoginArgs) => {
    try {
      const { data } = await mutation.mutateAsync(values);
      auth.login(data.accessToken);
      toast.success("Logged in successfully.");
      if (!data.ok) return;
    } catch (e) {
      const error = e as AxiosError<ServerError>;
      if (!error.response) return;

      for (let code of error.response.data.errors)
        toast.error(getErrorMessage(code));
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm p-6 m-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, handleError)}
            className="space-y-4"
          >
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Username</Label>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Password</Label>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-4">
                <Button
                  className="w-full"
                  type="submit"
                  disabled={mutation.isPending}
                >
                  Sign In
                </Button>
                <p className="text-center text-sm text-muted-foreground hover:underline">
                  <Link href="/register">Don't have an account?</Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
};

export default Login;
