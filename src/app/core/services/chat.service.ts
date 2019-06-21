import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Chat} from "../../chat/chat";

@Injectable()
export class ChatService {

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) { }

  submitChat(chat: Chat): void {
    this.db.list('/').push(chat);
  }

  getChats(): AngularFireList<any> {
    return this.db.list('/');
  }
}
