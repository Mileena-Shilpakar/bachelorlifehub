"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Sparkles } from "lucide-react";
import { toast } from "react-toastify"; // Make sure to install this package

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import LottieAnimation from "@/components/lottie";
import { loginUser } from "@/services/authService";
import axios from "axios";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [passwordVisible,setPasswordVisible] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error state before making request

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/login/",
        { email, password }
      );

      toast.success(response.data.detail);
      localStorage.setItem("task-token", response.data.access_token);
      localStorage.setItem("task-refresh-token", response.data.refresh_token);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);

      let errorMessage = "Something went wrong. Please try again.";

      if (err.response) {
        errorMessage =
          err.response.data?.detail ||
          (err.response.status === 400
            ? "Invalid email or password."
            : err.response.status === 401
            ? "Unauthorized access. Please check your credentials."
            : "An error occurred. Please try again.");
      } else if (err.request) {
        errorMessage =
          "No response from the server. Please check your connection.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary dark:bg-black items-center justify-center bg-athens-gray p-4">
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button
            variant="outline"
            className="flex items-center space-x-2 text-shuttle-gray hover:text-primary hover:bg-gray-100 transition-all dark:bg-[#BB86FC] dark:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Button>
        </Link>
      </div>

      <div className="w-*0 h-80">
        <LottieAnimation /> {/* Use the LottieAnimation client component */}
      </div>

      <Card className="overflow-hidden border bg-white dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-logan flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-shuttle-gray dark:text-white">
            Welcome to Bachelor's LifeHub
          </CardTitle>
          <CardDescription className="text-manatee dark:text-gray-500">
            Sign in to manage your tasks and earn rewards!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-shuttle-gray dark:text-gray-400">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="hello@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-botticelli dark:bg-[#444444] dark:border-none dark:focus:ring-0 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-shuttle-gray dark:text-gray-400">
                    Password
                  </Label>
                </div>
                <div className="relative">
                <Input
                  id="password"
                  required
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-botticelli dark:bg-[#444444] dark:border-none dark:focus:ring-0 dark:text-white"
                />
                <div 
                onClick={()=>setPasswordVisible(!passwordVisible)}
                className="absolute dark:text-gray-400 right-3 flex top-0 bottom-0 items-center ">
                  {passwordVisible ?
                  <EyeOff /> : <Eye />
                  }
                </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full dark:bg-[#BB86FC] dark:text-white"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-manatee dark:text-gray-500">
            <span>Don&apos;t have an account? </span>
            <Button variant="link" className="text-logan p-0 dark:text-gray-400">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
