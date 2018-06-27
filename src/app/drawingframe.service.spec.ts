import { TestBed, inject } from '@angular/core/testing';

import { DrawingframeService } from './drawingframe.service';

describe('DrawingframeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawingframeService]
    });
  });

  it('should be created', inject([DrawingframeService], (service: DrawingframeService) => {
    expect(service).toBeTruthy();
  }));
});
