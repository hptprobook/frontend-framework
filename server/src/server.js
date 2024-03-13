/* eslint-disable no-console */

import express from 'express';
import exitHook from 'async-exit-hook';
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';

const START_SERVER = () => {
  const app = express();

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray());
    res.end('<h1>Hello World!</h1><hr>');
  });

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}/`);
  });

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
