import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class AuthService{
    setSession(token: string){
        localStorage.setItem('token', token);
    }

    setData(name: string, value: string){
        localStorage.setItem(name, value);
    }

    getData(name: string){
        return localStorage.getItem(name);
    }

    signout(){
        localStorage.removeItem('token');
        localStorage.removeItem('name');
    }

    isLogin(){
        const token = localStorage.getItem('token');
        return  token == null || token == '' ? false : true;
    }
}