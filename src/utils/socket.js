import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io('https://deadandinjured.herokuapp.com', {transports: ['websocket'], upgrade: false})

export const SocketContext = createContext()