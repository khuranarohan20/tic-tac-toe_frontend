"use client";

import React, { useEffect, useState } from "react";
import GameBox from "./game-box";
import { API } from "@/config";
import { useSearchParams } from "next/navigation";

const LeaderBoardPage = () => {
  const [data, setData] = useState<any>({});
  const params = useSearchParams().get("room");

  useEffect(() => {
    fetch(`${API}/event/leaderboard/${params}`).then((response) => {
      response.json().then((data) => {
        setData(data.data);
      });
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col justify-center h-[100vh]">
        {Object.keys(data)
          .reverse()
          .map((el, i) => {
            return (
              <div className="flex justify-center" key={i}>
                {data[el].map((d: any) => {
                  return (
                    <GameBox
                      winner={d.winner}
                      player1={d.userName1}
                      player2={d.userName2}
                      status={d.isFinished ? "Completed" : "In Progress"}
                    />
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default LeaderBoardPage;
