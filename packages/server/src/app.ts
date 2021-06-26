import { Server } from 'socket.io';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { v4 as uuidV4 } from 'uuid';

const dev = process.env.NODE_ENV === 'development';

const startServer = () => {
  const app = express();
  const server = http.createServer(app);
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.static('public', { index: false }));

  app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
  });

  app.get('/:roomId', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });

  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', (id: string, href = '') => {
      if (dev) {
        socket.on('open-camera', () => {
          socket.broadcast.emit('open-camera', id);
        });

        socket.on('disconnecting', () => {
          socket.broadcast.emit('user-disconnect', id);
        });
        return;
      }

      let roomId = uuidV4();
      const regex = /(?<=http:\/\/localhost:3000\/).*/i;
      const match = href.match(regex);
      if (match) {
        roomId = match[0];
      }

      socket.join(roomId);

      socket.on('open-camera', () => {
        socket.broadcast.to(roomId).emit('open-camera', id);
      });

      socket.on('disconnecting', () => {
        socket.broadcast.to(roomId).emit('user-disconnect', id);
      });
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  server.listen(port, () => console.log(`Server was running at port ${port}`));
};

startServer();
