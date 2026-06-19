// Modelo para la entidad Persona
export interface Persona {
  Id?: number;
  Nombre: string;
  Apellido: string;
  Edad: number;
  Correo: string;
  VendedorId?: number | null; // ID del vendedor asignado (puede ser nulo)
  VendedorNombre?: string;    // Nombre del vendedor devuelto por el join en el backend
}

// Modelo para la entidad Vendedor
export interface Vendedor {
  Id: number;
  Nombre: string;
}
