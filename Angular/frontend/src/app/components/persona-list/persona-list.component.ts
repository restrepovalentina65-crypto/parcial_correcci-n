import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona.model';

@Component({
  selector: 'app-persona-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './persona-list.component.html'
})
export class PersonaListComponent implements OnInit {
  personas: Persona[] = [];
  searchTerm: string = '';

  constructor(
    private personaService: PersonaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPersonas();
  }

  loadPersonas(): void {
    this.personaService.getPersonas().subscribe({
      next: (data) => {
        console.log('Datos recibidos del servidor:', data);
        this.personas = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar personas:', err);
      }
    });
  }

  get filteredPersonas(): Persona[] {
    if (!this.searchTerm.trim()) {
      return this.personas;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.personas.filter(p => 
      p.Nombre.toLowerCase().includes(term) ||
      p.Apellido.toLowerCase().includes(term)
    );
  }

  deletePersona(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de eliminar esta persona?')) {
      this.personaService.deletePersona(id).subscribe(() => {
        this.loadPersonas();
      });
    }
  }
}
