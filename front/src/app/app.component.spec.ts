import {TestBed, ComponentFixture} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {InscriptionFormComponent} from './inscription-form/inscription-form.component';
import {UsersTableComponent} from './users-table/users-table.component';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        InscriptionFormComponent,
        UsersTableComponent,
        RouterTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize Flowbite on ngOnInit', () => {
    const initFlowbiteSpy = jest.spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(initFlowbiteSpy).toHaveBeenCalled();
  });

  it('should call fetchUsers when a new user is received', () => {
    const usersTableComponent = fixture.debugElement.query(By.directive(UsersTableComponent)).componentInstance;
    jest.spyOn(usersTableComponent, 'fetchUsers');

    component.receivedNewUser({});
    expect(usersTableComponent.fetchUsers).toHaveBeenCalled();
  });
});
