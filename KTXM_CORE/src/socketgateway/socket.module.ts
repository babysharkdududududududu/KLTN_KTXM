import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway'; // Đảm bảo đường dẫn đúng

@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
