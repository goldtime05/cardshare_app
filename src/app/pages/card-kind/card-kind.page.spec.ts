import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardKindPage } from './card-kind.page';

describe('CardKindPage', () => {
  let component: CardKindPage;
  let fixture: ComponentFixture<CardKindPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardKindPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardKindPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
