import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTasksComponent } from './components/list-tasks/list-tasks.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './guards';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { AuthorComponent } from './components/author/author.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'task',
        component: ListTasksComponent,
      },
      {
        path: '404',
        component: PageNotFoundComponent,
      },
      {
        path: 'author',
        component: AuthorComponent,
      },
    ],
  },
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '**', redirectTo: 'login' },
    ],
  },
  { path: '', redirectTo: '/task', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
