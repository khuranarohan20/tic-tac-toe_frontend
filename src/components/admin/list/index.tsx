"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API } from "@/config";
import { Button } from "@/components/ui/button";

const RoomListing = () => {
  const [roomList, setRoomList] = useState([]);
  const [id, setId] = useState("");
  useEffect(() => {
    getList();
  }, [id]);

  const getList = async () => {
    try {
      const response = await fetch(API + "/event", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Assuming API returns JSON data
      setRoomList(data);
      console.log(data); // Log or process the data received from the API
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (id: string) => {
    setId(id);
    const body = {
      tournamentId: id,
    };
    try {
      const response = await fetch(API + "/event/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response) {
        console.log("Room started successfully");
        getList(); // Refresh the list after the room starts
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(API + "/event/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("Room deleted successfully");
      getList(); // Refresh the list after the room is deleted
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="container">
      <h1 className="text-3xl w-full text-center">Room Listing</h1>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">index</TableHead>
            <TableHead>Room Name</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Members</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roomList.map((data: any, index) => (
            <TableRow key={data._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{data.eventName}</TableCell>
              <TableCell>{data.time}</TableCell>
              <TableCell>{data.membercount}</TableCell>
              <TableCell className="text-right">
                <Button
                  disabled={data.status}
                  onClick={() => handleSubmit(data.eventid)}
                >
                  {data.status ? "Started" : "Start"}
                </Button>
                <Button
                  variant={"destructive"}
                  className="ms-3 text-white"
                  onClick={() => handleDelete(data.eventid)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoomListing;
