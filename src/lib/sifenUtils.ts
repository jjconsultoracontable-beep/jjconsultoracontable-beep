import { Producto, Certificado, Cliente, Usuario, Venta } from '../types';

/**
 * Módulo 11 para RUC en Paraguay (SET)
 */
export function calcularDvRuc(rucInput: string): number {
  try {
    const rucLimpio = String(rucInput).split('-')[0].replace(/\D/g, '');
    if (!rucLimpio) return 0;
    const pMax = 11;
    let s = 0;
    let p = 2;
    for (let i = rucLimpio.length - 1; i >= 0; i--) {
      s += parseInt(rucLimpio[i], 10) * p;
      p = p < pMax ? p + 1 : 2;
    }
    const r = s % 11;
    return r > 1 ? 11 - r : 0;
  } catch {
    return 0;
  }
}

/**
 * Módulo 11 genérico para cálculo de CDC en SIFEN
 */
export function calcularDv11Cdc(numero: string): number {
  const limpio = String(numero).replace(/\D/g, '');
  const pMax = 11;
  let s = 0;
  let p = 2;
  for (let i = limpio.length - 1; i >= 0; i--) {
    s += parseInt(limpio[i], 10) * p;
    p = p < pMax ? p + 1 : 2;
  }
  const r = s % 11;
  return r > 1 ? 11 - r : 0;
}

/**
 * Convierte un monto numérico a texto en español (SON GUARANÍES...)
 */
export function numeroALetras(n: number): string {
  const conversion = (num: number): string => {
    const u = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const d = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const c = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
    
    if (num === 0) return '';
    if (num === 100) return 'CIEN';
    
    let res = c[Math.floor(num / 100)] + ' ';
    const dec = num % 100;
    if (dec < 10) {
      res += u[dec];
    } else if (dec < 16) {
      res += ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE'][dec - 10];
    } else {
      const decena = Math.floor(dec / 10);
      const unidad = dec % 10;
      res += d[decena] + (decena > 2 && unidad > 0 ? ' Y ' : '') + u[unidad];
    }
    return res.trim();
  };

  const val = Math.floor(Math.abs(n));
  if (val === 0) return 'SON GUARANÍES CERO.-';

  const millon = Math.floor(val / 1000000);
  const mil = Math.floor((val % 1000000) / 1000);
  const cien = val % 1000;

  let txt = '';
  if (millon > 0) {
    txt += millon > 1 ? `${conversion(millon)} MILLONES ` : 'UN MILLÓN ';
  }
  if (mil > 0) {
    txt += mil > 1 ? `${conversion(mil)} MIL ` : 'UN MIL ';
  }
  if (cien > 0) {
    txt += conversion(cien);
  }

  return `SON GUARANÍES ${txt.trim()}.-`;
}

/**
 * Genera un CDC de SIFEN (44 dígitos)
 */
export function generarCDC(
  tipoDoc: string = '01',
  rucEmisor: string,
  establecimiento: string = '001',
  puntoExpedicion: string = '001',
  numeroFactura: string,
  fecha: Date = new Date()
): string {
  const rucNum = rucEmisor.replace(/\D/g, '').slice(0, 8).padStart(8, '0');
  const nroNum = numeroFactura.replace(/\D/g, '').padStart(7, '0');
  const tipoContribuyente = '1'; // 1=Persona Física / Jurídica
  const fechaFormatted = fecha.toISOString().slice(0, 10).replace(/-/g, '');
  const codigoSeguridad = '1234567890';

  const cdcSinDv = `${tipoDoc}${rucNum}${establecimiento}${puntoExpedicion}${nroNum}${tipoContribuyente}${fechaFormatted}${codigoSeguridad}`;
  const dv = calcularDv11Cdc(cdcSinDv);
  return `${cdcSinDv}${dv}`;
}

export const initialProductos: Producto[] = [
  { codigo: '7840001001', cod_venta: 'PROD1', nombre: 'Yerba Mate Orgánica 500g', precio: 18000, stock: 50, iva: 10, unidad: 'UN' },
  { codigo: '7840001002', cod_venta: 'PROD2', nombre: 'Agua Mineral 2L', precio: 6500, stock: 120, iva: 5, unidad: 'UN' },
  { codigo: '7840001003', cod_venta: 'PROD3', nombre: 'Carne Vacuna Rabadilla', precio: 48000, stock: 15.5, iva: 0, unidad: 'KG' },
  { codigo: '7840001004', cod_venta: 'PROD4', nombre: 'Pan Felipe Tradicional', precio: 8000, stock: 30, iva: 5, unidad: 'KG' },
  { codigo: '7840001005', cod_venta: 'PROD5', nombre: 'Aceite de Girasol 1L', precio: 14500, stock: 40, iva: 10, unidad: 'UN' }
];

export const initialCertificados: Certificado[] = [
  {
    titular: 'JUAN JAZMIN CONSULTORA CONTABLE Y COMERCIAL S.A.',
    nombre_fantasia: 'ÑANGAREKO',
    nombre_sistema: 'ÑANGAREKO SIFEN',
    ruc: '80012345-6',
    timbrado: '16543210',
    inicio_vigencia: '01/01/2026',
    direccion: 'Av. Eusebio Ayala 2450, Asunción',
    telefono: '+595 21 555 1234',
    actividad: 'Venta al por mayor y menor de productos e inventarios',
    cert_path: 'C:\\sifen\\certificados\\firma_digital.p12',
    logo_path: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80'
  }
];

export const initialClientes: Cliente[] = [
  {
    ruc: '4567890-2',
    nombre: 'JUAN CARLOS BENÍTEZ MEZA',
    direccion: 'Palma 452, Asunción',
    telefono: '0981 123 456',
    email: 'jcbenitez@gmail.com',
    tipo_doc: 'RUC',
    tipo_contribuyente: 'FÍSICA',
    ciudad: 'Asunción',
    departamento: 'Capital'
  },
  {
    ruc: '1234567-8',
    nombre: 'MARÍA ELENA GÓMEZ',
    direccion: 'Mariscal López 1200, San Lorenzo',
    telefono: '0971 654 321',
    email: 'mgomez@hotmail.com',
    tipo_doc: 'RUC',
    tipo_contribuyente: 'FÍSICA',
    ciudad: 'San Lorenzo',
    departamento: 'Central'
  },
  {
    ruc: '80099887-1',
    nombre: 'EMPRESA CONSTRUCTORA DEL SUR S.R.L.',
    direccion: 'Ruta 1 Km 15, Capiatá',
    telefono: '021 987 654',
    email: 'facturacion@constructoradelsur.com.py',
    tipo_doc: 'RUC',
    tipo_contribuyente: 'JURÍDICA',
    ciudad: 'Capiatá',
    departamento: 'Central'
  },
  {
    ruc: '4444444-0',
    nombre: 'CONSUMIDOR FINAL / SIN NOMBRE',
    direccion: 'ASUNCIÓN - PARAGUAY',
    telefono: '',
    email: 'sinemail@sifen.gov.py',
    tipo_doc: 'INNOMINADO',
    tipo_contribuyente: 'NO_CONTRIBUYENTE',
    ciudad: 'Asunción',
    departamento: 'Capital'
  }
];

export const initialUsuarios: Usuario[] = [
  { user: 'admin', password: '1234', rol: 'ADMINISTRADOR' },
  { user: 'cajero1', password: '1234', rol: 'CAJERO' }
];

export const initialVentas: Venta[] = [
  {
    id: 1,
    fecha: '01/08/2026 10:30',
    total: 36000,
    iva10: 3273,
    iva5: 0,
    exenta: 0,
    cdc: '0180012345001001000000112026080112345678901',
    emisor_ruc: '80012345-6',
    emisor_nombre: 'JUAN JAZMIN CONSULTORA CONTABLE Y COMERCIAL S.A.',
    cliente_nom: 'JUAN CARLOS BENÍTEZ MEZA',
    cliente_ruc: '4567890-2',
    cliente_dir: 'Palma 452, Asunción',
    cliente_tel: '0981 123 456',
    cliente_email: 'jcbenitez@gmail.com',
    cliente_tipo_doc: 'RUC',
    cliente_ciudad: 'Asunción',
    nro_factura: '001-001-0000001',
    condicion: 'Contado',
    items: [
      {
        producto: initialProductos[0],
        cant: 2,
        subtotal: 36000
      }
    ]
  }
];
