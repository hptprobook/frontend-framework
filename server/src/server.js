/* eslint-disable */
import express from 'express';
import cors from 'cors';
import exitHook from 'async-exit-hook';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';
import { APIs_V1 } from '~/routes/v1';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';
import { corsOptions } from './config/cors';
import http from 'http';
import { Server } from 'socket.io';

const START_SERVER = () => {
  const app = express();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected!');

    socket.on('disconnect', () => {
      console.log('A user disconnected!');
    });
  });

  app.use(cors(corsOptions));

  app.use(express.json());

  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Use APIs v1
  app.use('/v1', APIs_V1);

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware);

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
      console.log(`Server is running at ${process.env.PORT}`);
    });
  } else {
    server.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(
        `Server is running at http://${env.APP_HOST}:${env.APP_PORT}/`
      );
    });
  }

  exitHook(() => {
    CLOSE_DB();
    console.log('Disconnected from MongoDB Atlas');
  });
};

(async () => {
  try {
    await CONNECT_DB();
    console.log('Connect to MongoDB Atlas successfully');
    START_SERVER();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
})();
