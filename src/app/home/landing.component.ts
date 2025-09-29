import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-home-landing',
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <!-- NAV -->
    <mat-toolbar class="nav" color="primary">
      <div class="nav-inner">
        <div class="brand">
          <mat-icon>apartment</mat-icon>
          <span>Cesiones Electrónicas</span>
        </div>
        <div class="spacer"></div>
        <a mat-button routerLink="/registro">Hazte Cliente</a>
        <button mat-raised-button color="accent" routerLink="/login">Ingresar</button>
      </div>
    </mat-toolbar>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-inner">
        <h1>
          Soluciones de <span class="grad">cesión electrónica</span> para empresas financieras
        </h1>
        <p class="lead">
          Plataforma segura, eficiente y alineada a normativas para la gestión de cesiones de documentos electrónicos.<br>
          Optimice sus procesos, reduzca riesgos y obtenga trazabilidad total.
        </p>
        <div class="cta">
          <button mat-stroked-button color="primary" (click)="scrollTo('features')">
            Ver funcionalidades
          </button>
        </div>
        <div class="hero-stats">
          <div>
            <mat-icon class="stat-ic">verified_user</mat-icon>
            <strong>100%</strong>
            <span>Conformidad normativa</span>
          </div>
          <div>
            <mat-icon class="stat-ic">schedule</mat-icon>
            <strong>24/7</strong>
            <span>Disponibilidad</span>
          </div>
          <div>
            <mat-icon class="stat-ic">bolt</mat-icon>
            <strong>Ágil</strong>
            <span>Onboarding en minutos</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="section" id="features">
      <h2 class="title">Funcionalidades clave</h2>
      <div class="grid">
        <mat-card class="feature">
          <mat-icon class="f-ic">cloud_upload</mat-icon>
          <h3>Carga Inteligente</h3>
          <p>
            Suba documentos XML/AEC de forma masiva, con validación automática de formato, duplicados y tamaño.
          </p>
        </mat-card>
        <mat-card class="feature">
          <mat-icon class="f-ic">security</mat-icon>
          <h3>Seguridad Avanzada</h3>
          <p>
            Autenticación robusta, cifrado de datos y control de acceso por roles. Cumplimiento con estándares financieros.
          </p>
        </mat-card>
        <mat-card class="feature">
          <mat-icon class="f-ic">gavel</mat-icon>
          <h3>Compliance</h3>
          <p>
            Flujos alineados a SII y mejores prácticas de auditoría. Bitácora completa y exportable.
          </p>
        </mat-card>
        <mat-card class="feature">
          <mat-icon class="f-ic">insights</mat-icon>
          <h3>Trazabilidad Total</h3>
          <p>
            Visualice el historial de cada cesión: quién, cuándo y qué se gestionó, con reportes descargables.
          </p>
        </mat-card>
      </div>
    </section>

    <!-- DYNAMIC STEPS -->
    <section class="section alt">
      <h2 class="title">¿Cómo funciona?</h2>
      <div class="steps">
        <div class="step">
          <span class="num">1</span>
          <h4>Acceda</h4>
          <p>Ingrese con su cuenta institucional y acceda a un entorno seguro.</p>
        </div>
        <div class="step">
          <span class="num">2</span>
          <h4>Configure</h4>
          <p>Seleccione cedente, cesionario y firmante. Adjunte los documentos a ceder.</p>
        </div>
        <div class="step">
          <span class="num">3</span>
          <h4>Gestione</h4>
          <p>Revise, confirme y genere la cesión. Obtenga respaldo y trazabilidad inmediata.</p>
        </div>
      </div>
    </section>

    <!-- CLIENTS / TESTIMONIALS -->
    <section class="section">
      <h2 class="title">Confían en nosotros</h2>
      <div class="grid">
        <mat-card class="quote">
          <p>
            “La plataforma nos permitió automatizar la gestión de cesiones, cumpliendo con los más altos estándares del sector financiero.”
          </p>
          <div class="who">
            <mat-icon>account_circle</mat-icon> Gerente de Operaciones – Banco Regional
          </div>
        </mat-card>
        <mat-card class="quote">
          <p>
            “La trazabilidad y la seguridad nos entregan tranquilidad frente a auditorías y reguladores.”
          </p>
          <div class="who">
            <mat-icon>account_circle</mat-icon> Jefa de Cumplimiento – Financiera Andes
          </div>
        </mat-card>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cta-bottom">
      <h2>Solicite una demostración</h2>
      <p>
        Descubra cómo optimizar la gestión de cesiones electrónicas en su empresa.<br>
        Pruebe la plataforma o agende una demo personalizada.
      </p>
      <div class="cta">
        <button mat-raised-button color="primary" routerLink="/login">Ingresar</button>
        <button mat-stroked-button color="primary" routerLink="/login">Solicitar demo</button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="foot-inner">
        <span>© {{year}} Cesiones Electrónicas • v1.0</span>
        <span class="links">
          <a href="#" (click)="$event.preventDefault()">Términos</a>
          <a href="#" (click)="$event.preventDefault()">Privacidad</a>
        </span>
      </div>
    </footer>
  `,
  styles: [`
    :host { display:block; font-family: "Inter", "Segoe UI", Arial, sans-serif; background: #f7f8fb; }
    .nav {
      position: sticky; top: 0; z-index: 100;
      background: linear-gradient(90deg, #062447 0%, #1e90ff 100%);
      color: #fff;
      box-shadow: 0 2px 8px 0 rgba(30,144,255,0.07);
    }
    .nav-inner{ max-width:1200px; margin:0 auto; width:100%; display:flex; align-items:center; gap:12px; }
    .brand{ display:flex; align-items:center; gap:8px; font-weight:700; font-size:1.18rem; letter-spacing:.2px }
    .spacer{ flex:1 1 auto; }
    .nav a[mat-button], .nav button[mat-raised-button] {
      font-weight: 500;
      color: #fff;
    }
    .nav button[mat-raised-button] {
      background: #1e90ff;
      color: #fff;
    }

    .hero{
      background: radial-gradient(1000px 400px at 50% -10%, #eaf1fb 0, #f7f9ff 50%, #ffffff 100%);
      padding: 64px 16px 48px;
      border-bottom: 1px solid #e5e7eb;
    }
    .hero-inner{ max-width:1100px; margin:0 auto; text-align:center; }
    h1{ font-size: clamp(32px, 4vw, 48px); margin:0 0 16px; line-height:1.1; font-weight:600; color:#062447;}
    .grad{
      background: linear-gradient(90deg,#1e90ff 0%,#7c4dff 100%);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      background-clip:text;
      text-fill-color:transparent;
      font-weight:700;
    }
    .lead{ max-width:760px; margin:0 auto 24px; color:#334155; font-size: clamp(17px, 2vw, 20px); }
    .cta { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-bottom: 12px; }
    .hero-stats{
      margin-top:32px; display:flex; gap:40px; justify-content:center; flex-wrap:wrap; color:#062447;
    }
    .hero-stats div{ text-align:center; min-width:120px; }
    .hero-stats strong{ display:block; font-size:22px; font-weight:600; color:#1e90ff; }
    .stat-ic{ font-size:28px; color:#1e90ff; margin-bottom:2px; }

    .section{ padding: 56px 16px; }
    .section.alt{ background:#f6f7fb; }
    .title{ text-align:center; margin:0 0 32px; font-size: clamp(22px, 3vw, 28px); color:#062447; font-weight:600; }

    .grid{
      max-width:1100px; margin:0 auto;
      display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:20px;
    }
    .feature{
      padding:24px 18px; border-radius:14px;
      background: #fff;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 8px 0 rgba(30,144,255,0.04);
      display: flex; flex-direction: column; align-items: flex-start; min-height: 210px;
    }
    .f-ic{ font-size:36px; color:#1e90ff; margin-bottom:10px; }

    .steps{
      max-width:900px; margin:0 auto;
      display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px;
    }
    .step{
      background:#fff;
      border:1px solid #e5e7eb;
      border-radius:14px;
      padding:24px 18px;
      text-align:center;
      box-shadow: 0 2px 8px 0 rgba(30,144,255,0.03);
      transition: box-shadow 0.2s;
    }
    .step:hover {
      box-shadow: 0 4px 16px 0 rgba(30,144,255,0.10);
      border-color: #1e90ff;
    }
    .num{
      display:inline-grid; place-items:center;
      width:38px;height:38px;
      border-radius:999px;
      background:#1e90ff;
      color:#fff;
      font-weight:700;
      font-size:1.1rem;
      margin-bottom:10px;
      box-shadow: 0 2px 8px 0 rgba(30,144,255,0.10);
    }

    .quote{
      padding:24px 18px; border-radius:14px;
      background: #fff;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 8px 0 rgba(30,144,255,0.04);
      min-height: 120px;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .quote p{ margin:0 0 12px; font-style:italic; color:#374151; font-size:1.05rem; }
    .who{ display:flex; align-items:center; gap:8px; color:#4b5563; font-size:0.98rem; }

    .cta-bottom{
      padding:48px 16px; text-align:center;
      background: linear-gradient(180deg,#eaf1fb 0,#fff 100%);
      border-top: 1px solid #e5e7eb;
    }
    .cta-bottom h2{ margin:0 0 10px; color:#062447; font-weight:600; }
    .cta-bottom p{ color:#334155; margin-bottom:18px; }

    .footer{
      border-top:1px solid #e5e7eb; background:#fff;
      font-size:0.98rem;
    }
    .foot-inner{
      max-width:1100px; margin:0 auto; padding:16px;
      display:flex; align-items:center; gap:12px;
    }
    .foot-inner .links{ margin-left:auto; display:flex; gap:16px; }
    .foot-inner a{ color:#1e90ff; text-decoration:none; font-weight:500; }
    .foot-inner a:hover{ text-decoration:underline; }
    @media (max-width: 700px) {
      .hero-inner, .grid, .foot-inner, .steps { max-width: 98vw; }
      .nav-inner { flex-direction: column; gap: 8px; }
    }
  `]
})
export class HomeLandingComponent {
  year = new Date().getFullYear();
  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
