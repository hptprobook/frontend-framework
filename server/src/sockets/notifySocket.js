/* eslint-disable no-console */
// setup socket
import { Server } from 'socket.io';

const socketConfig = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // Thay đổi origin phù hợp với yêu cầu bảo mật của bạn
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected with id:', socket.id);

    socket.on('send_notify', (data) => {
      console.log('Data received:', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });

  return io;
};

export default socketConfig;
