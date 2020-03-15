import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsListPage } from './contacts-list.page';

describe('ContactsListPage', () => {
  let component: ContactsListPage;
  let fixture: ComponentFixture<ContactsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
