"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export const runtime = "edge";

const SignUpForm = () => {
  const router = useRouter();
  const { publicKey, signMessage } = useWallet();
  const [form, setForm] = useState({
    email: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!publicKey || !signMessage) {
        throw new Error("Wallet not connected");
      }

      const message = new TextEncoder().encode("You're signing-up to BountySpread");
      const signature = await signMessage(message);

      const response = await axios.post(`${window.location.origin}/api/signup`, {
        email: form.email,
        username: form.username,
        publicKey: publicKey.toString(),
        signature: Buffer.from(signature).toString('hex'),
      });

      if (!response.data.success) {
        toast.error("User already exists with the username or email");
      } else {
        toast.success("Account created successfully");
        router.push("/dashboard/newBounty");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <div className="h-full w-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 blur-3xl"></div>
        </div>
        <div className="absolute inset-0 opacity-5 animate-pulse delay-1000">
          <div className="h-full w-full bg-gradient-to-tl from-zinc-600 via-zinc-700 to-zinc-900 blur-3xl"></div>
        </div>
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-opacity-80">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-zinc-100 text-center">Sign Up</CardTitle>
          <CardDescription className="text-zinc-400 text-center">Create your account to start using BARK Blink Protocol</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="bg-zinc-700 placeholder-zinc-400 text-white border-zinc-600 focus:ring-zinc-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-300">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="bg-zinc-700 placeholder-zinc-400 text-white border-zinc-600 focus:ring-zinc-500"
                placeholder="xyz_999"
                required
              />
            </div>

            <WalletMultiButton
              style={{
                width: "100%",
                textAlign: "center",
                backgroundColor: "#52525b",
                height: "48px",
                borderRadius: "0.5rem",
              }}
            />

            <Button
              type="submit"
              className="w-full bg-zinc-600 text-zinc-100 hover:bg-zinc-500 focus:ring-zinc-400 focus:ring-offset-zinc-800"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-zinc-400 text-sm">
            Please sign up before creating your first customizable Blink!
          </p>
        </CardFooter>
      </Card>
      <Toaster position="top-center" />
    </div>
  );
};

export default SignUpForm;