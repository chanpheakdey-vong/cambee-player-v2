import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: "root"})
export class HttpService {
  domain: string = 'https://cambeelearningapi.azurewebsites.net';
  constructor(private http: HttpClient) { }

  post(url: string, body: any, options?: any){
    if (url.length > 0 && url.charAt(0) == '/') url = `${this.domain}${url}`;
    return this.http.post(url, body, options);
  }

  get(url: string, options?: any){
    if (url.length > 0 && url.charAt(0) == '/') url = `${this.domain}${url}`;
    return this.http.get(url, options);
  }

  patch(url: string, body?: any){
    if (url.length > 0 && url.charAt(0) == '/') url = `${this.domain}${url}`;
    return this.http.patch(url, body);
  }

  put(url: string, body: any, options?: any){
    if (url.length > 0 && url.charAt(0) == '/') url = `${this.domain}${url}`;
    return this.http.put(url, body, options);
  }

  delete(url: string, options?: any){
    if (url.length > 0 && url.charAt(0) == '/') url = `${this.domain}${url}`;
    return this.http.delete(url, options);
  }
}