import {Component, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {InscriptionFormComponent} from './inscription-form/inscription-form.component';
import {OnInit} from '@angular/core';
import {initFlowbite} from 'flowbite';
import {UsersTableComponent} from "./users-table/users-table.component";

/**
 * Root component of the application.
 * Acts as the main container for the Angular application and handles the main view.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InscriptionFormComponent, UsersTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  /**
   * The title of the application.
   * @type {string}
   */
  title = 'cours-1-1';
  @ViewChild('listUsers') listUsers!: UsersTableComponent;

  ngOnInit(): void {
    initFlowbite();
  }

  receivedNewUser(event: any): void {
    this.listUsers.fetchUsers();
  }
}
