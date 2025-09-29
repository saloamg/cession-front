import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { rutValidator } from '../shared/rut.validator';
import { RutPipe } from '../shared/rut.pipe';

type Cedente = {
  id: string;
  nombre: string;
  rut: string;
  razon: string;
  direccion: string;
  correo: string;
  firmantes: string[];
};

type CesionarioPreset = {
  id: string;
  nombre: string;
  rut: string;
  razon: string;
  direccion?: string;
  correo?: string;
};

type CesionPayload = {
  cedente: {
    id: string;
    firmante: string;
  };
  cesionario: {
    presetId?: string;        // si no es “Otro”
    rut?: string;             // si es “Otro”
    razon?: string;           // si es “Otro”
    direccion?: string;       // opcional
    correo?: string;          // opcional
  };
  documentos: {
    tipo: 'xml' | 'aec';
    archivos: File[];
  };
};

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatDividerModule,
    RutPipe,
  ],
  template: `
  <div class="page">
    <!-- Header simple -->
    <header class="header">
      <div class="brand"><mat-icon>trending_flat</mat-icon>&nbsp;Cesión genérica</div>
    </header>

    <!-- Contenido -->
    <div class="container">
      <form [formGroup]="form" (ngSubmit)="ceder()">
        <div class="grid">
          <!-- Cedente -->
          <mat-card class="panel">
            <h2 class="panel-title">Cedente</h2>

            <!-- Selector de cedente -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Cedente</mat-label>
              <mat-select formControlName="cedenteId" (selectionChange)="onCedenteChange()">
                <mat-option *ngFor="let c of CEDENTES" [value]="c.id">{{ c.nombre }}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Rut</mat-label>
              <input matInput formControlName="ced_rut" [disabled]="true">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Razón social</mat-label>
              <input matInput formControlName="ced_razon" [disabled]="true">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Dirección</mat-label>
              <input matInput formControlName="ced_direccion" [disabled]="true">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Correo</mat-label>
              <input matInput formControlName="ced_correo" [disabled]="true">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Firmante</mat-label>
              <mat-select formControlName="firmante" required>
                <mat-option *ngFor="let f of firmantesDisponibles" [value]="f">{{ f }}</mat-option>
              </mat-select>
            </mat-form-field>
          </mat-card>

          <!-- Cesionario -->
          <mat-card class="panel">
            <h2 class="panel-title">Cesionario</h2>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Cesionario</mat-label>
              <mat-select formControlName="cesionarioPreset" (selectionChange)="onCesionarioChange()">
                <mat-option *ngFor="let cz of CESIONARIOS" [value]="cz.id">{{ cz.nombre }}</mat-option>
                <mat-option value="otro">Otro</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Cuando es “Otro”, habilitamos campos -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Rut</mat-label>
              <input matInput formControlName="ces_rut" [disabled]="!esCesionarioOtro" autocomplete="off">
              <mat-error *ngIf="form.get('ces_rut')?.invalid && esCesionarioOtro">RUT inválido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Razón social</mat-label>
              <input matInput formControlName="ces_razon" [disabled]="!esCesionarioOtro" autocomplete="off">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Dirección</mat-label>
              <input matInput formControlName="ces_direccion" [disabled]="!esCesionarioOtro" autocomplete="off">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Correo</mat-label>
              <input matInput formControlName="ces_correo" [disabled]="!esCesionarioOtro" autocomplete="off">
            </mat-form-field>
          </mat-card>
        </div>

        <!-- Documentos -->
        <mat-card class="panel doc-panel">
          <h2 class="panel-title">Documentos</h2>

          <div class="doc-row">
            <mat-radio-group formControlName="doc_tipo" class="mr16">
              <mat-radio-button value="xml">Xmls</mat-radio-button>
              <mat-radio-button value="aec" class="ml16">Aecs</mat-radio-button>
            </mat-radio-group>

            <button mat-stroked-button type="button" (click)="fileInput.click()">
              <mat-icon>add</mat-icon>&nbsp;Agregar
            </button>
            <input #fileInput type="file" multiple (change)="onFilesSelected($event)" hidden>
          </div>

          <div class="files" *ngIf="files.length">
            <div class="file" *ngFor="let f of files; let i = index">
              <mat-icon inline>insert_drive_file</mat-icon>
              <span class="file-name" [title]="f.name">{{ f.name }}</span>
              <button mat-icon-button color="warn" (click)="removeFile(i)" aria-label="Eliminar">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </mat-card>

        <!-- Botón Ceder -->
        <div class="footer">
          <button mat-raised-button color="primary" [disabled]="!puedeCeder()" type="submit">
            Ceder
          </button>
        </div>
      </form>
    </div>
  </div>
  `,
  styles: [`
    .page{min-height:100vh;background:#f7f8fb;}
    .header{height:64px;background:#062447;color:#fff;display:flex;align-items:center;padding:0 20px;}
    .brand{font-size:20px;font-weight:600;display:flex;align-items:center}
    .container{padding:24px;max-width:1200px;margin:0 auto;}
    .grid{display:grid;grid-template-columns:1fr;gap:24px;}
    @media (min-width: 1024px){ .grid{grid-template-columns:1fr 1fr;} }
    .panel{padding:16px;}
    .panel-title{margin:4px 0 12px 0;font-weight:600}
    .w-full{width:100%}
    .doc-panel .doc-row{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
    .files{display:flex;flex-wrap:wrap;gap:8px}
    .file{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:6px 10px;}
    .file-name{max-width:420px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .footer{display:flex;justify-content:flex-end;margin-top:16px;}
    .ml16{margin-left:16px}.mr16{margin-right:16px}
  `]
})
export class CesionesPageComponent {
  // --- Datos mock (reemplaza por API cuando tengas backend) ---
  CEDENTES: Cedente[] = [
    {
      id: 'otro-ced',
      nombre: 'Otro (demo)',
      rut: '99999999-9',
      razon: 'Empresa Demo SpA',
      direccion: 'Av. Siempre Viva 123',
      correo: 'contacto@demo.cl',
      firmantes: ['Firmante 1', 'Firmante 2'],
    },
  ];

  CESIONARIOS: CesionarioPreset[] = [
    { id: 'banco-x', nombre: 'Banco X', rut: '76.543.210-9', razon: 'Banco X S.A.' },
    { id: 'financiera-y', nombre: 'Financiera Y', rut: '65.432.100-1', razon: 'Financiera Y SpA' },
  ];

  // --- Estado UI / Form ---
  form: FormGroup;
  esCesionarioOtro = false;
  firmantesDisponibles: string[] = [];
  files: File[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Cedente
      cedenteId: [this.CEDENTES[0].id, Validators.required],
      ced_rut: [{ value: '', disabled: true }],
      ced_razon: [{ value: '', disabled: true }],
      ced_direccion: [{ value: '', disabled: true }],
      ced_correo: [{ value: '', disabled: true }],
      firmante: ['', Validators.required],

      // Cesionario
      cesionarioPreset: ['otro', Validators.required], // default “Otro”
      ces_rut: ['', [rutValidator]],                    // requerido solo cuando “Otro”
      ces_razon: [''],
      ces_direccion: [''],
      ces_correo: ['', Validators.email],

      // Documentos
      doc_tipo: ['xml', Validators.required],
    });

    // Inicializa con el primer cedente
    this.setCedente(this.CEDENTES[0]);
    this.onCesionarioChange(); // configura validadores según “Otro”
  }

  // --- Cedente ---
  onCedenteChange() {
    const id = this.form.get('cedenteId')!.value as string;
    const ced = this.CEDENTES.find(c => c.id === id);
    if (ced) this.setCedente(ced);
  }

  private setCedente(c: Cedente) {
    this.form.patchValue({
      ced_rut: c.rut,
      ced_razon: c.razon,
      ced_direccion: c.direccion,
      ced_correo: c.correo,
      firmante: null,
    });
    this.firmantesDisponibles = c.firmantes;
  }

  // --- Cesionario ---
  onCesionarioChange() {
    const presetId = this.form.get('cesionarioPreset')!.value as string;
    this.esCesionarioOtro = presetId === 'otro';

    const rutCtrl = this.form.get('ces_rut')!;
    const razonCtrl = this.form.get('ces_razon')!;
    const dirCtrl = this.form.get('ces_direccion')!;
    const mailCtrl = this.form.get('ces_correo')!;

    if (this.esCesionarioOtro) {
      // habilitar y hacer requeridos básicos
      rutCtrl.setValidators([rutValidator, Validators.required]);
      razonCtrl.setValidators([Validators.required]);
      rutCtrl.enable(); razonCtrl.enable(); dirCtrl.enable(); mailCtrl.enable();
      rutCtrl.reset(); razonCtrl.reset(); dirCtrl.reset(); mailCtrl.reset();
    } else {
      // aplicar datos del preset y bloquear
      const preset = this.CESIONARIOS.find(x => x.id === presetId);
      rutCtrl.clearValidators(); razonCtrl.clearValidators();
      rutCtrl.disable(); razonCtrl.disable(); dirCtrl.disable(); mailCtrl.disable();
      this.form.patchValue({
        ces_rut: preset?.rut ?? '',
        ces_razon: preset?.razon ?? '',
        ces_direccion: preset?.direccion ?? '',
        ces_correo: preset?.correo ?? '',
      });
    }

    rutCtrl.updateValueAndValidity();
    razonCtrl.updateValueAndValidity();
  }

  // --- Documentos ---
  onFilesSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.files = [...this.files, ...Array.from(input.files)];
    input.value = ''; // permite volver a seleccionar los mismos
  }
  removeFile(i: number) { this.files.splice(i, 1); this.files = [...this.files]; }

  // --- Reglas de habilitación del botón Ceder ---
  puedeCeder(): boolean {
    const baseOk = this.form.valid && !!this.form.value.firmante;
    const docsOk = this.files.length > 0;
    // si es “Otro”, exige rut + razón
    if (this.esCesionarioOtro) {
      const rutOk = this.form.get('ces_rut')!.valid && !!this.form.get('ces_rut')!.value;
      const razonOk = !!this.form.get('ces_razon')!.value;
      return baseOk && docsOk && rutOk && razonOk;
    }
    return baseOk && docsOk;
  }

  // --- Submit ---
  ceder() {
    if (!this.puedeCeder()) return;

    const ced = this.CEDENTES.find(c => c.id === this.form.value.cedenteId)!;

    const payload: CesionPayload = {
      cedente: {
        id: ced.id,
        firmante: this.form.value.firmante,
      },
      cesionario: this.esCesionarioOtro
        ? {
            rut: this.form.value.ces_rut,
            razon: this.form.value.ces_razon,
            direccion: this.form.value.ces_direccion,
            correo: this.form.value.ces_correo,
          }
        : { presetId: this.form.value.cesionarioPreset },
      documentos: {
        tipo: this.form.value.doc_tipo,
        archivos: this.files,
      },
    };

    console.log('🔹 Cesión lista para enviar:', payload);
    // TODO: enviar a backend (FormData si incluyes archivos).
    // this.api.crearCesion(payload).subscribe(...)
  }
}
