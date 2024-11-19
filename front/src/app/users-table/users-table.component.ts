import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {CommonModule, NgForOf} from '@angular/common';
import {AuthService} from '../services/auth.service';
import {ToastrService} from 'ngx-toastr';

/**
 * Le composant UsersTableComponent est responsable de l'affichage de la liste des utilisateurs.
 * Il récupère les données des utilisateurs via le service ApiService et les affiche dans une table.
 */
@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    NgForOf,
    CommonModule
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {
  /**
   * Liste des utilisateurs récupérés à partir du backend.
   * @type {any[]}
   */
  users: any[] = [];
  /**
   * Indique si l'utilisateur actuel est un administrateur.
   * @type {boolean}
   */
  isAdmin: boolean = false;

  /**
   * Crée une instance de UsersTableComponent.
   * @param {ApiService} apiService - Le service utilisé pour récupérer les utilisateurs.
   * @param authService
   * @param toastr
   */
  constructor(private apiService: ApiService, private authService: AuthService, private toastr: ToastrService,) {}

  /**
   * Méthode appelée automatiquement par Angular après l'initialisation du composant.
   * Elle déclenche la récupération des utilisateurs depuis l'API.
   */
  ngOnInit(): void {
    this.isAdmin = this.authService.getRole() === 'admin';
    this.fetchUsers();
  }

  /**
   * Récupère la liste des utilisateurs à partir de l'API et met à jour la propriété `users`.
   * Gère également les erreurs en cas d'échec de la requête.
   */
  fetchUsers(): void {
    this.apiService.getUsers().subscribe(
      (data: any) => {
        this.users = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  deleteUser(userId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.apiService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user._id !== userId);
          this.toastr.success('L\'utilisateur a été supprimé avec succès.', 'Succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', err);
          this.toastr.error('Une erreur est survenue lors de la suppression de l\'utilisateur.', 'Erreur');
        }
      });
    }
  }
}
