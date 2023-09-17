import { Actor } from "./actor";
import { Review } from "./review";

export class Movie {
    id?: number;
    title: string = ''; // Ensure that title is not nullable
    poster: File | undefined; // Match the type with the backend (File or undefined)
    posterPath: string | undefined; // Match the type with the backend (string or undefined)
    releaseDate: Date | undefined; // Match the type with the backend (Date or undefined)
    description: string | undefined; // Match the type with the backend (string or undefined)
    actors: Actor[] | undefined; // Match the type with the backend (Actor[] or undefined)
    reviews: Review[] | undefined; // Match the type with the backend (Review[] or undefined)
  }
  
