import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { NgClass, NgFor } from '@angular/common';

@Component({
  imports: [NgClass, NgFor, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  names: string[] = ['Andres Perez', 'Alejandra Hurtado'];

  formChat = new FormGroup({
    text: new FormControl(''),
  });

  constructor(private readonly socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.connect('AQUI_VA_EL_TOKEN');
  }

  sendMessage() {
    let textToSend = this.formChat.get('text')?.value;
    if (textToSend?.trim()) {
      this.messages.push({
        sent: true,
        username: 'Andres Perez',
        type: 'MODERATOR',
        timestamp: new Date().toISOString(),
        content: textToSend,
      });
      this.socketService.emitMessage({
        event: 'toServer',
        content: { message: textToSend },
      });
      this.formChat.reset();
    }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  redirectTo(route: string) {
    window.location.replace(route);
  }
}
