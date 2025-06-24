import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@c/ui/button";

const verifyApi = import.meta.env.VITE_API_VERIFY;

export const Verification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifiziere...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${verifyApi}?token=${token}`);
        if (response.data.success) {
          setMessage(
            "E-Mail erfolgreich verifiziert! Du kannst dich jetzt einloggen."
          );
        } else {
          setMessage(response.data.message || "Ein Fehler ist aufgetreten.");
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Fehler bei der Verifizierung. Bitte versuche es später erneut."
        );
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage("Kein Verifizierungs-Token gefunden.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex justify-self-center items-center space-y-3">
      <Card className="w-full p-5">
        <h1 className="text-2xl font-semibold">E-Mail-Authentication....</h1>

        <p>{message}</p>

        <Button className="w-fit">
          <Link to="/login">back to Login</Link>
        </Button>
      </Card>
    </div>
  );
};
