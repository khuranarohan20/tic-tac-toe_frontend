"use client";

import { GameSocket } from "@/socket";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Waiting = ({
  userName,
  tournamentId,
  joinedUsers,
  setJoinedUsers,
}: {
  userName: string | null;
  tournamentId: string;
  joinedUsers: string[];
  setJoinedUsers: (value: any) => void;
}) => {
  const router = useRouter();

  useEffect(() => {
    const socketInstance = new GameSocket();
    window.GAME_SOCKET = socketInstance;
    if (userName && tournamentId) {
      const socket = socketInstance.connect(userName, tournamentId);
      socket.on("USER-JOIN", (data: any) => {
        handleUserJoin(data);
      });
      socket.on("USER-LEAVE", (data: any) => {
        handleUserLeave(data);
      });
      socket.on("START", (data: any) => {
        localStorage.setItem("game-data", JSON.stringify(data));
        router.push("/game");
      });
    }

    // return () => {
    //   socketInstance.close();
    // };
  }, []);

  const handleUserJoin = (data: any) => {
    setJoinedUsers((prevState: string[]) => [...prevState, data.userName]);
  };
  const handleUserLeave = (data: any) => {
    setJoinedUsers((prevState: any) =>
      prevState.filter((u: any) => u !== data.userName)
    );
  };

  function removeDuplicates(arr: any[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }

  return (
    <div>
      <h1>Waiting...</h1>
      <div className="mt-8">
        {removeDuplicates(joinedUsers).map((u, i) => {
          return (
            <ul key={i}>
              <li>{u}</li>
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default Waiting;
