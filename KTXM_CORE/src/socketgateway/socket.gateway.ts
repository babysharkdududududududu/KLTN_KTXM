import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Injectable } from '@nestjs/common';
  import { Server, Socket } from 'socket.io';
  
  @Injectable()
  @WebSocketGateway({
    cors: {
      origin: '*', // Điều chỉnh nếu cần
    },
  })
  export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
      client.emit('notification', { message: 'You are connected to the WebSocket server!' });
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: string): void {
      this.server.emit('message', payload);
    }
  
    sendNotification(notification: any) {
      this.server.emit('notification', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
      });
    }
  }
  