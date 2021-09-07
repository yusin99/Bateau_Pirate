import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SingleUserModel, UserModelServer } from './../models/user.model';
import { catchError } from 'rxjs/operators';
import { ProductModelServer } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  auth = false;
  role = 555;
  error: any;
  private readonly API_KEY = 'http://localhost:3000/api/';
  user: any = {};
  authState$ = new BehaviorSubject<boolean>(this.auth);
  userData$ = new BehaviorSubject<SocialUser>(this.user);

  constructor(
    private authService: SocialAuthService,
    private httpClient: HttpClient,
    private Router: Router
  ) {
    authService.authState.subscribe((user: SocialUser) => {
      if (user != null) {
        this.auth = true;
        this.authState$.next(this.auth);
        this.userData$.next(user);
      }
    });
    console.log(this.error);
  }
  //  Login User with Email and Password
  loginUser(email: string, mdp: string) {
    return this.httpClient
      .post(`${this.API_KEY}auth/login`, { email, mdp })
      .subscribe(
        (data: any) => {
          console.log(data);
          window.localStorage.setItem('user', JSON.stringify(data));
          window.localStorage.setItem('token', JSON.stringify(data.token));
          // if (data.role === 777) {
          //   this.role = 777;
          // } else {
          //   this.role === 555;
          // }
          if (window.localStorage.getItem('user')) {
            this.auth = true;
          } else {
            this.auth = false;
          }
          this.auth = data.auth;
          this.authState$.next(this.auth);
          this.userData$.next(data);
        },
        (err) => {
          // console.log(err.error.message);
          this.error = err.error.message;
          return this.error;
        }
      );
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
  registerUser(
    email: string,
    mdp: string,
    pseudo: string,
    nom: string,
    prenom: string,
    photoUrl: string
  ): Observable<any> {
    return this.httpClient
      .post<any>(`${this.API_KEY}auth/register`, {
        email,
        mdp,
        pseudo,
        nom,
        prenom,
        photoUrl,
      })
      .pipe(catchError(this.errorHandler));
    // .subscribe(
    //   (data: any) => {
    //     this.auth = data.auth;
    //     if (data.message === 'Registration successful') {
    //       this.Router.navigate(['/login']);
    //       console.log(data);
    //     } else {
    //       console.log(data);

    //       console.log('error');
    //     }
    //   },
    //   (err) => {
    //     // console.log(err.error.errors[0].msg);
    //     this.error = err.error.errors[0].msg;
    //     return this.error;
    //   }
    // );
  }

  //  Google Authentication
  googleLogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  facebookLogin(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  logout() {
    this.auth = false;
    console.log('Logout');
    this.authState$.next(this.auth);
    this.authService.signOut();
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('token');
    this.Router.navigate(['/login']);
  }
  // API_KEY = 'http://localhost:3000/api';
  getAllUsers() {
    return this.httpClient.get(this.API_KEY + 'users');
  }
  getSingleUser(idClient: number): Observable<SingleUserModel> {
    return this.httpClient.get<SingleUserModel>(
      this.API_KEY + 'users/' + idClient
    );
  }
  deleteSingleUser(idClient: number): Observable<UserModelServer> {
    return this.httpClient.delete<UserModelServer>(
      this.API_KEY + 'users/' + idClient
    );
  }
  deleteSingleVinyl(idVinyl: number): Observable<ProductModelServer> {
    return this.httpClient.delete<ProductModelServer>(
      this.API_KEY + 'products/delete/' + idVinyl
    );
  }
  updateSingleUser(idClient: number, body: any): Observable<any> {
    return this.httpClient
      .put<any>(this.API_KEY + 'users/updateUser/' + idClient, body)
      .pipe(catchError(this.errorHandler));
  }
}

export interface ResponseModel {
  type: string;
  token: string;
  auth: boolean;
  email: string;
  nom: string;
  pseudo: string;
  prenom: string;
  photoUrl: string;
  idClient: number;
}
