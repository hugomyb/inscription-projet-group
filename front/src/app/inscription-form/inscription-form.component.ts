import {Component, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import {Router, RouterLink} from '@angular/router';

/**
 * Component for handling the user registration form.
 */
@Component({
  selector: 'app-inscription-form',
  templateUrl: './inscription-form.component.html',
  styleUrls: ['./inscription-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
})

export class InscriptionFormComponent {
  /**
   * The registration form group object.
   * @type {FormGroup}
   */
  inscriptionForm: FormGroup;
  @Output() newUser: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Constructor to initialize the form builder and Toastr service.
   * @param {FormBuilder} fb - Angular FormBuilder service to create form groups and controls.
   * @param {ToastrService} toastr - Service to display toast notifications.
   * @param apiService - Service to handle API requests.
   * @param router
   */
  constructor(
    protected fb: FormBuilder,
    private toastr: ToastrService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.inscriptionForm = this.fb.group({
      nom: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)]],
      prenom: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      dateNaissance: ['', [Validators.required, this.validateAge]],
      ville: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)]],
      codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  /**
   * Getter for the 'nom' form control.
   * @returns {AbstractControl | null} The form control for 'nom'.
   */
  get nom() { return this.inscriptionForm.get('nom'); }

  /**
   * Getter for the 'prenom' form control.
   * @returns {AbstractControl | null} The form control for 'prenom'.
   */
  get prenom() { return this.inscriptionForm.get('prenom'); }

  /**
   * Getter for the 'email' form control.
   * @returns {AbstractControl | null} The form control for 'email'.
   */
  get email() { return this.inscriptionForm.get('email'); }

  /**
   * Getter for the 'dateNaissance' form control.
   * @returns {AbstractControl | null} The form control for 'dateNaissance'.
   */
  get dateNaissance() { return this.inscriptionForm.get('dateNaissance'); }

  /**
   * Getter for the 'ville' form control.
   * @returns {AbstractControl | null} The form control for 'ville'.
   */
  get ville() { return this.inscriptionForm.get('ville'); }

  /**
   * Getter for the 'codePostal' form control.
   * @returns {AbstractControl | null} The form control for 'codePostal'.
   */
  get codePostal() { return this.inscriptionForm.get('codePostal'); }

  /**
   * Getter for the 'password' form control.
   * @returns {AbstractControl | null} The form control for 'password'.
   */
  get password() { return this.inscriptionForm.get('password'); }

  /**
   * Custom validator to check if the user is at least 18 years old.
   * @param {AbstractControl} control - The form control to validate.
   * @returns {Object | null} An object with a validation error if the user is under 18, or null if valid.
   */
  validateAge(control: any) {
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      return { minAge: true };
    }
    return null;
  }

  /**
   * Handles the form submission event.
   * Displays a success message if the form is valid and resets the form.
   */
  onSubmit() {
    if (this.inscriptionForm.valid) {
      this.apiService.createUser(this.inscriptionForm.value).subscribe(
        (response) => {
          this.toastr.success('Inscription réussie !', 'Succès');
          this.inscriptionForm.reset({
            nom: '',
            prenom: '',
            email: '',
            dateNaissance: '',
            ville: '',
            codePostal: '',
            password: ''
          });

          this.newUser.emit(response);
          this.router.navigate(['/login']); // Redirection vers la page de connexion
        },
        (error) => {
          if (error.status === 400 && error.error.error === 'Cet email est déjà utilisé.') {
            this.toastr.error('Cet email est déjà utilisé. Veuillez en choisir un autre.', 'Erreur');
          } else {
            console.error('Erreur lors de la création de l\'utilisateur', error);
            this.toastr.error('Une erreur est survenue lors de l\'inscription.', 'Erreur');
          }
        }
      );
    }
  }
}
