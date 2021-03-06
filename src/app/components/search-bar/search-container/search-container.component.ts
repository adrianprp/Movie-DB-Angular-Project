import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieDBService } from 'src/app/api-service/movie-db.service';
import { Movie } from 'src/app/models';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.css'],
})
export class SearchContainerComponent implements OnInit, AfterViewInit {
  @ViewChildren('lastSearchedMovieOfList')
  lastSearchedMovieOfList: QueryList<ElementRef> | undefined;

  genreList: any = new Map();
  favMovies: Movie[] = [];

  searchedMovies: Movie[] = [];

  searchValue: string;
  selectedValue: string = 'movie';

  notFound: boolean = false;

  page: number = 1;
  totalPages: number = 0;

  observer: any;

  constructor(private service: MovieDBService, private route: ActivatedRoute) {
    this.searchValue = '';

    this.route.params.subscribe((params) => {
      this.searchValue = params['searchValue'];
      if (params['isTvShow'] === 'true') {
        this.selectedValue = 'tv';
      } else if (params['isTvShow'] === 'false') {
        this.selectedValue = 'movie';
      }
      this.filterList();
    });
  }

  ngOnInit(): void {
    this.service.genres.subscribe((genres) => (this.genreList = genres));
    this.initializeFavoriteMovies();

    this.intersectionObserver();
  }
  ngAfterViewInit() {
    this.lastSearchedMovieOfList?.changes.subscribe((elementsList) => {
      this.observer.observe(elementsList.last.nativeElement);
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

    this.loadSearchContainer();
  }

  loadSearchContainer() {
    this.notFound = false;
    this.service
      .getSearchList(this.selectedValue, this.searchValue, this.page)
      .subscribe((searchResponse) => {
        this.totalPages = searchResponse.total_pages;

        searchResponse.results.forEach((response: any) => {
          let isFavoriteMovie = this.favMovies.find(
            (movie) => movie.id === response.id
          );

          this.searchedMovies.push({
            id: response.id,
            title:
              this.selectedValue === 'movie' ? response.title : response.name,
            release:
              this.selectedValue === 'movie'
                ? response.release_date
                : response.first_air_date,
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

  intersectionObserver() {
    const options = {
      root: null,
      threshold: 0.5,
    };

    this.observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (!entry.isIntersecting) return;
      if (this.page < this.totalPages) {
        this.page++;
        this.loadSearchContainer();
      }
    }, options);
  }
}
