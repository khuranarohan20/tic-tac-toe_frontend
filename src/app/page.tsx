"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API } from "@/config";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [player, setPlayer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div className="flex flex-col align-middle justify-center h-[100vh] w-[100vw] gap-3">
      <div className="w-[100%] flex align-middle justify-center">
        <h1 className="text-4xl mb-2">Welcome to Tic Tac Toe!</h1>
      </div>
      <div className="w-[100%] flex align-middle justify-center">
        <Input
          type="text"
          placeholder="Enter your IGN ;)"
          className="w-80"
          value={player}
          onChange={(e) => {
            setPlayer(e.target.value);
          }}
        />
      </div>
      <div className="text-center w-full">
        <Button
          variant={"secondary"}
          disabled={!player}
          onClick={async () => {
            setLoading(true);
            if (typeof window !== "undefined") {
              localStorage.setItem("player", player);
            }
            router.push("/rooms");
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
