import { Component, DoCheck, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  timeout: any = null;

  searchValue: string;
  isTvShow: boolean;

  constructor(private router: Router) {
    this.searchValue = '';
    this.isTvShow = false;
  }

  ngOnInit(): void {}

  clearInput(e: any) {
    this.searchValue = '';
  }

  search(searchValue: string, isTvShow: boolean) {
    this.router.navigate(['/search', searchValue, isTvShow]);
  }

  onKeySearch(event: any, searchForm: NgForm) {
    clearTimeout(this.timeout);
    const $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13 && event.target.value.length > 2) {
        $this.search(searchForm.value.search, searchForm.value.isTvShow);
      }
    }, 1000);
  }

  onChange(searchForm: NgForm) {
    if (searchForm.value.search.length > 2)
      this.search(searchForm.value.search, searchForm.value.isTvShow);
  }
}
