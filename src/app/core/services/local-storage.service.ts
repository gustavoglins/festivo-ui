import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private isLocalStorageAvailable(): boolean {
    if (!this.isBrowser) {
      console.error(
        'LocalStorage is not available: Running in a non-browser environment'
      );
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
    if (!this.isBrowser || !this.isLocalStorageAvailable()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isBrowser || !this.isLocalStorageAvailable()) return null;
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (e) {
      console.error('Failed to retrieve from localStorage:', e);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser || !this.isLocalStorageAvailable()) return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove from localStorage:', e);
    }
  }

  clear(): void {
    if (!this.isBrowser || !this.isLocalStorageAvailable()) return;
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  }
}
