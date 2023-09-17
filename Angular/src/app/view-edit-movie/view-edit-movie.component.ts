import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Movie } from '../movie';
import { DatePipe } from '@angular/common';
import { MovieService } from '../movie.service';
import { environment } from '../environment';
import { Actor } from '../actor';
import { Review } from '../review';
import { LoginService } from '../login.service';
import { Pipe, PipeTransform } from '@angular/core'

@Component({
  selector: 'app-view-edit-movie',
  templateUrl: './view-edit-movie.component.html',
  styleUrls: ['./view-edit-movie.component.scss']
})
export class ViewEditMovieComponent implements OnInit{
  updateErrorMessage = "";
    movieForm!: FormGroup;
    isEditable = false;
    isAdmin = false;
    isNewReview: boolean[] = [];
    movie!:Movie;  
    imageFile: File | null = null;
    constructor(private fb: FormBuilder, private ref: DynamicDialogRef
      ,private config: DynamicDialogConfig, private datePipe: DatePipe
      ,private movieService: MovieService, private loginService: LoginService) {}
      selectedImageSrc: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0] as File;
    this.movieForm.patchValue({
      poster: file
    });
    this.movieForm.patchValue({
      posterPath: file.name
     
    });
    if (file) {
      this.displaySelectedImage(file);
    }
  }

  displaySelectedImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImageSrc = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
      /*onFileChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files?.length) {
          this.imageFile = inputElement.files[0];
          this.movieForm.controls['image'].setValue(this.imageFile);

        }
      }*/
      clearErrorMessage() {
        this.updateErrorMessage = "";
      }
    ngOnInit(): void {

      this.loginService.tokenExpired();
      this.movieForm = this.fb.group({
        title: ['' ,Validators.required],
        description: ['',Validators.required],
        releaseDate: ['',Validators.required],
        poster: [null],
        //cast: new FormControl<Actor[] | null>(null)
        cast: this.fb.array([]),
        reviews: this.fb.array([],),
      });
      this.isEditable = this.config.data.isEditable;
      this.isAdmin = this.config.data.isAdmin;
      this.movieService.getMovieById(this.config.data.movieId).subscribe(movie=>{
        
        this.movie = movie;
        this.movie.posterPath = environment.baseUrl + movie.posterPath;
        this.selectedImageSrc = this.movie.posterPath;
        this.patch();
        this.patchReviews();
        console.log("rev" + this.movie.reviews);
        this.movie.reviews?.forEach(element => {
          console.log(element)
          this.isNewReview.push(false);
        });      
        this.movieForm.patchValue({
          title: this.movie.title, 
          description: this.movie.description,
          releaseDate: this.datePipe.transform(this.movie.releaseDate, 'MM/dd/yyyy'),
          // Set other form control values
        });
      }
        );
    }
    areAnyCastMembersEmpty(): boolean {
      return this.getActors.controls.some((actorControl) => {
        const firstName = actorControl.get('firstName')?.value;
        return !firstName || firstName.trim() === '';
      });
    }
    
    areAnyReviewsEmpty(): boolean {
      return this.getReviews.controls.some((reviewControl) => {
        const description = reviewControl.get('description')?.value;
        return !description || description.trim() === '';
      });
    }
    
    
    get getActors(){
      return this.movieForm.get('cast') as FormArray;
    }
    get getReviews(){
      return this.movieForm.get('reviews') as FormArray;
    }
    patch() {
      const control = <FormArray>this.movieForm.get('cast');
      this.movie.actors?.forEach(x => {
        control.push(this.patchValues(x.id!, x.firstName))
      })
      //if(!this.movie.actors?.length && this.isEditable){
        //this.addActor();
      //}
    }
  patchReviews(){
    const reviewsControl = <FormArray>this.movieForm.get('reviews');
      this.movie.reviews?.forEach(x => {
        reviewsControl.push(this.patchReviewsValues(x.id!, x.description))
      })
      //if(!this.movie.reviews?.length && this.isEditable){
        //this.addReview();
      //}
  }
  addActor(){
    this.getActors.push(this.fb.group({
      id: [0],
      firstName: ['']
    }));
  }
  addReview(){
    this.getReviews.push(this.fb.group({
      id: [0],
      description: ['']
    }));
    debugger;
    this.isNewReview.push(true);
  }
  patchValues(id:number, firstName:string) {
    return this.fb.group({
      id: [id],
      firstName: [firstName]
    })
  }
  patchReviewsValues(id: number, description: string){
    return this.fb.group({
      id: [id],
      description: [description]
    })
  }
  
  onSubmit(): void {
    //this.movieForm.controls['cast'].setValue(this.getActors.value);
    const formData = new FormData();
    const movieData = this.movieForm.value;
    // Append other form data
    formData.append('title', movieData.title);
    if (movieData.releaseDate !== null){
      let date = this.datePipe.transform(movieData.releaseDate, 'MM/dd/yyyy');
      try{
        formData.append('releaseDate', date!);
      }catch(e){
        formData.append('releaseDate',  movieData.releaseDate);
      }
    }
    formData.append("description", JSON.stringify(movieData.description.replace(/\n/g, ' ')).replace(/"/g, ''))
    if (movieData.cast) {
      let actors:Actor[]= [];

      movieData.cast?.forEach((actor: any) =>
      {
        console.log(actor);
        actors.push(actor)
        
      })
      formData.append('actorsStr', JSON.stringify(actors))
      }
      if (movieData.reviews) {
        let reviews:Review[]= [];
        movieData.reviews?.forEach((review: Review) =>
        {
          reviews.push(review)
          
        })
        formData.append('reviewsStr', JSON.stringify(reviews))
        }    
        console.log(this.movie.id)
        formData.append('poster', movieData.poster);
        
        let observer = {next:(movie:any)=>{
      
          this.movieService.updateList(this.movie.id!,movie.value)
          this.ref.close();

        },
        error:(err:any) => {
          console.log(err.error);
            this.updateErrorMessage = 'This movie already exists.';
    
        }}
        this.movieService.updateMovie(this.movie.id!,formData).subscribe(observer);
        formData.forEach((el:any)=>
    console.log(el)); 
    this.deletedActors.forEach((id: number) =>{
      this.movieService.deleteMovieActor(this.movie.id!, id).subscribe();
    })
    this.deletedRevs.forEach((id: number) =>{
      this.movieService.deleteMovieReview(this.movie.id!, id).subscribe();
    })
  }
  deletedRevs: number[] = [];
  deletedActors: number[] = [];
  removeActor(index: number, id:any) {
    this.getActors.removeAt(index);
    this.deletedActors.push(id);
    //this.movieService.deleteMovieActor(this.movie.id!, id).subscribe();
  }
  removeReview(index: number, id:any) {
    this.getReviews.removeAt(index);
    console.log(id);
    this.deletedRevs.push(id);
    //this.movieService.deleteMovieReview(this.movie.id!, id).subscribe();
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
  
  }
  
