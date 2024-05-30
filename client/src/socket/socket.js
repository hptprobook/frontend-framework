import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000';

const socket = io(SOCKET_URL);

socket.on('connect', () => {
  console.log('Connected to the server with id:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

export default socket;
