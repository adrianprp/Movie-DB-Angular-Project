import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MovieDBService } from 'src/app/api-service/movie-db.service';
import { Movie } from 'src/app/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  //List of slides//
  @ViewChildren('slidesTrending')
  slidesTrending: any | undefined;
  @ViewChildren('slidesPopular')
  slidesPopular: any | undefined;
  //Slider//
  @ViewChild('sliderTrending')
  sliderTrending: any;
  @ViewChild('sliderPopular')
  sliderPopular: any;
  //Slider Container//
  @ViewChild('slider1')
  slider1: any;
  @ViewChild('slider2')
  slider2: any;

  //Movies
  modelType: string = 'movie';
  trendingMoviesList: Movie[] = [];
  popularMoviesList: Movie[] = [];
  genreList: any = new Map();
  allMovies: Movie[] = [];

  //Slider

  curSlideTrending = { current: 0 };
  curSlidePopular = { current: 0 };
  numberOfSlides = 5;
  observer: any;

  constructor(private service: MovieDBService) {}

  ngOnInit(): void {
    //Initialize Movie Containers
    this.initializeTrendingContainer();
    this.initializePopularContainer();
    this.initializeGenreList();

    //Send genres to Favorites Component
    this.service.genres.next(this.genreList);

    this.resizeObserver();
  }
  ngAfterViewInit() {
    this.positionSlides(this.slidesTrending);
    this.positionSlides(this.slidesPopular);

    this.observer.observe(this.slider1.nativeElement);
    this.observer.observe(this.slider2.nativeElement);
  }
  ngOnDestroy() {
    this.observer.unobserve(this.slider1.nativeElement);
    this.observer.unobserve(this.slider2.nativeElement);
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

  sliderScrollLeft(slides: any, currentSlide: any) {
    const maxSlides = slides.length;
    if (currentSlide.current === 0) {
      currentSlide.current = maxSlides - this.numberOfSlides;
    } else {
      currentSlide.current = currentSlide.current - this.numberOfSlides;
    }
    this.goToSlide(slides, currentSlide.current);
  }

  sliderScrollRight(slides: any, currentSlide: any) {
    console.log(currentSlide.current);
    const maxSlides = slides.length;
    if (currentSlide.current === maxSlides - this.numberOfSlides) {
      currentSlide.current = 0;
    } else if (currentSlide.current > maxSlides - this.numberOfSlides) {
      currentSlide.current = maxSlides - this.numberOfSlides;
    } else {
      currentSlide.current = currentSlide.current + this.numberOfSlides;
    }
    this.goToSlide(slides, currentSlide.current);
  }

  goToSlide(slides: any, currentSlide: number) {
    const arr = [...slides];
    arr.forEach((slide: ElementRef, i: number) => {
      slide.nativeElement.style.transform = `translateX(${
        100 * (i - currentSlide)
      }%)`;
    });
  }

  positionSlides(slides: any) {
    slides?.changes.subscribe((elementsList: any) => {
      elementsList._results.forEach((slide: ElementRef, i: number) => {
        slide.nativeElement.style.transform = `translateX(${100 * i}%)`;
      });
    });
  }

  resizeObserver() {
    this.observer = new ResizeObserver((entries) => {
      const [entry] = entries;
      const width = entry.contentRect.width;

      this.setSliderWidth(width, this.sliderTrending, this.curSlideTrending);
      this.setSliderWidth(width, this.sliderPopular, this.curSlidePopular);
    });
  }

  setSliderWidth(width: number, slider: ElementRef, currentSlide: any) {
    if (width < 640) {
      slider.nativeElement.style.width = '20rem';
      this.numberOfSlides = 1;
    } else if (640 < width && width < 960) {
      slider.nativeElement.style.width = '40rem';
      this.numberOfSlides = 2;
    } else if (960 < width && width < 1280) {
      slider.nativeElement.style.width = '60rem';
      this.numberOfSlides = 3;
    } else if (1280 < width && width < 1600) {
      slider.nativeElement.style.width = '80rem';
      this.numberOfSlides = 4;
    } else if (1600 < width && width < 1920) {
      slider.nativeElement.style.width = '100rem';
      this.numberOfSlides = 5;
    }

    const maxNumberOfSlides = slider.nativeElement.children.length;
    if (currentSlide.current > maxNumberOfSlides - this.numberOfSlides) {
      [...slider.nativeElement.children].forEach((slide: any, i: number) => {
        slide.style.transform = `translateX(${
          100 * (i - (maxNumberOfSlides - this.numberOfSlides))
        }%)`;
      });
    }
  }
}
