import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexModule} from "@angular/flex-layout";

@Component({
  selector: 'app-footer',
  standalone: true,
    imports: [CommonModule, FlexModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

}
