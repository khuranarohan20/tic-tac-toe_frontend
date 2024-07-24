"use client";

import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { API } from "@/config";
import Waiting from "@/components/common/Waiting";

const Rooms = () => {
  const playerName = localStorage.getItem("player");
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [eventId, setEventId] = useState<string>("");
  const [joinedUsers, setJoinedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API}/event`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleJoinGame = async (row: any, eventid: string) => {
    setEventId(eventid);
    setJoinedUsers(row.users);
    if (row.users.some((u: any) => u === playerName)) {
      setHasJoined(true);
      return;
    }

    const response = await fetch(`${API}/event/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: playerName,
        tournamentId: eventid,
      }),
    });
    if (response.ok) {
      setHasJoined(true);
    }
  };

  return hasJoined ? (
    <Waiting
      tournamentId={eventId}
      userName={playerName}
      joinedUsers={joinedUsers}
      setJoinedUsers={setJoinedUsers}
    />
  ) : (
    <div className="p-3">
      <h1 className="text-center text-3xl underline">Available Games</h1>
      {data.length ? (
        <Table className="mt-5">
          <TableCaption>A list of your active rooms.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-gray-700 text-center bg-slate-300">
                Room ID
              </TableHead>
              <TableHead className="text-gray-700 text-center bg-slate-300">
                Room Name
              </TableHead>
              <TableHead className="text-gray-700 text-center bg-slate-300">
                Number of players
              </TableHead>
              <TableHead className="text-gray-700 text-center bg-slate-300">
                Starts in
              </TableHead>
              <TableHead className="text-center text-gray-700 bg-slate-300">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-center uppercase">
                  {row.eventid.slice(0, 7)}
                </TableCell>
                <TableCell className="text-center">{row.eventName}</TableCell>
                <TableCell className="text-center">
                  {row.users.length} / {row.membercount}
                </TableCell>
                <TableCell className="text-center">
                  {new Date().toDateString()}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant={"secondary"}
                    onClick={() => handleJoinGame(row, row.eventid)}
                  >
                    Join game
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div>Waiting for new new rooms..</div>
      )}
    </div>
  );
};

export default Rooms;
