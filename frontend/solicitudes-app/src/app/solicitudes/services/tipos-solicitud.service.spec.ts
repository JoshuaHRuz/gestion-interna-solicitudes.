import { TestBed } from '@angular/core/testing';

import { TiposSolicitudService } from './tipos-solicitud.service';

describe('TiposSolicitudService', () => {
  let service: TiposSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
