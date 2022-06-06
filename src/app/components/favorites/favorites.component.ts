import { Component, OnInit } from '@angular/core';
import { MovieDBService } from 'src/app/api-service/movie-db.service';
import { Movie } from 'src/app/models';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favMovies: any = [];
  genreList: any = new Map();
  constructor(private service: MovieDBService) {}

  ngOnInit(): void {
    this.initializeFavoriteMovies();

    this.service.genres.subscribe((genres) => (this.genreList = genres));
  }

  initializeFavoriteMovies() {
    this.favMovies = this.service.favMovies;
  }

  removeFavorite(movie: Movie) {
    movie.isFavorite = false;

    this.service.removeFromFavList(movie);
    this.initializeFavoriteMovies();
  }
}
