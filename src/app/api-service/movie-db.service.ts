import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Movie } from '../models';

const apiKey = '898ab7da729daca68d3dc55573ca4620';

@Injectable({
  providedIn: 'root',
})
export class MovieDBService {
  genres = new BehaviorSubject(new Map());

  favMovies: Movie[] = [];

  constructor(private http: HttpClient) {}

  getGenreList(type: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/genre/${type}/list?api_key=${apiKey}&language=en-US`;
    return this.http.get(requestURL);
  }

  getTrendingList(type: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/trending/${type}/day?api_key=${apiKey}&language=en-US`;
    return this.http.get(requestURL);
  }

  getPopularList(
    type: string,
    page?: number,
    genres?: string
  ): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/${type}/popular?api_key=${apiKey}&language=en-US&page=${page}&with_genres=${genres}`;
    return this.http.get(requestURL);
  }
  getDetailList(type: string, id: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/${type}/{${id}}?api_key=${apiKey}&language=en-US`;
    return this.http.get(requestURL);
  }

  getSearchList(type: string, query: string, page?: number): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&language=en-US&page=${page}&query=${query}`;
    return this.http.get(requestURL);
  }

  ////
  addToFavList(movie: Movie) {
    if (!this.favMovies.some((favMovie: Movie) => movie.id === favMovie.id))
      this.favMovies.push(movie);
  }
  removeFromFavList(movie: Movie) {
    this.favMovies = this.favMovies.filter(
      (favMovie: Movie) => movie.id !== favMovie.id
    );
  }
}
