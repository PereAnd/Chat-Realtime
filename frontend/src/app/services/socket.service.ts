import { io, Socket } from 'socket.io-client';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket | null = null;

  BASE_URL: string = environment.BACKEND_URL;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.initializeSocket();
    }
  }

  private initializeSocket(): void {
    this.socket = io(this.BASE_URL, {
      transports: ['websocket', 'polling'],
    });
  }

  emitMessage(data: { event: string; content: string }): void {
    this.socket?.emit(data.event, data.content);
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}
