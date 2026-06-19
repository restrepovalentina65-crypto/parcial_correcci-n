import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Persona, Vendedor } from '../../models/persona.model';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './persona-form.component.html'
})
export class PersonaFormComponent implements OnInit {
  persona: Persona = {
    Nombre: '',
    Apellido: '',
    Edad: 0,
    Correo: '',
    VendedorId: null // Inicializado por defecto en null (Sin vendedor)
  };
  editMode: boolean = false;
  vendedores: Vendedor[] = []; // Lista para almacenar los vendedores del catálogo

  constructor(
    private personaService: PersonaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Cargar el catálogo de vendedores al iniciar
    this.personaService.getVendedores().subscribe({
      next: (data) => {
        this.vendedores = data;
      },
      error: (err) => {
        console.error('Error al cargar vendedores:', err);
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.personaService.getPersona(+id).subscribe({
        next: (data) => {
          this.persona = data;
          // Asegurar que si viene sin vendedor o undefined, se maneje como null
          if (this.persona.VendedorId === undefined || this.persona.VendedorId === null) {
            this.persona.VendedorId = null;
          }
        },
        error: (err) => {
          console.error('Error al cargar la persona:', err);
        }
      });
    }
  }

  savePersona(): void {
    // Asegurar que el VendedorId sea null si no se seleccionó ninguno
    if (this.persona.VendedorId === undefined || this.persona.VendedorId === null || (this.persona.VendedorId as any) === '') {
      this.persona.VendedorId = null;
    } else {
      // Forzar que sea un número por seguridad
      this.persona.VendedorId = Number(this.persona.VendedorId);
    }

    if (this.editMode && this.persona.Id) {
      this.personaService.updatePersona(this.persona.Id, this.persona).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Error al actualizar persona:', err)
      });
    } else {
      this.personaService.createPersona(this.persona).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Error al crear persona:', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
