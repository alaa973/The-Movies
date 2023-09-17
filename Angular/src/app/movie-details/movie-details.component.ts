import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { Actor } from '../actor';
import { Review } from '../review';
import { MovieComponent } from '../movie/movie.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import {JwtHelperService} from '@auth0/angular-jwt';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {
  addErrorMessage = "";
   movie!:Movie;
    movieForm!: FormGroup;
    date!:Date;
  constructor(private fb: FormBuilder, private movieService: MovieService,
    private ref: DynamicDialogRef, private messageService: MessageService,
    private loginService: LoginService,
    private router: Router) {}
    clearAddErrorMessage() {
      this.addErrorMessage = '';
    }
  ngOnInit(): void {
    this.loginService.tokenExpired();
    
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      poster: [null,  Validators.required],
      //posterPath:[''],
      releaseDate: ['', Validators.required],
      actors: new FormControl<string[] | null>(null),
      reviews: new FormControl<string[] | null>(null),
      description:['', Validators.required]
    });
  }
  onSubmit(): void {
    //console.log(movie);
    //this.movieService.addMovie(movie).subscribe();
    let reviews:Review[];
    const formData = new FormData();
    const movieData = this.movieForm.value;
    // Append other form data
    formData.append('title', movieData.title);
    if (movieData.releaseDate !== null){
      formData.append('releaseDate', movieData.releaseDate.toISOString());
    }
    formData.append("description", JSON.stringify(movieData.description.replace(/\n/g, ' ')).replace(/"/g, ''))
    
    //formData.append('stringifiedReviews', JSON.stringify(movieData.reviews));
     
    // Assuming actorsToAdd is an array of Actor objects you want to add
    // Add more actors as needed
    if (movieData.actors) {
        let actors:Actor[]= [];
        movieData.actors?.forEach((actor: string) =>
        {
          actors.push({firstName:actor})
          
        })
        formData.append('actorsStr', JSON.stringify(actors))
        }
        if (movieData.reviews) {
          let reviews:Review[]= [];
          movieData.reviews?.forEach((review: string) =>
          {
            reviews.push({description:review})
            
          })
          formData.append('reviewsStr', JSON.stringify(reviews))
          }
// Push the actorsToAdd array to the form control
     
   // }
  
   /* if (movieData.reviews) {
      movieData.reviews.forEach((review: string, index: number) => {
        formData.append(`reviews[${index}]`, review);
      });
    }*/
    // Append the poster file*/
    formData.append('poster', movieData.poster);
    //formData.append('actors', JSON.stringify(movieData.actors));
    //formData.append('posterPath', movieData.posterPath);
    //this.movieService.addMovie(movieData).subscribe();
    let observer = {next:(movie:any)=>{
      
      this.movieService.addMovieToList(movie.value)
      this.ref?.close();
      console.log(movie);
      this.messageService.add({ severity: 'info', summary: 'Movie Added', detail: movie.value.title});
    },
    error:(err:any) => {
      console.log(err.error);
        this.addErrorMessage = err.error;

    }
  }
    this.movieService.addMovie(formData).subscribe(
      observer
      );

  }
  
  onPosterFileChange(event: any): void {
    const file = event.target.files[0] as File;
    this.movieForm.patchValue({
      poster: file
    });
   
    console.log(file);
    this.movieForm.patchValue({
      posterPath: file.name
     
    });
  }
  
  get title(){
    return this.movieForm.get("title");
  }
  get description(){
    return this.movieForm.get("description");
  }
  get releaseDate(){
    return this.movieForm.get("releaseDate");
  }
  /*get actors(){
   return this.movieForm.get('actors') as FormArray; 
  }*/

}
