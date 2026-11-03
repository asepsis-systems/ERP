const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Sembrando datos iniciales de Logística...');

  // Limpiar datos
  await prisma.movimientoAlmacen.deleteMany();
  await prisma.ordenCompraItem.deleteMany();
  await prisma.ordenCompra.deleteMany();
  await prisma.articulo.deleteMany();
  await prisma.proveedor.deleteMany();

  // Proveedores
  const prov1 = await prisma.proveedor.create({
    data: {
      ruc: '20100047218',
      razonSocial: 'MATACHANA PERU S.A.C.',
      contacto: 'Ing. Carlos Ramos',
      telefono: '+51 987 654 321',
      email: 'ventas@matachana.com.pe',
      direccion: 'Av. Industrial 450, Lima',
      condicionPago: 'Crédito 30 días',
      estado: 'ACTIVO',
    },
  });

  const prov2 = await prisma.proveedor.create({
    data: {
      ruc: '20508923412',
      razonSocial: 'INSUMOS MEDICOS Y QUIMICOS DEL PERU S.A.',
      contacto: 'Mariana Flores',
      telefono: '+51 912 345 678',
      email: 'contacto@inmedperu.pe',
      direccion: 'Jr. Los Cedros 128, San Isidro',
      condicionPago: 'Contado',
      estado: 'ACTIVO',
    },
  });

  const prov3 = await prisma.proveedor.create({
    data: {
      ruc: '20601239841',
      razonSocial: 'EMPAQUES Y SELLOS ESTERILES DEL PACIFICO',
      contacto: 'Roberto Soto',
      telefono: '+51 945 112 233',
      email: 'pedidos@empaquesesteriles.pe',
      direccion: 'Calle Los Plásticos 890, Callao',
      condicionPago: 'Crédito 15 días',
      estado: 'ACTIVO',
    },
  });

  // Artículos
  const art1 = await prisma.articulo.create({
    data: {
      codigo: 'INS-001',
      nombre: 'Indicador Biológico Vapor 24h',
      descripcion: 'Ampolla con esporas Geobacillus stearothermophilus para autoclaves',
      categoria: 'Control de Calidad',
      unidadMedida: 'CJA x 50',
      stockActual: 24,
      stockMinimo: 10,
      precioReferencia: 240.00,
      ubicacion: 'Estante A-1 (Refrigerado)',
    },
  });

  const art2 = await prisma.articulo.create({
    data: {
      codigo: 'INS-002',
      nombre: 'Rollo Manga Mixta Papel Grado Médico 20cm x 100m',
      descripcion: 'Bobina termosellable para empaque de instrumental quirúrgico',
      categoria: 'Empaque',
      unidadMedida: 'RLL',
      stockActual: 15,
      stockMinimo: 8,
      precioReferencia: 110.50,
      ubicacion: 'Estante B-2',
    },
  });

  const art3 = await prisma.articulo.create({
    data: {
      codigo: 'INS-003',
      nombre: 'Cinta Testigo Control Vapor',
      descripcion: 'Cinta adhesiva viraje químico para autoclaves a vapor',
      categoria: 'Control de Calidad',
      unidadMedida: 'RLL',
      stockActual: 4,
      stockMinimo: 10, // Stock bajo de prueba
      precioReferencia: 28.00,
      ubicacion: 'Estante A-2',
    },
  });

  const art4 = await prisma.articulo.create({
    data: {
      codigo: 'QUI-001',
      nombre: 'Detergente Enzimático Multienzimático 5L',
      descripcion: 'Solución biodegradable 4 enzimas para lavado de instrumental',
      categoria: 'Lavado y Desinfección',
      unidadMedida: 'BID',
      stockActual: 8,
      stockMinimo: 5,
      precioReferencia: 185.00,
      ubicacion: 'Área Química Q-1',
    },
  });

  const art5 = await prisma.articulo.create({
    data: {
      codigo: 'REP-001',
      nombre: 'Empaque / Junta Siliconada Puerta Autoclave 50x50',
      descripcion: 'Repuesto original para cámara esterilizadora',
      categoria: 'Repuestos',
      unidadMedida: 'UND',
      stockActual: 2,
      stockMinimo: 2,
      precioReferencia: 350.00,
      ubicacion: 'Cajón Técnico M-1',
    },
  });

  // Orden de compra de prueba
  const orden1 = await prisma.ordenCompra.create({
    data: {
      numero: 'OC-2026-0001',
      proveedorId: prov1.id,
      estado: 'RECIBIDA',
      subtotal: 480.00,
      igv: 86.40,
      total: 566.40,
      observaciones: 'Llegó conforme con Guía de Remisión 001-4921',
      solicitante: 'William (Logística)',
      items: {
        create: [
          {
            articuloId: art1.id,
            cantidad: 2,
            precioUnitario: 240.00,
            subtotal: 480.00,
          },
        ],
      },
    },
  });

  // Movimiento inicial de almacén (Kardex)
  await prisma.movimientoAlmacen.create({
    data: {
      tipo: 'ENTRADA',
      articuloId: art1.id,
      cantidad: 2,
      stockAnterior: 22,
      stockNuevo: 24,
      motivo: 'Recepción Orden de Compra',
      documentoRef: 'OC-2026-0001 / GR-001-4921',
      responsable: 'William (Logística)',
      ordenCompraId: orden1.id,
      observaciones: 'Lote 2026-X, Vencimiento 2028-12',
    },
  });

  console.log('¡Datos sembrados exitosamente en SQLite local!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
