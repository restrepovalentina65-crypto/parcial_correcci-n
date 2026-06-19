import { Routes } from '@angular/router';
import { PersonaListComponent } from './components/persona-list/persona-list.component';
import { PersonaFormComponent } from './components/persona-form/persona-form.component';

export const routes: Routes = [
  { path: '', component: PersonaListComponent },
  { path: 'personas/nueva', component: PersonaFormComponent },
  { path: 'personas/editar/:id', component: PersonaFormComponent },
  { path: '**', redirectTo: '' }
];
