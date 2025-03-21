import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storageAvailable: boolean | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.storageAvailable = this.checkLocalStorageAvailability();
  }

  private checkLocalStorageAvailability(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.error('LocalStorage is not available: Running in a non-browser environment');
      return false;
    }
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.error('LocalStorage is not available:', e);
      return false;
    }
  }
  
  setItem(key: string, value: any): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) as T : null;
    } catch (e) {
      console.error('Failed to retrieve from localStorage:', e);
      return null;
    }
  } 

  removeItem(key: string): void {
    if (!this.storageAvailable) return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove from localStorage:', e);
    }
  }

  clear(): void {
    if (!this.storageAvailable) return;
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  }
}
