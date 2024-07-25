"use client";

import React, { useEffect, useState, Suspense } from "react";
import GameBox from "./game-box";
import { API } from "@/config";
import { useSearchParams } from "next/navigation";

const LeaderBoardPage = () => {
  const [data, setData] = useState<any>({});
  const params = useSearchParams().get("room");

  useEffect(() => {
    if (params) {
      fetch(`${API}/event/leaderboard/${params}`).then((response) => {
        response.json().then((data) => {
          setData(data.data);
        });
      });
    }
  }, [params]);

  if (!params) {
    return <div>No room specified</div>;
  }

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
                      key={d.id} // assuming each game has a unique id
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

const Loading = () => <div>Loading...</div>;

const LeaderBoardPageWrapper = () => (
  <Suspense fallback={<Loading />}>
    <LeaderBoardPage />
  </Suspense>
);

export default LeaderBoardPageWrapper;
