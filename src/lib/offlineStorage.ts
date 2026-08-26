'use client';

// Offline-First Client Vault & IndexedDB Storage Engine for SpectrumOS
export interface OfflineVaultData {
  version: string;
  timestamp: string;
  profiles: unknown[];
  routines: unknown[];
  socialStories: unknown[];
  speechAttempts: unknown[];
  sensorySettings: Record<string, unknown>;
}

class OfflineStorageEngine {
  private dbName = 'SpectrumOS_Vault';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  public async init(): Promise<boolean> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      console.warn('IndexedDB not supported, falling back to localStorage');
      return false;
    }

    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('vault')) {
          db.createObjectStore('vault', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(true);
      };

      request.onerror = () => {
        console.warn('IndexedDB failed to open, using localStorage');
        resolve(false);
      };
    });
  }

  public async setItem<T>(key: string, value: T): Promise<void> {
    try {
      if (this.db) {
        return new Promise((resolve, reject) => {
          const transaction = this.db!.transaction(['vault'], 'readwrite');
          const store = transaction.objectStore('vault');
          const request = store.put({ key, value, updatedAt: new Date().toISOString() });
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } else {
        localStorage.setItem(`spectrum_${key}`, JSON.stringify(value));
      }
    } catch (e) {
      console.warn('OfflineStorage setItem error:', e);
      try {
        localStorage.setItem(`spectrum_${key}`, JSON.stringify(value));
      } catch {}
    }
  }

  public async getItem<T>(key: string): Promise<T | null> {
    try {
      if (this.db) {
        return new Promise((resolve) => {
          const transaction = this.db!.transaction(['vault'], 'readonly');
          const store = transaction.objectStore('vault');
          const request = store.get(key);
          request.onsuccess = () => {
            if (request.result) {
              resolve(request.result.value as T);
            } else {
              // Try localStorage fallback
              const fallback = localStorage.getItem(`spectrum_${key}`);
              resolve(fallback ? (JSON.parse(fallback) as T) : null);
            }
          };
          request.onerror = () => {
            const fallback = localStorage.getItem(`spectrum_${key}`);
            resolve(fallback ? (JSON.parse(fallback) as T) : null);
          };
        });
      } else {
        const item = localStorage.getItem(`spectrum_${key}`);
        return item ? (JSON.parse(item) as T) : null;
      }
    } catch (e) {
      console.warn('OfflineStorage getItem error:', e);
      return null;
    }
  }

  // Generate complete downloadable offline snapshot
  public async exportCompleteSnapshot(): Promise<OfflineVaultData> {
    const profiles = (await this.getItem('profiles')) || [];
    const routines = (await this.getItem('routines')) || [];
    const stories = (await this.getItem('socialStories')) || [];
    const speech = (await this.getItem('speechAttempts')) || [];
    const sensory = (await this.getItem('sensorySettings')) || {};

    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      profiles: Array.isArray(profiles) ? profiles : [profiles],
      routines: Array.isArray(routines) ? routines : [routines],
      socialStories: Array.isArray(stories) ? stories : [stories],
      speechAttempts: Array.isArray(speech) ? speech : [speech],
      sensorySettings: sensory as Record<string, unknown>,
    };
  }

  // Restore snapshot from user backup file
  public async importCompleteSnapshot(snapshot: OfflineVaultData): Promise<boolean> {
    try {
      if (snapshot.profiles) await this.setItem('profiles', snapshot.profiles);
      if (snapshot.routines) await this.setItem('routines', snapshot.routines);
      if (snapshot.socialStories) await this.setItem('socialStories', snapshot.socialStories);
      if (snapshot.speechAttempts) await this.setItem('speechAttempts', snapshot.speechAttempts);
      if (snapshot.sensorySettings) await this.setItem('sensorySettings', snapshot.sensorySettings);
      return true;
    } catch (e) {
      console.error('Failed to import snapshot:', e);
      return false;
    }
  }
}

export const offlineStorage = new OfflineStorageEngine();
