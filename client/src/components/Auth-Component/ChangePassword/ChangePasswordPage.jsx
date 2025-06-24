import React, { useCallback, useContext, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "@/Context/Auth-Context/Auth-Context";
axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

const formSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value), {
      message: "Password must contain at least one special character",
    }),
});

export const ChangePasswordPage = () => {
  const { changeUserPw } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const email = location.state?.email;
      const otpSent = location.state?.otpSent;

      const newData = {
        // same wie in der otp page
        ...data,
        email,
        otpSent,
      };

      await changeUserPw(newData);
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
        <Card className="w-1/2 lg:w-1/3 md:w-1/2">
          <CardHeader>
            <CardTitle className="flex justify-self-center text-3xl">
              Password-Authentication
            </CardTitle>
            <CardDescription className="text-center">
              Enter the new password
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col space-y-3">
              <Label className="text-md">New Password</Label>
              <div className="relative">
                <Input
                  {...register("newPassword")}
                  type={showPassword ? "text" : "password"}
                />
                {errors.newPassword && (
                  <div className="text-red-600">
                    {errors.newPassword.message}
                  </div>
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
                save new password
              </Button>
            </CardContent>
          </form>
          <CardFooter className="felx justify-center">
            <div>
              back to{" "}
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
