import { Component, Input, OnInit } from '@angular/core';
import { ChatService} from "../core/services/chat.service";
import { AuthService} from "../core/services/auth.service";
import { Router } from "@angular/router";
import {Chat} from "../chat/chat";
import * as firebase from 'firebase/app'
import {isBoolean} from "util";

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
  chatUsersTyping: string[];
  chatUsersTypingMessage: string;
  chats: any[];

  constructor(private chatService: ChatService,
              public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.getAuthState()
      .subscribe(() => {
        this.loadChats();
        this.fetchUsersTyping();
        this.chatUser = this.getChatUser();
      });
    setTimeout(() => this.chatService.setChatUserIsTyping(this.getChatUser(), false), 100);
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

  isTyping(): void {
    if (this.message) {
      this.chatService.setChatUserIsTyping(this.getChatUser(), true);
    } else {
      this.chatService.setChatUserIsTyping(this.getChatUser(), false);
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

  private fetchUsersTyping() {
    return this.chatService.getUsersTyping().valueChanges()
      .subscribe(userTyping => {
        this.chatUsersTyping = userTyping;
        this.chatUsersTyping = this.chatUsersTyping
          .filter(condObj => condObj['isTyping'] === true && condObj['username'] !== this.getChatUser())
          .map(typingUsername => typingUsername['username']);

        if(this.chatUsersTyping && this.chatUsersTyping.length > 0) {
          if(this.chatUsersTyping.length > 3) {
            this.chatUsersTypingMessage = this.chatUsersTyping.join(',') +"...+"+(this.chatUsersTyping.length - 3)+ " is typing";
          } else {
            this.chatUsersTypingMessage = this.chatUsersTyping.join(',') + " is typing";
          }
        } else {
          this.chatUsersTypingMessage = null;
        }
      });
  }

  private getChatUser() {
    if(this.authService.authenticated) {
      return localStorage.getItem('username') + "-" + localStorage.getItem('uuid').substring(0, 5);
    }
  }
}

