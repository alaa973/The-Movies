import { AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';
import { environment } from '../environment';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { ViewEditMovieComponent } from '../view-edit-movie/view-edit-movie.component';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})

export class MovieComponent implements OnInit{
  movies: Movie[] = [];
  allMovies: Movie[] = [];
  searchValue="";
  constructor(private dialogService: DialogService, 
    private movieService: MovieService, private elementRef: ElementRef,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService, private loginService: LoginService) {}
    admin =  this.loginService.isAdmin();
    ngOnInit(): void {
    this.loginService.tokenExpired();
    this.loadMovies();
  
    this.movieService.movies$.subscribe((movies) => {
      this.movies = movies;
      this.allMovies = this.movies;
    });
  }
  ref: DynamicDialogRef | undefined;
  
  performSearch(value:string){
    this.loginService.tokenExpired();
    this.movies  = this.allMovies
    
    this.movieService.filterMovies(value).subscribe(movies => {
      movies.forEach((movie) => {
        movie.posterPath = environment.baseUrl + movie.posterPath;
        console.log(movie.posterPath);
      });
      this.movies = movies;
    })
  }
  show(id: number, isEditable:boolean, admin:boolean) {
    if(this.loginService.tokenExpired()){
      return;
    }
    this.ref  = this.dialogService.open(ViewEditMovieComponent, {
        header: 'Details',
        width: '40%',
        height: "90%",
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data:{isEditable:isEditable, movieId: id, admin:admin}
    });}
  loadMovies(): void {
    this.movieService.getMovies().subscribe((movies) => {
      movies.forEach((movie) => {
        movie.posterPath = environment.baseUrl + movie.posterPath;
        console.log(movie.posterPath);
      });
      this.movieService.setMovies(movies);

    });
  }
  editMovie(event:Event, id:number){
    if(this.loginService.tokenExpired()){
      return;
    }
    event.stopPropagation();
    this.show(id, true, true);
  }
  deleteMovie(event:Event, id:number, title:string, index: number): void{
    if(this.loginService.tokenExpired()){
      return;
    }
    event.stopPropagation();
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this movie?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.movieService.deleteMovie(id, index).subscribe((state)=>{
          this.movies.splice(index, 1);
          this.messageService.add({ severity: 'info', summary: 'Deleted', detail: title+" Deleted."});

        })
        
        }
  });
  }
  addMovie(movie:FormData):void{
    this.loginService.tokenExpired();
      this.movieService.addMovie(movie).subscribe(movie=>{
        this.movies.push(movie);
      })
  }
  //viewDetails(id:number):void{
     //this.movieService.viewDetails(id).subscribe((data)=>{
      //console.log(data);
    //})
  //}

}
