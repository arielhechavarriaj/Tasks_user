import { Component, importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  FooterComponent,
  HeaderComponent,
  ListTasksComponent,
} from '@app/components';
import { FlexModule } from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 100%;
      }

      .content {
        background: rgba(235, 245, 236, 0.92);
      }
    `,
  ],
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchDefault,
    NgSwitchCase,
    RouterOutlet,
    ListTasksComponent,
    HeaderComponent,
    FooterComponent,
    FlexModule,
    NgIf,
  ],
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
    ),
  ],
}).catch((err) => console.error(err));
