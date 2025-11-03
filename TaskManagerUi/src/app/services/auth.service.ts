import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'})
  export class AuthService {

    private readonly API_KEY_STORAGE_KEY = 'task_manager_api_key';
    private readonly EXPECTED_KEY = 'MySuperSimpleSecretKey'; 
    private readonly EXPECTED_USER = 'user';
    private readonly EXPECTED_PASS = 'password';

    private router = inject(Router);

    //Basic check when login
    login(username: string, password: string): boolean {
        if(username === this.EXPECTED_USER && password === this.EXPECTED_PASS){
            localStorage.setItem(this.API_KEY_STORAGE_KEY, this.EXPECTED_KEY);
            return true;
        }
        return false;
    }

    //Check if user is logged in
    isLoggedIn(): boolean{
        return !!localStorage.getItem(this.API_KEY_STORAGE_KEY);
    }

    //Retrieve API key
    getApiKey(): string | null {
        return localStorage.getItem(this.API_KEY_STORAGE_KEY);
    }

    //Clear API key and logout
    logout():void{
        localStorage.removeItem(this.API_KEY_STORAGE_KEY);
        this.router.navigate(['/login']);
    }

  }