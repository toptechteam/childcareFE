import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@/config/urls";

export default function AccountCreated() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-[#000000]">
            Please check your email
          </CardTitle>
          <CardDescription className="text-[#555555]">
            We’ve sent your login details to your email address. If you don’t see it, check your spam/junk folder.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link to="/login">
            <Button className="w-full bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white">
              Go to Login
            </Button>
          </Link>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Childcare Stories Support")}`}
            className="text-center text-sm text-[#555555] hover:underline"
          >
            Contact Childcare Stories Support
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

