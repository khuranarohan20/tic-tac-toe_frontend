"use client";

import Box from "@/components/common/box";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

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
  const [oponent, setOponent] = useState<string>("");

  useEffect(() => {
    const players = JSON.parse(localStorage.getItem("game-data")!)?.users;

    const [user1, user2] = players;

    if (user1 === localStorage.getItem("player")) {
      setOponent(user2);
    } else {
      setOponent(user1);
    }

    setPlayer1(user1);
    setPlayer2(user2);
  }, []);

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      const socket = window.GAME_SOCKET?.socket;
      if (socket) {
        socket.emit("WIN", {
          winner: winner === "X" ? player1 : player2,
          loser: winner === "X" ? player2 : player1,
        });
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

  const squaresRef = useRef(squares);
  const isXNextRef = useRef(isXNext);

  useEffect(() => {
    squaresRef.current = squares;
    isXNextRef.current = isXNext;
  }, [squares, isXNext]);

  useEffect(() => {
    const socket = window.GAME_SOCKET.socket;
    if (socket) {
      socket.on("MOVE", (data: any) => {
        if (data.move) {
          setSquares((prevSquares) =>
            prevSquares.map((square, index) =>
              index === data.tile ? data.move : square
            )
          );
          setIsXNext((prevIsXNext) => !prevIsXNext);
        }
      });
    }
  }, []);

  const handleClick = (i: number) => {
    const socket = window.GAME_SOCKET.socket;

    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    if (socket) {
      socket.emit("MOVE", {
        tile: i,
        move: isXNext ? "X" : "O",
        opponentName: oponent,
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
      <div>
        {Array.from({ length: 3 }).map((_, row) => (
          <div className="flex" key={row}>
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

export default Gameplay;
