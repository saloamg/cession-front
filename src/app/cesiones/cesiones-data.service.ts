import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';

type DocumentType = 'xml' | 'aec';

export interface Cedente {
  id: string;
  nombre: string;
  rut: string;
  razon: string;
  direccion: string;
  correo: string;
  firmantes: string[];
}

export interface CesionarioPreset {
  id: string;
  nombre: string;
  rut: string;
  razon: string;
  direccion?: string;
  correo?: string;
}

export interface CesionPayload {
  cedente: {
    id: string;
    firmante: string;
  };
  cesionario: {
    presetId?: string;
    rut?: string;
    razon?: string;
    direccion?: string;
    correo?: string;
  };
  documentos: {
    tipo: DocumentType;
    archivos: File[];
  };
}

@Injectable({ providedIn: 'root' })
export class CesionesDataService {
  private readonly cedentesUrl = 'assets/mocks/cedentes.json';
  private readonly cesionariosUrl = 'assets/mocks/cesionarios.json';

  constructor(private readonly httpClient: HttpClient) {}

  getCedentes(): Observable<Cedente[]> {
    return this.httpClient.get<Cedente[]>(this.cedentesUrl);
  }

  getCesionarios(): Observable<CesionarioPreset[]> {
    return this.httpClient.get<CesionarioPreset[]>(this.cesionariosUrl);
  }

  submitCesion(payload: CesionPayload): Observable<void> {
    // Mock de env\u00edo. En producci\u00f3n esto deber\u00eda realizar un POST al backend.
    return of(void 0).pipe(
      delay(500),
      tap(() => console.log('[CesionesDataService] payload mock', payload)),
    );
  }
}
