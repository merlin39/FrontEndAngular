import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string | null = null;

  setUserId(id: string) {
    this.userId = id;
  }

  getUserId(): string | null {
    return this.userId || localStorage.getItem('user_id');
  }
}
