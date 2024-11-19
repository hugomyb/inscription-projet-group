import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UsersTableComponent } from './users-table.component';
import { ApiService } from '../api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersTableComponent,
        HttpClientTestingModule,
      ],
      providers: [ApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    const req = httpTestingController.expectOne('https://back-psi-seven.vercel.app/api/users');
    req.flush([]);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on initialization', () => {
    const mockUsers = [
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com' },
      { nom: 'Durand', prenom: 'Marie', email: 'marie.durand@example.com' }
    ];

    component.fetchUsers();

    const req = httpTestingController.expectOne('https://back-psi-seven.vercel.app/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    expect(component.users.length).toBe(2);
    expect(component.users).toEqual(mockUsers);
  });

  it('should handle error when fetching users fails', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.fetchUsers();

    const req = httpTestingController.expectOne('https://back-psi-seven.vercel.app/api/users');
    req.flush('Error fetching users', { status: 500, statusText: 'Server Error' });

    // Vérifie que console.error est appelé avec l'erreur appropriée
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors de la récupération des utilisateurs', expect.anything());

    consoleErrorSpy.mockRestore();
  });

  it('should render users in the template', () => {
    const mockUsers = [
      { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com' },
      { nom: 'Durand', prenom: 'Marie', email: 'marie.durand@example.com' }
    ];

    component.ngOnInit();

    const req = httpTestingController.expectOne('https://back-psi-seven.vercel.app/api/users');
    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);

    fixture.detectChanges();

    const userRows = fixture.debugElement.queryAll(By.css('.user-row'));
    expect(userRows.length).toBe(2);

    expect(userRows[0].nativeElement.textContent).toContain('Dupont');
    expect(userRows[0].nativeElement.textContent).toContain('Jean');
    expect(userRows[1].nativeElement.textContent).toContain('Durand');
    expect(userRows[1].nativeElement.textContent).toContain('Marie');
  });
});
