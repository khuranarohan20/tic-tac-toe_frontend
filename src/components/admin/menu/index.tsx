"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { API } from "@/config";
export function Header() {
  const [name, setName] = useState("Room");
  const [memberCount, setMemberCount] = useState(10);
  const [time, setTime] = useState(10);

  const handleSubmit = async () => {
    const data = {
      eventName: name,
      membercount: memberCount,
      time: time,
    };
    localStorage.setItem("Roomname", name);
    try {
      const response = await fetch(API + "/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <header style={{ background: "#333", color: "#fff", padding: "1rem" }}>
      <nav>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <li className="text-black">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Room</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] text-black">
                <DialogHeader>
                  <DialogTitle>Add Room</DialogTitle>
                  {/* <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription> */}
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Room Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Time
                    </Label>
                    <Input
                      id="number"
                      value={time}
                      onChange={(e) => setTime(+e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Members
                    </Label>
                    <Input
                      id="mamber"
                      type="number"
                      value={memberCount}
                      onChange={(e) => setMemberCount(+e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogClose asChild>
                  <Button onClick={handleSubmit} type="submit">
                    Add Room
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </nav>
    </header>
  );
}
