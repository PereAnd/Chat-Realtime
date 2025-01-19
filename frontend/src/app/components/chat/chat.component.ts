import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [NgClass, NgFor],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  names: string[] = ['Andres Perez', 'Alejandra Hurtado'];

  constructor(private readonly socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.connect('AQUI_VA_EL_TOKEN');
  }

  sendMessage() {
    this.socketService.emitMessage({
      event: 'toServer',
      content: { message: 'Hola' },
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  redirectTo(route: string) {
    window.location.replace(route);
  }
}
