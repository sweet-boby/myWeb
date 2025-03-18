// server.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' } // 生产环境需限制域名
  });

  // Socket.IO 事件处理
  io.on('connection', (socket) => {
    console.log(`客户端已连接: ${socket.id}`);
    
    socket.on('message', (data: string) => {
      console.log('收到消息:', data);
      io.emit('message', `服务器回应: ${data}`);
    });

    socket.on('disconnect', () => {
      console.log(`客户端断开: ${socket.id}`);
    });
  });

  // Next.js 路由处理
  app.all('*', (req, res) => handler(req, res));

  httpServer.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
  });
});