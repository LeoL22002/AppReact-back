import { io } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.0.101:3000'; 
export const socket = io(SOCKET_URL);
