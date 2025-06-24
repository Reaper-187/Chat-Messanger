import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputOTP, InputOTPSlot, InputOTPSeparator } from "@c/ui/input-otp";
import { Button } from "@c/ui/button";
import { Card } from "@c/ui/card";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, AuthContext } from "@c/Context/AuthContext";
import axios from "axios";

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

const OtpformSchema = z.object({
  otpSent: z
    .string()
    .length(6, { message: "Your one-time password must be 6 digits." })
    .regex(/^\d+$/, { message: "Only numbers are allowed." }),
});

export const OneTimeOtp = () => {
  const { authenticateOtp } = useAuth(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OtpformSchema),
    defaultValues: {
      otpSent: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const email = location.state?.email; //email wird aus ForgotPW extrahiert
      const otpSent = data.otpSent;
      const newData = {
        // da backend data + email obj erwartet muss das ein neus onj erstellt werden
        ...data,
        email,
      };
      await authenticateOtp(newData);
      navigate("/change-password", { state: { email, otpSent } });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "An unknown error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-full p-5 space-y-4 max-w-md">
        <h1 className="text-center text-2xl font-semibold">
          OTP-Authentication
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="otpSent"
            control={control}
            render={({ field }) => (
              <>
                <InputOTP
                  value={field.value}
                  onChange={field.onChange}
                  maxLength={6}
                >
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSeparator />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSeparator />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTP>
                {errors.otpSent && (
                  <p className="text-sm text-red-500">
                    {errors.otpSent.message}
                  </p>
                )}
              </>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </div>
  );
};
