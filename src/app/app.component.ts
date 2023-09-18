import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgSwitch, NgSwitchDefault, NgSwitchCase, NgIf} from '@angular/common';
import {ListTasksComponent} from "./components/list-tasks/list-tasks.component";
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {FlexModule} from "@angular/flex-layout";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
  imports: [NgSwitch, NgSwitchDefault, NgSwitchCase, RouterOutlet, ListTasksComponent, HeaderComponent, FooterComponent, FlexModule, NgIf]
})
export class AppComponent {
  title = 'task_user';
}
