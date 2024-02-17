"use client";

import Link from "next/link";
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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RegisterArgs, useRegister } from "@/hooks/api/auth/useRegister";
import { toast } from "sonner";
import {} from "bloop-utils/types/ErrorCodes";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "bloop-utils/validation";
import { AxiosError } from "axios";
import { ServerError } from "bloop-utils/types";
import { getErrorMessage } from "bloop-utils/validation/getErrorMessage";
import { Label } from "@/components/ui/label";

const Register = () => {
  const router = useRouter();
  const mutation = useRegister();

  const form = useForm<RegisterArgs>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const handleError = (errors: FieldErrors<RegisterArgs>) => {
    if (errors.username?.message)
      toast.error(getErrorMessage(errors.username.message));
    if (errors.email?.message)
      toast.error(getErrorMessage(errors.email.message));
    if (errors.password?.message)
      toast.error(getErrorMessage(errors.password.message));
  };

  const handleSubmit = async (values: RegisterArgs) => {
    try {
      const {} = await mutation.mutateAsync(values);
      toast.success("Registered successfully.");
      router.push("/login");
    } catch (e) {
      const error = e as AxiosError<ServerError>;
      if (!error.response) return;

      for (let code of error.response?.data.errors)
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
              <CardTitle>Register</CardTitle>
              <CardDescription>Create a new account</CardDescription>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Email</Label>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
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
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  Sign Up
                </Button>
                <p className="text-center text-sm text-muted-foreground hover:underline">
                  <Link href="/login">Already have an account?</Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
};

export default Register;
