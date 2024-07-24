"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Login = () => {
  const route = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    if (username === "admin@gmail.com" && password === "Admin@123") {
      route.push("/admin/dashboard");
      localStorage.setItem("adminLogin", "true");
    }
  };

  useEffect(() => {
    const isLogin = localStorage.getItem("adminLogin");
    if (isLogin) {
      route.push("/admin");
    }
  }, []);
  return (
    <div className="flex items-center flex-col gap-4 justify-center bg-black text-white h-screen">
      {/* <h1 className="text-4xl	">Login</h1> */}
      <div className="flex justify-center gap-4  flex-col">
        <div>
          <p>Username</p>
          <Input
            type="text"
            className="bg-white text-black	"
            onChange={(e) => {
              const value = e.target.value;
              setUsername(value);
            }}
          />
        </div>
        <div>
          <p>Password</p>
          <Input
            className="bg-white text-black"
            type="password"
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
            }}
          />
        </div>
        <div className="flex items-center justify-center">
          <Button onClick={handleLogin}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
