import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona, Vendedor } from '../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = 'http://localhost:3001/api/personas';

  constructor(private http: HttpClient) { }

  // Obtiene la lista de personas
  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  // Obtiene una persona específica por ID
  getPersona(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/${id}`);
  }

  // Crea una nueva persona, incluyendo opcionalmente VendedorId
  createPersona(persona: Persona): Observable<any> {
    return this.http.post(this.apiUrl, persona);
  }

  // Actualiza una persona existente, incluyendo opcionalmente VendedorId
  updatePersona(id: number, persona: Persona): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, persona);
  }

  // Elimina una persona
  deletePersona(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // NUEVO: Obtiene el listado de todos los vendedores
  getVendedores(): Observable<Vendedor[]> {
    // Reemplaza /personas por /persona/vendedores para apuntar al nuevo endpoint
    const vendedoresUrl = this.apiUrl.replace('/personas', '/persona/vendedores');
    return this.http.get<Vendedor[]>(vendedoresUrl);
  }

  // Busca personas por nombre o cliente en el servidor
  buscarPersonas(termino: string): Observable<Persona[]> {
    const buscarUrl = `${this.apiUrl}/buscar?nombre=${encodeURIComponent(termino)}`;
    return this.http.get<Persona[]>(buscarUrl);
  }
}

