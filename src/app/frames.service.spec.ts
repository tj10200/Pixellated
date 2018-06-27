import { TestBed, inject } from '@angular/core/testing';

import { FramesService } from './frames.service';

describe('FramesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FramesService]
    });
  });

  it('should be created', inject([FramesService], (service: FramesService) => {
    expect(service).toBeTruthy();
  }));
});
