import { TestBed } from '@angular/core/testing';

import { NutritionfactsService } from './nutritionfacts.service';

describe('NutritionfactsService', () => {
  let service: NutritionfactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NutritionfactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
