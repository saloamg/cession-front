import { Amplify } from 'aws-amplify';
import { environment } from './environments/environment';
Amplify.configure(environment.awsAmplify);

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
bootstrapApplication(AppComponent, appConfig).catch(console.error);
