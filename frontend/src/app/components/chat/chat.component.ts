import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Message } from '../../interfaces/message';

@Component({
  imports: [NgClass, NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  names: string[] = ['Andres Perez', 'Alejandra Hurtado'];

  formChat = new FormGroup({
    text: new FormControl(''),
  });

  constructor(private readonly socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.connect('AQUI_VA_EL_TOKEN');

    this.socketService.listenToEvent<Message>('toUsers').subscribe({
      next: (message) => {
        message.sent = false;
        this.messages.push(message);
      },
    });
  }

  sendMessage() {
    let textToSend = this.formChat.get('text')?.value;

    if (textToSend?.trim()) {
      const message: Message = {
        sent: true,
        username: 'Andres Perez',
        type: 'MODERATOR',
        timestamp: new Date().toLocaleTimeString(),
        content: textToSend,
      };

      this.messages.push(message);

      this.socketService.emitMessage({
        event: 'toServer',
        content: message,
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
