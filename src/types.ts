export interface Producto {
  codigo: string;
  cod_venta: string;
  nombre: string;
  precio: number;
  stock: number;
  iva: 0 | 5 | 10;
  unidad: string;
}

export interface Certificado {
  titular: string;
  nombre_fantasia?: string;
  nombre_sistema?: string;
  ruc: string;
  timbrado: string;
  inicio_vigencia: string;
  direccion: string;
  telefono: string;
  actividad: string;
  cert_path?: string;
  logo_path?: string;
}

export interface Cliente {
  ruc: string;
  nombre: string;
  direccion: string;
  telefono?: string;
  email?: string;
  tipo_doc?: 'RUC' | 'CI' | 'PASAPORTE' | 'DNI' | 'INNOMINADO';
  tipo_contribuyente?: 'FÍSICA' | 'JURÍDICA' | 'NO_CONTRIBUYENTE';
  ciudad?: string;
  departamento?: string;
}

export interface CartItem {
  producto: Producto;
  cant: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  iva10: number;
  iva5: number;
  exenta: number;
  cdc: string;
  emisor_ruc: string;
  emisor_nombre: string;
  cliente_nom: string;
  cliente_ruc: string;
  cliente_dir: string;
  cliente_tel?: string;
  cliente_email?: string;
  cliente_tipo_doc?: string;
  cliente_ciudad?: string;
  nro_factura: string;
  condicion: 'Contado' | 'Crédito';
  items: CartItem[];
}

export interface Usuario {
  user: string;
  password?: string;
  rol: 'ADMINISTRADOR' | 'CAJERO';
}

export interface LicenciaSaaS {
  id: string;
  empresaNombre: string;
  ruc: string;
  plan: 'BÁSICO' | 'PRO SIFEN' | 'ENTERPRISE';
  montoMensual: number;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: 'ACTIVA' | 'PRUEBA 15 DÍAS' | 'SUSPENDIDA' | 'VENCIDA';
  claveActivacion: string;
  contactoEmail?: string;
  contactoTel?: string;
}
