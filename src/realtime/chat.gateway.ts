import type { Socket } from "socket.io";
import type { IOServerType } from "./socket";

export class ChatGateway {
  registerHandlers(_io: IOServerType, _socket: Socket): void {
    // Chat events will be added here later
  }
}

export const chatGateway = new ChatGateway();
