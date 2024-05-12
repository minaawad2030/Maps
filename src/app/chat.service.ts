import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentUserId: number = 0;
  currentConnectionIdId: string = ' ';
  private chatConnection?: HubConnection;
  chat$ = new BehaviorSubject<any | null>(null);

  constructor(private httpClient: HttpClient) {}

  setChat(data: any) {
    this.chat$.next(data);
  }

  registerUserToChat() {
    let url ='https://localhost:7078/api/Chat/RegisterUserToChat';

     return this.httpClient.post(url, {connectionId:this.currentConnectionIdId,userId:1}).subscribe((res) => {
      console.log('success registe user to chat');
    });
  }

  createChatConnection(userId: number) {
    debugger
    console.log(userId);
    this.currentUserId = userId;
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7078/ChatHub`)
      .withAutomaticReconnect()
      .build();

    this.chatConnection.start().catch((error) => {
      console.log('--------- chat Connection Error ------------');
      console.log(error);
    });

    this.chatConnection.on('UserConnected', (res) => {
      
      this.currentConnectionIdId = res;
      this.registerUserToChat();
    });

    this.chatConnection.on('MessageComing', (res) => {
      debugger
      this.setChat(res)
    });
  }

  // stopChatConnection() {
  //   this.chatConnection.stop().catch(error => {
  //     console.log("--------- chat Connection Error ------------");
  //     console.log(error);
  //   });
  // }

}

