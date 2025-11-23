import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";

export type IOServerType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;

class SocketServer {
  private _io: IOServerType | null = null;

  initialize(httpServer: HttpServer): void {
    this._io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });
  }

  get io(): IOServerType {
    if (!this._io) {
      throw new Error("Socket.IO not initialized");
    }
    return this._io;
  }
}

export const socketServer = new SocketServer();
