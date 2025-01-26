import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }
  private searchSubject = new BehaviorSubject<string>('');
  currentSearch$ = this.searchSubject.asObservable();

  updateSearch(query: string){
    this.searchSubject.next(query);
  }
}
