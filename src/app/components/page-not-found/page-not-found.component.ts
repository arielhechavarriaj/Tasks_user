import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexModule} from "@angular/flex-layout";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, FlexModule, RouterLink],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

}
