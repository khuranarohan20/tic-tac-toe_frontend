"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@/components/common/box";
import { Button } from "@/components/ui/button";
import { API } from "@/config";

const Gameplay = () => {
  const router = useRouter();
  const [player1, setPlayer1] = useState<string | null>("X");
  const [player2, setPlayer2] = useState<string | null>("O");
  const [squares, setSquares] = useState<("X" | "O" | null)[]>(
    Array(9).fill(null)
  );
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [opponent, setOpponent] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);

  const params = useSearchParams().get("room");

  useEffect(() => {
    let players;
    if (typeof window !== "undefined") {
      players = JSON.parse(localStorage.getItem("game-data")!)?.users;
    }

    const [user1, user2] = players;

    if (user1 === localStorage.getItem("player")) {
      setOpponent(user2);
    } else {
      setOpponent(user1);
    }

    setPlayer1(user1);
    setPlayer2(user2);
  }, [counter]);

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      const socket = (window as any).GAME_SOCKET?.socket;
      if (socket) {
        let actualWinner = winner === "X" ? player1 : player2;
        if (actualWinner === localStorage.getItem("player")) {
          socket.emit("WIN", {
            winner: winner === "X" ? player1 : player2,
            loser: winner === "X" ? player2 : player1,
          });
        } else {
          socket.close();
          router.push(`/leaderboard?room=${params}`);
        }
      }
      setStatus(`Winner: ${winner === "X" ? player1 : player2}`);
      setHasEnded(true);
    } else if (!squares.includes(null)) {
      setStatus("Draw");
      setIsDraw(true);
    } else {
      setStatus(
        `Next player: ${isXNext ? `${player1} -> X` : `${player2} -> O`}`
      );
    }
  }, [squares, isXNext, player1, player2]);

  useEffect(() => {
    const socket = (window as any).GAME_SOCKET.socket;
    if (socket) {
      const handleStart = (data: any) => {
        localStorage.setItem("game-data", JSON.stringify(data));
        setSquares(Array(9).fill(null));
        setIsDraw(false);
        setHasEnded(false);
        setIsXNext(true);
        setCounter((prev) => prev + 1);
      };

      const handleTournamentWin = () => {
        socket.close();
        router.push(`/leaderboard?room=${params}`);
      };

      socket.on("START", handleStart);
      socket.on("TOURNAMENT-WIN", handleTournamentWin);

      return () => {
        socket.off("START", handleStart);
        socket.off("TOURNAMENT-WIN", handleTournamentWin);
      };
    }
  }, []);

  useEffect(() => {
    const socket = (window as any).GAME_SOCKET.socket;
    if (socket) {
      const handleMove = (data: any) => {
        if (data.move) {
          setSquares((prevSquares) =>
            prevSquares.map((square, index) =>
              index === data.tile ? data.move : square
            )
          );
          setIsXNext((prevIsXNext) => !prevIsXNext);
        }
      };

      socket.on("MOVE", handleMove);

      return () => {
        socket.off("MOVE", handleMove);
      };
    }
  }, []);

  const handleClick = (i: number) => {
    const socket = (window as any).GAME_SOCKET.socket;

    const currentChance = isXNext ? player1 : player2;

    if (currentChance !== localStorage.getItem("player")) {
      return;
    }

    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    if (socket) {
      socket.emit("MOVE", {
        tile: i,
        move: isXNext ? "X" : "O",
        opponentName: opponent,
      });
    }
  };

  const calculateWinner = (squares: Array<string | null>) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100%]">
      <div className="mb-4 text-xl">{status}</div>
      <div className="flex flex-col gap-1">
        {Array.from({ length: 3 }).map((_, row) => (
          <div className="flex gap-1" key={row}>
            {Array.from({ length: 3 }).map((_, col) => {
              const index = row * 3 + col;
              return (
                <Box
                  key={index}
                  value={squares[index]}
                  onBoxClick={() => handleClick(index)}
                  isXNext={isXNext}
                />
              );
            })}
          </div>
        ))}
      </div>
      {hasEnded && (
        <Button
          variant={"secondary"}
          className="mt-5"
          onClick={() => {
            router.push("/leaderboard");
          }}
        >
          Go to leaderboard
        </Button>
      )}
      {isDraw && (
        <Button
          variant={"outline"}
          className="mt-5 text-black"
          onClick={() => {
            setSquares(Array(9).fill(null));
            setIsDraw(false);
            setHasEnded(false);
            setIsXNext(true);
          }}
        >
          Reset game
        </Button>
      )}
    </div>
  );
};

const Loading = () => <div>Loading...</div>;

const GameplayWrapper = () => (
  <Suspense fallback={<Loading />}>
    <Gameplay />
  </Suspense>
);

export default GameplayWrapper;
