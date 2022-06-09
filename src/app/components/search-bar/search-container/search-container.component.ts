import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieDBService } from 'src/app/api-service/movie-db.service';
import { Movie } from 'src/app/models';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.css'],
})
export class SearchContainerComponent implements OnInit {
  genreList: any = new Map();
  favMovies: Movie[] = [];

  searchedMovies: Movie[] = [];

  searchValue: string;
  selectedValue: any;
  notFound: boolean = false;

  page: number = 1;

  constructor(private service: MovieDBService, private route: ActivatedRoute) {
    this.searchValue = '';
    this.selectedValue = 'movie';
  }

  ngOnInit(): void {
    this.service.genres.subscribe((genres) => (this.genreList = genres));
    this.initializeFavoriteMovies();

    this.route.params.subscribe((params) => {
      this.searchValue = params['searchValue'];
      this.filterList();
    });
  }

  addFavorite(movie: Movie) {
    movie.isFavorite = true;
    this.service.addToFavList(movie);
  }
  initializeFavoriteMovies() {
    this.favMovies = this.service.favMovies;
  }

  filterList() {
    this.page = 1;
    this.searchedMovies = [];

    if (this.searchValue.length > 2) {
      this.loadSearchContainer();
    }
  }

  loadSearchContainer() {
    this.notFound = false;
    console.log(this.notFound);
    this.service
      .getSearchList(this.selectedValue, this.searchValue, this.page)
      .subscribe((searchResponse) => {
        searchResponse.results.forEach((response: any) => {
          let isFavoriteMovie = this.favMovies.find(
            (movie) => movie.id === response.id
          );

          this.searchedMovies.push({
            id: response.id,
            title: response.title,
            release: response.release_date,
            image: `http://image.tmdb.org/t/p/original/${response.backdrop_path}`,
            poster: `http://image.tmdb.org/t/p/original/${response.poster_path}`
              ? `http://image.tmdb.org/t/p/original/${response.poster_path}`
              : `../../../assets/poster-holding.jpg`,
            genres: response.genre_ids,
            isFavorite:
              isFavoriteMovie !== undefined
                ? isFavoriteMovie.isFavorite
                : false,
          });
        });
        if (this.searchedMovies.length === 0) {
          this.notFound = true;
        }
      });
  }

  loadMore() {
    this.page = this.page + 1;
    this.loadSearchContainer();
  }
}
