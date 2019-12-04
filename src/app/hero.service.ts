import { Injectable } from '@angular/core';
import { Hero } from './hero';
//import { HEROES } from './mock-heroes';
import { Observable, of} from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders(
    { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
};
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<any>(`getHero id=${id}`))
    );
  }
  getHeroes (): Observable<any> {
    return this.http.get<any>(this.heroesUrl)
    .pipe(tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<any>('getHeroes',[]))
    );
    
  }
  
  updateHero ( hero: Hero): Observable<any> {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.http.put<Hero>(url, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<any>('addHero'))
    );
  }
deleteHero (hero: Hero | number): Observable<any> {
  const id = typeof hero === 'number' ? hero : hero.id;
  const url = `${this.heroesUrl}/${id}`;

  return this.http.delete<any>(url, httpOptions).pipe(
    tap(_ => this.log(`deleted hero id=${id}`)),
    catchError(this.handleError<any>('deleteHero'))
  );
}
/* GET: 입력된 문구가 이름에 포함된 히어로 목록을 반환합니다. */
searchHeroes(term: string): Observable<Hero[]> {
  if (!term.trim()) {
    // 입력된 내용이 없으면 빈 배열을 반환합니다.
    return of([]);
  }
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
    tap(_ => this.log(`found heroes matching "${term}"`)),
    catchError(this.handleError<Hero[]>('searchHeroes', []))
  );
}
  
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  private log(message: string) {
  this.messageService.add(`HeroService: ${message}`);
  }
  private heroesUrl = 'http://localhost:3000/users';  // 
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };  
  }
  

}
