"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

interface LoginPageProps {
  onLogin: (email: string, password: string) => boolean;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRobot, setIsRobot] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!isRobot) {
      setError("Please verify that you're not a robot");
      return;
    }

    const success = onLogin(email, password);

    if (!success) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 bg-[url('/img/admin-bg.svg')]">
      <div className="w-full max-w-xl grid bg-white rounded-lg overflow-hidden shadow-xl">
        {/* Right side - Login form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-xl text-blue-600 font-medium">
              Welcome to 888Market
            </h2>
            <h1 className="text-2xl font-bold mt-2">Login To Admin</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Enter Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="border border-gray-300 rounded-md p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="robot"
                  checked={isRobot}
                  onCheckedChange={(checked) => setIsRobot(checked as boolean)}
                />
                <label
                  htmlFor="robot"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I'm not a robot
                </label>
                <div className="ml-auto flex flex-col items-center">
                  <Image
                    src="/img/recaptcha.png"
                    alt="recaptcha"
                    width={30}
                    height={30}
                  />
                  <div className="mt-1 flex flex-col items-center">
                    <span className="text-[10px] text-gray-500">Recaptcha</span>
                    <span className="text-[10px] text-gray-500">
                      Privacy-Terms
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Button>
          </form>

          {/* <div className="mt-6 text-center text-sm text-gray-500">
            <p>Use admin@gmail.com / 12345678 to login</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
