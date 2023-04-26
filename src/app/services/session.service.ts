import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  SaveItemOnStorage(key: string, value: string): void {
    const exist = sessionStorage.getItem(key);
    if (exist) {
      sessionStorage.removeItem(key);
    } sessionStorage.setItem(key, value);
  }

  GetFromStoratge(key: string): string  | null{
    const exist = sessionStorage.getItem(key);
    if (exist) {
      return exist;
    }
    return null;
  }
}
