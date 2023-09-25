import { NgModule } from '@angular/core';
import {
  provideRouter,
  RouterModule,
  Routes,
  withComponentInputBinding,
} from '@angular/router';
import {
  DashboardLayoutComponent,
  PageNotFoundComponent,
} from '@app/components';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './guards';
import { TaskService } from '@services/task-service.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'task',
        loadComponent: () =>
          import('./components/list-tasks/list-tasks.component').then(
            (c) => c.ListTasksComponent,
          ),
      },
      {
        path: 'formTask/:id',
        loadComponent: () =>
          import('././components/form-task/form-task.component').then(
            (c) => c.FormTaskComponent,
          ),
      },
      {
        path: '404',
        loadComponent: () =>
          import('./components/page-not-found/page-not-found.component').then(
            (c) => c.PageNotFoundComponent,
          ),
      },
      {
        path: 'author',
        loadComponent: () =>
          import('././components/author/author.component').then(
            (c) => c.AuthorComponent,
          ),
      },
      { path: '', redirectTo: 'task', pathMatch: 'full' },
    ],
    providers: [TaskService],
  },
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login.component').then(
            (c) => c.LoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register.component').then(
            (c) => c.RegisterComponent,
          ),
      },
      { path: '**', redirectTo: 'login' },
    ],
  },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [provideRouter(routes, withComponentInputBinding())],
})
export class AppRoutingModule {}
