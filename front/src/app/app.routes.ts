import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {UsersTableComponent} from './users-table/users-table.component';
import {InscriptionFormComponent} from './inscription-form/inscription-form.component';
import {authGuard} from './guard/auth.guard';
import {LoginComponent} from './login/login.component';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  {
    title: "Connexion",
    path: "login",
    component: LoginComponent
  },
  {
    title: "Inscription",
    path: "register",
    component: InscriptionFormComponent
  },
  {
    path: "app",
    canActivate: [authGuard],
    children: [
      {
        title: "Liste des utilisateurs",
        path: "users",
        component: UsersTableComponent
      }
    ]
  },
  {
    path: "**",
    redirectTo: "/login",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
