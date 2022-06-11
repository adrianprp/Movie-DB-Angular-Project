import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { HomeComponent } from './components/home/home.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchContainerComponent } from './components/search-bar/search-container/search-container.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
  },
  {
    path: 'search/:searchValue/:isTvShow',
    component: SearchContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [
  HomeComponent,
  FavoritesComponent,
  SearchBarComponent,
  SearchContainerComponent,
];
