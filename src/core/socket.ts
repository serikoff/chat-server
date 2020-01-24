import socket, { Socket } from 'socket.io';
import { Server } from 'http';

// TODO: use socket.io Rooms and Namespaces
export default (http: Server) => {
  const io = socket(http);
  return io;
}
