import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Chat } from '../../chat/chat';
import * as firebase from 'firebase/app'
import {query} from "@angular/animations";

@Injectable()
export class ChatService {

  constructor(private db: AngularFireDatabase) { }

  submitChat(chat: Chat): void {
    this.db.list('/messages').push(chat);
  }

  getChats(): AngularFireList<any> {
    return this.db.list('/messages');
  }

  setChatUserIsTyping(username_: string, isTyping_: boolean = false) {
    if(typeof username_ !== "undefined") {
      var chatUserRef = firebase.database().ref('/isTyping/'+username_  );
      chatUserRef.update(JSON.parse(JSON.stringify({isTyping: isTyping_, username: username_})));
    }
  }

  getUsersTyping(): AngularFireList<any> {
    return this.db.list('/isTyping');
  }
}
