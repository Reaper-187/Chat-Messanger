import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies
const registerApi = import.meta.env.VITE_API_REGISTER;

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-z]+$/, "Name must contain only letters"),
  email: z.string().toLowerCase().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value), {
      message: "Password must contain at least one special character",
    }),
});

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await axios.post(registerApi, data);
      if (response.status === 201) {
        toast(response.data.message);
      }
      navigate("/login");
    } catch (err) {
      console.error(err, "Error with the Registration");
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full sm:w-1/2 lg:w-1/3">
          <CardHeader>
            <CardTitle className="flex justify-self-center text-2xl sm:text-3xl ">
              Register
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to create an account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col space-y-3">
              <Label className="text-md">Name</Label>
              <Input {...register("name")} />
              {errors.name && (
                <div className="text-red-600">{errors.name.message}</div>
              )}
              <Label className="text-md">Email</Label>
              <Input {...register("email")} />
              {errors.email && (
                <div className="text-red-600">{errors.email.message}</div>
              )}
              <Label className="text-md">Password</Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                />
                {errors.password && (
                  <div className="text-red-600">{errors.password.message}</div>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button className="w-full font-semibold" type="submit">
                Sign in
              </Button>
            </CardContent>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-primary-foreground px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 px-4">
            <Button className="w-full font-semibold" varaint="outlone">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>

            <Button className="w-full font-semibold" varaint="outlone">
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <CardFooter className="felx justify-center">
            <div>
              You have an account already ?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-500 font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
