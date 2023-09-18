import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexModule} from "@angular/flex-layout";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FlexModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

}
