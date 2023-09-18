import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthorComponent} from "./components/author/author.component";
import {ListTasksComponent} from "./components/list-tasks/list-tasks.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {isNotAuthenticatedGuard} from "./guards";
import {RegisterPageComponent} from "./components/register-page/register-page.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";

const routes: Routes = [
  {
    path: 'task',
    component: ListTasksComponent
  },
  {
    path: 'author',
    component: AuthorComponent
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '**', redirectTo: 'login' },
    ]

  },
  {path: '', redirectTo: '/task', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
