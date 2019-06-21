import { Component, Input, OnInit } from '@angular/core';
import { ChatService} from "../core/services/chat.service";
import { AuthService} from "../core/services/auth.service";
import { Router } from "@angular/router";
import {Chat} from "../chat/chat";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input()
  message: string = '';
  chat: Chat;
  chatUser: string;
  chats: any[];

  constructor(private chatService: ChatService,
              public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.getAuthState()
      .subscribe(() => {
        this.loadChats();
        this.chatUser = this.getChatUser();
      });
  }

  signInAnonymously() {
    this.authService.anonymousLogin()
      .then(() =>
        this.router.navigate(['/'])
      );
  }

  logout() {
    this.authService.signOut();
    this.message = '';
  }

  submitChatMessage(event: any): void {
    if(this.message) {
      let chat = new Chat(this.username, new Date(), this.message, this.profileImage);
      this.chatService.submitChat(chat);
      this.message = '';
    }
  }

  isMyChat(chat: Chat): boolean {
    if(this.authService.authenticated) {
      return this.chatUser === chat.user;
    }
  }

  get profileImage(): any {
    if(localStorage.getItem('username')) {
      return "assets/images/" + localStorage.getItem('username') + ".png";
    }
  }

  get username(): string {
    if(localStorage.getItem('username')){
      return localStorage.getItem('username') + "-" + localStorage.getItem('uuid').substring(0, 5);
    }
  }

  get Messages(): any {
    return this.chats;
  }

  private loadChats() {
    return this.chatService.getChats().valueChanges()
      .subscribe(chats => {
        this.chats = chats
      })
  }

  private getChatUser() {
    if(this.authService.authenticated) {
      return localStorage.getItem('username') + "-" + localStorage.getItem('uuid').substring(0, 5);
    }
  }
}
