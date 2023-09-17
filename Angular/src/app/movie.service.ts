import { Injectable } from '@angular/core';
import { Movie } from './movie';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) { 
    
  }
    getMovies(): Observable<Movie[]> {
      return this.http.get<Movie[]>(this.apiUrl+"movies");
    }
    deleteMovie(id:number, index:number): Observable<boolean>{
      return this.http.delete<boolean>(this.apiUrl+"movies/" + id); 
    }
    viewDetails(id: number): Observable<Movie>{
      return this.http.get<Movie>(this.apiUrl+"movies/" + id); 
    }
    addMovie(movie: FormData): Observable<Movie>{
      movie.forEach(element => console.log(element));
      return this.http.post<Movie>(this.apiUrl+"movies",movie);
    }
    private moviesSubject = new BehaviorSubject<Movie[]>([]);
    movies$ = this.moviesSubject.asObservable();  
  
    setMovies(movies: Movie[]): void {
      this.moviesSubject.next(movies);
    }
    addMovieToList(movie: Movie): void {
      const currentMovies = this.moviesSubject.value;
      movie.posterPath = environment.baseUrl + movie.posterPath;
      currentMovies.push(movie);

      this.moviesSubject.next(currentMovies);
    }
    getMovieById(id:number): Observable<Movie>{
      return this.http.get<Movie>(environment.baseUrl + "movies/" + id);
    }
    updateMovie(id:number, movie:FormData): Observable<Movie>{
      movie.forEach(element => console.log(element));
      return this.http.patch<Movie>(environment.baseUrl + "movies/" + id, movie);
    }
    updateList(id: number, movie:Movie){
      const currentMovies = this.moviesSubject.value;
      let indexToUpdate = currentMovies.findIndex(item => item.id === id);
      movie.posterPath = environment.baseUrl + movie.posterPath;
      currentMovies[indexToUpdate] = movie;
      
    }
    deleteMovieActor(movieId: number, actorId: number):Observable<boolean>{
        return this.http.delete<boolean>(environment.baseUrl + "movies/" + movieId + "/actors/" + actorId)
    }
    deleteMovieReview(movieId: number, reviewId: number):Observable<boolean>{
      return this.http.delete<boolean>(environment.baseUrl + "movies/" + movieId + "/reviews/" + reviewId)
  }
  filterMovies(value:String): Observable<Movie[]>{
    return this.http.get<Movie[]>(environment.baseUrl + "movies/search?value=" + value );
  }
}
