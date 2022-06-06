import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  searchValue: string;
  timeout: any = null;

  constructor(private router: Router) {
    this.searchValue = '';
  }

  ngOnInit(): void {}

  clearInput() {
    this.searchValue = '';
  }

  search(searchValue: string) {
    this.router.navigate(['/search', searchValue]);
  }

  onKeySearch(event: any) {
    clearTimeout(this.timeout);
    const $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.search(event.target.value);
      }
    }, 1000);
  }
}
