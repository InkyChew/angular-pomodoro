import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { IClockSetting } from '../models/clock-setting';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  private dbName = 'Pomodoro';
  private dbVersion = 1;
  private storeName: string = 'clocks';

  constructor() { }

  private openDatabase(): Observable<IDBDatabase> {
    return new Observable<IDBDatabase>((observer) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBRequest).result;
        observer.next(db);
        observer.complete();
      };

      request.onerror = (event: Event) => {
        observer.error('Error opening database: ' + (event.target as IDBRequest).error);
      };
    });
  }

  public read(id: number): Observable<IClockSetting> {
    return this.openDatabase().pipe(
      switchMap((db) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);

        return new Observable<IClockSetting>((observer) => {
          request.onsuccess = () => {
            observer.next(request.result);
            observer.complete();
          };

          request.onerror = (event) => {
            observer.error((event.target as IDBRequest).error);
          };
        });
      })
    );
  }


  public put(clock: IClockSetting): Observable<IClockSetting> {
    return this.openDatabase().pipe(
      switchMap((db) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(clock);

        return new Observable<IClockSetting>((observer) => {
          request.onsuccess = () => {
            observer.next(clock);
            observer.complete();
          };

          request.onerror = (event) => {
            observer.error((event.target as IDBRequest).error);
          };
        });
      })
    );
  }
}
