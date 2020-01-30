import socket, { Socket } from 'socket.io';
import { Server } from 'http';

export default (http: Server) => {
  const io = socket(http);
  return io;
}
