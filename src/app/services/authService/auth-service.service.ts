import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, shareReplay } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthServiceService {

    private jwtHelper: JwtHelperService;

    constructor(private http: HttpClient) {
        this.jwtHelper = new JwtHelperService();
    }

    public login(username: string, password: string) {
        return this.http.post<{ [key: string]: string }>('https://localhost:3000/auth/login', { username, password })
            .pipe(
                tap((res) => {
                    const accessToken = res['access_token'];
                    if (typeof res['access_token'] === 'string') {
                        localStorage.setItem('access_token', accessToken);
                        console.log(`stored token ${accessToken}`);
                    }
                }),
                shareReplay()
            )
    }


    public logout() {
        localStorage.removeItem("access_token");
    }

    public isLoggedIn() {
        const token = localStorage.getItem('access_token');
        if (!token) {
            return false;
        } else {
            return !this.jwtHelper.isTokenExpired(token);
        }
    }

    public isLoggedOut() {
        return !this.isLoggedIn();
    }

    public getToken() {
        const token = localStorage.getItem('access_token') ?? undefined;
        return token;
    }

    public getRoles() : string[] {
        const token = this.getToken();
        if (!token) {
            return [];
        }
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken?.roles ?? [];
    }

    public getUserId(): string | undefined {
        const token = this.getToken();
        if (!token) {
            return undefined;
        }
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken?.sub;
    }

}
