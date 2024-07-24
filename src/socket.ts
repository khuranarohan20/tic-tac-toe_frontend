import { API } from "./config";
import { io, Socket } from "socket.io-client";

export class GameSocket {
  socket: any;

  connect(userName: string, tournamentId: string) {
    // Implement socket connection logic here
    this.socket = io(`${API}/${tournamentId}`, {
      transports: ["websocket"],
      query: {
        userName,
      },
    });
    this.socket.on("connect", () => {
      console.log(this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log(this.socket.id);
    });
    this.socket.on("connect_error", (data: any) => {
      console.log("from socket", data);
    });
    return this.socket;
  }
  async close() {
    this.socket.disconnect();
  }
}
