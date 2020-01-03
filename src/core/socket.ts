import socket, { Socket } from 'socket.io';
import { Server } from 'http';

// TODO: use socket.io Rooms and Namespaces
export default (http: Server) => {
  const io = socket(http);

  // io.on('connection', (socket: Socket) => {
  //   socket.emit('user connect', socket.id);

  //   //const ids = Object.keys(io.sockets.connected);
  //   //socket.broadcast.to(ids[0]).emit('my message', 'msg');

  //   socket.on('222', (msg) => {
  //     console.log(msg);
  //   })

  //   socket.emit('NEW:MESSAGE', { text: 'www'});
  // });


  return io;
}
