import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCodePage } from './country-code.page';

describe('CountryCodePage', () => {
  let component: CountryCodePage;
  let fixture: ComponentFixture<CountryCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
