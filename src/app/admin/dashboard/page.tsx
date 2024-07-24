import React from "react";
import { Header } from "@/components/admin/menu";
import RoomListing from "@/components/admin/list";

const DashBoard = () => {
  return (
    <div>
      <Header />
      <RoomListing />
    </div>
  );
};

export default DashBoard;
