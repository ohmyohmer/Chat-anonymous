import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { Router } from "@angular/router";
import {Observable} from "rxjs/index";

@Injectable()
export class AuthService {

  authState: any = null;

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
        localStorage.setItem('username', this.generateRandomUsername());
        localStorage.setItem('uuid', user.user.uid);
        this.authState = user
      })
      .catch(error => console.log(error));
  }

  signOut(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('uuid');
    this.afAuth.auth.signOut();
    this.router.navigate(['/'])
  }

  private generateRandomUsername() {
    var unameArray = ['Dawg', 'Cath', 'Maws', 'Elef', 'Zeb', 'Leon', 'Tig', 'Pig', 'Bird'];
    var randomIndex = Math.floor(Math.random() * unameArray.length);

    return unameArray[randomIndex];
  }

}

