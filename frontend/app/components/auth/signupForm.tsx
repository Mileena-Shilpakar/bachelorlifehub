"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LottieAnimation from "@/components/lottie"
import { registerUser } from "@/services/authService"
import { toast } from "react-toastify"
import axios, { AxiosError } from "axios"

export function SignupForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    setIsLoading(true)

    try{
      const response = await axios.post('http://localhost:8000/api/user/register/',{
        first_name:firstName,
        last_name:lastName,
        email,
        password
      })
      toast.success(response.data.detail)
      localStorage.setItem('task-token',response.data.access_token)
      localStorage.setItem('task-refresh-token',response.data.refresh_token)
    }catch(err){
      if(err instanceof AxiosError){
        // toast.error(err)
      }
    }
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  const handleRegister = async () => {
    const { success, message, user } = await registerUser(firstName, lastName, email, password);
  
    if (success) {
      router.push("/dashboard");
      toast.success('Registration successful!');
    } else {
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary items-center justify-center bg-athens-gray p-4 dark:bg-black">
      <div className="w-*0 h-80">
        <LottieAnimation /> {/* Use the LottieAnimation client component */}
      </div>

      <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-logan flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-black dark:text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-shuttle-gray dark:text-white">Join Bachelor's LifeHub</CardTitle>
          <CardDescription className="text-manatee dark:text-gray-500">
            Create an account to start managing tasks and earning rewards!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-shuttle-gray dark:text-gray-400">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  className="border-botticelli dark:bg-[#444444] dark:border-none dark:focus:ring-0 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-shuttle-gray dark:text-gray-400">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  className="border-botticelli dark:bg-[#444444] dark:border-none dark:focus:ring-0 dark:text-white"
                  />
                </div>
              </div>
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
                <Label htmlFor="password" className="text-shuttle-gray dark:text-gray-400">
                  Password
                </Label>
                <Input
                  id="password"
                  required
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-botticelli dark:bg-[#444444] dark:border-none dark:focus:ring-0 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-shuttle-gray dark:text-gray-400">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  required
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-botticelli dark:bg-[#444444] dark:border-none dark:focus:ring-0 dark:text-white"
                />
              </div>
              <Button type="submit" className="w-full dark:bg-[#BB86FC] dark:text-white" variant="default" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-manatee dark:text-gray-500">
            <span>Already have an account? </span>
            <Button variant="link" className="text-logan p-0 dark:text-gray-400">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

