import type { Socket } from "socket.io";
import type { IOServerType } from "./socket";

export class PresenceGateway {
  registerHandlers(_io: IOServerType, _socket: Socket): void {
    // Presence events will be added here later
  }
}

export const presenceGateway = new PresenceGateway();
