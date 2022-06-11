import { Component, OnInit } from '@angular/core';
import { MovieDBService } from 'src/app/api-service/movie-db.service';
import { Movie } from 'src/app/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  //Movies
  modelType: string = 'movie';
  trendingMoviesList: Movie[] = [];
  popularMoviesList: Movie[] = [];
  genreList: any = new Map();
  allMovies: Movie[] = [];

  //Slider Scroll
  scrollPerClick: number = 1670;
  scrollAmount: number = 0;

  //

  constructor(private service: MovieDBService) {}

  ngOnInit(): void {
    //Initialize Movie Containers

    this.initializeTrendingContainer();
    this.initializePopularContainer();
    this.initializeGenreList();

    //Send genres to Favorites Component
    this.service.genres.next(this.genreList);
  }

  initializeTrendingContainer() {
    this.service
      .getTrendingList(this.modelType)
      .subscribe((trendingMoviesEl) => {
        trendingMoviesEl.results.forEach((movie: any) => {
          this.trendingMoviesList.push({
            id: movie.id,
            title: movie.title,
            release: movie.release_date,
            image: `http://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
            poster: `http://image.tmdb.org/t/p/original/${movie.poster_path}`,
            genres: movie.genre_ids,
            isFavorite: false,
          });
        });
        this.allMovies.push(...this.trendingMoviesList);
      });
  }
  initializePopularContainer() {
    this.service.getPopularList(this.modelType).subscribe((popularMoviesEl) => {
      popularMoviesEl.results.forEach((movie: any) => {
        this.popularMoviesList.push({
          id: movie.id,
          title: movie.title,
          release: movie.release_date,
          image: `http://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
          poster: `http://image.tmdb.org/t/p/original/${movie.poster_path}`,
          genres: movie.genre_ids,
          isFavorite: false,
        });
      });
      this.allMovies.push(...this.popularMoviesList);
    });
  }

  initializeGenreList() {
    this.service.getGenreList(this.modelType).subscribe((genres) => {
      genres.genres.forEach((genre: any) => {
        this.genreList.set(genre.id, genre.name);
      });
    });
  }

  addFavorite(movie: Movie) {
    movie.isFavorite = true;

    this.service.addToFavList(movie);
  }

  sliderScrollLeft(target: HTMLElement) {
    target.scrollTo({
      top: 0,
      left: (this.scrollAmount -= this.scrollPerClick),
      behavior: 'smooth',
    });

    if (this.scrollAmount < 0) this.scrollAmount = 0;
  }

  sliderScrollRight(target: HTMLElement) {
    if (this.scrollAmount <= target.scrollWidth - target.clientWidth) {
      target.scrollTo({
        top: 0,
        left: (this.scrollAmount += this.scrollPerClick),
        behavior: 'smooth',
      });
    }
  }
}
