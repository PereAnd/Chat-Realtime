import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(socket: Socket) {
    console.log('Connected', socket.id);
    console.log('Auth', socket.handshake.auth);
  }
  handleDisconnect(socket: Socket) {
    console.log('Disconnected', socket.id);
  }

  @SubscribeMessage('toServer')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    socket.broadcast.emit('toUsers', data);
  }
}
