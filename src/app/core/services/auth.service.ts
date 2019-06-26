import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { Router } from "@angular/router";
import {Observable} from "rxjs/index";
import {compareNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";
import {timeInterval} from "rxjs/internal/operators";

@Injectable()
export class AuthService {

  authState: any = null;
  hours: number;
  now: any;
  expire: string;

  constructor(private afAuth: AngularFireAuth,
              private router:Router) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  getAuthState(): Observable<any> {
    return this.afAuth.authState;
  }

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        localStorage.clear()
        localStorage.setItem('username', this.generateRandomUsername());
        localStorage.setItem('uuid', user.user.uid);
        localStorage.setItem('expire', this.generateUserTimeout());
        this.authState = user
      })
      .catch(error => console.log(error));
  }

  signOut(): void {
    localStorage.clear()
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  private generateRandomUsername() {
    var unameArray = ['Dawg', 'Cath', 'Maws', 'Elef', 'Zeb', 'Leon', 'Tig', 'Pig', 'Bird'];
    var randomIndex = Math.floor(Math.random() * unameArray.length);

    return unameArray[randomIndex];
  }

  private generateUserTimeout() {
    this.hours = 3;
    this.now = new Date().getTime();
    this.expire = localStorage.getItem('expire');

    if(this.expire == null) {
      var expiryDateTime = this.now +  this.hours * 60 * 60 * 1000;
      return expiryDateTime;
    }
  }

  checkExpiryDate(): void {
    this.now = new Date().getTime();
    this.expire = localStorage.getItem('expire');

    if(this.expire < this.now){
      localStorage.clear()
      this.afAuth.auth.signOut();
      this.router.navigate(['/']);
    }
  }
}

