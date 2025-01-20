import { io, Socket } from 'socket.io-client';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket | null = null;
  BASE_URL: string = environment.BACKEND_URL;

  private readonly connectionStatus = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionStatus.asObservable();

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  connect(token: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.socket) this.disconnect();

    this.socket = io(this.BASE_URL, {
      transports: ['websocket', 'polling'],
      auth: { token },
    });

    this.setupConnectionListeners();
  }

  private setupConnectionListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket ON');
      this.connectionStatus.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket OFF');
      this.connectionStatus.next(false);
    });

    this.socket.on('connect_error', (err) => {
      console.log('Socket ERROR', err);
      if (err.message == 'Invalid credentials') {
        console.log('Authentication failed');
        this.disconnect();
      }
      this.connectionStatus.next(false);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus.next(false);
    }
  }

  emitMessage(data: { event: string; content: any }): void {
    this.socket?.emit(data.event, data.content);
  }

  listenToEvent<T>(eventName: string): Observable<T> {
    return new Observable<T>((observer) => {
      if (!this.socket) {
        return;
      }

      this.socket.on(eventName, (data: T) => {
        observer.next(data);
      });

      return () => {
        this.socket?.off(eventName);
      };
    });
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocketID(): string | null {
    return this.socket?.id ?? null;
  }
}
