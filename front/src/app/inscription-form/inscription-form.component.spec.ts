import { TestBed, ComponentFixture } from '@angular/core/testing';
import { InscriptionFormComponent } from './inscription-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InscriptionFormComponent', () => {
  let component: InscriptionFormComponent;
  let fixture: ComponentFixture<InscriptionFormComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InscriptionFormComponent,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [ApiService]
    }).compileComponents();

    fixture = TestBed.createComponent(InscriptionFormComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when required fields are empty', () => {
    expect(component.inscriptionForm.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const email = component.email;
    email?.setValue('invalid-email');
    expect(email?.valid).toBeFalsy();

    email?.setValue('valid@example.com');
    expect(email?.valid).toBeTruthy();
  });

  it('should validate age to be at least 18 years', () => {
    const dateNaissance = component.dateNaissance;
    dateNaissance?.setValue('2010-01-01'); // User under 18 years old
    expect(dateNaissance?.valid).toBeFalsy();
    expect(dateNaissance?.errors?.['minAge']).toBeTruthy();

    dateNaissance?.setValue('2000-01-01'); // User at least 18 years old
    expect(dateNaissance?.valid).toBeTruthy();
  });

  it('should enable the submit button when the form is valid', () => {
    component.inscriptionForm.setValue({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      dateNaissance: '2000-01-01',
      ville: 'Paris',
      codePostal: '75001'
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(false);
  });

  it('should reset the form after a successful submission', () => {
    component.inscriptionForm.setValue({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      dateNaissance: '2000-01-01',
      ville: 'Paris',
      codePostal: '75001'
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    const req = httpTestingController.expectOne('https://back-psi-seven.vercel.app/api/users');
    req.flush({ message: 'Utilisateur créé avec succès' });

    fixture.detectChanges();

    expect(component.inscriptionForm.pristine).toBe(true);
    expect(component.inscriptionForm.value).toEqual({
      nom: '',
      prenom: '',
      email: '',
      dateNaissance: '',
      ville: '',
      codePostal: ''
    });
  });

  it('should display a success message on successful form submission', () => {
    component.inscriptionForm.setValue({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      dateNaissance: '2000-01-01',
      ville: 'Paris',
      codePostal: '75001'
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    const req = httpTestingController.expectOne('https://back-psi-seven.vercel.app/api/users');
    req.flush({ message: 'Utilisateur créé avec succès' });

    fixture.detectChanges();

    const toast = document.querySelector('.toast-message');
    expect(toast?.textContent).toContain('Inscription réussie !');
  });

  it('should display a generic error message for server error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.inscriptionForm.setValue({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      dateNaissance: '2000-01-01',
      ville: 'Paris',
      codePostal: '75001'
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    const req = httpTestingController.expectOne('https://back-psi-seven.vercel.app/api/users');
    req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });

    fixture.detectChanges();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors de la création de l\'utilisateur', expect.anything());

    const errorToast = document.querySelector('.toast-message');
    expect(errorToast?.textContent).toContain('Une erreur est survenue lors de l\'inscription.');

    consoleErrorSpy.mockRestore();
  });

  it('should display an error message when email is already in use', () => {
    component.inscriptionForm.setValue({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      dateNaissance: '2000-01-01',
      ville: 'Paris',
      codePostal: '75001'
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    const req = httpTestingController.expectOne('https://back-psi-seven.vercel.app/api/users');
    req.flush({ error: 'Cet email est déjà utilisé.' }, { status: 400, statusText: 'Bad Request' });

    fixture.detectChanges();

    const errorToast = document.querySelector('.toast-message');
    expect(errorToast?.textContent).toContain('Cet email est déjà utilisé. Veuillez en choisir un autre.');
  });

  it('should emit newUser event after successful user creation', () => {
    jest.spyOn(component.newUser, 'emit');

    component.inscriptionForm.setValue({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      dateNaissance: '2000-01-01',
      ville: 'Paris',
      codePostal: '75001'
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    const req = httpTestingController.expectOne('https://back-psi-seven.vercel.app/api/users');
    req.flush({ message: 'Utilisateur créé avec succès' });

    fixture.detectChanges();

    expect(component.newUser.emit).toHaveBeenCalledWith({ message: 'Utilisateur créé avec succès' });
  });
});
