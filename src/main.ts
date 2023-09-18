import {importProvidersFrom} from '@angular/core';
import {AppComponent} from './app/app.component';
import {AppRoutingModule} from './app/app-routing.module';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(BrowserModule, AppRoutingModule,FormsModule,ReactiveFormsModule,HttpClientModule),

    ],

})
  .catch(err => console.error(err));
