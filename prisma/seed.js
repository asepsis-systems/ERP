const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Sembrando datos exactos de Unidades y Rutas de Logística...');

  await prisma.ruta.deleteMany();
  await prisma.unidad.deleteMany();

  // 1. Sembrar las 9 Unidades exactas de la captura de pantalla
  const unidadesData = [
    { codigo: 1, tipo: 'H 100', placa: 'CBH-936', marca: 'HYUNDAI', chofer: 'Edgar Lopez Dominguez', estado: 'Activo' },
    { codigo: 2, tipo: 'H 100', placa: 'AHW-911', marca: 'HYUNDAI', chofer: 'Ricardo García Julca', estado: 'Activo' },
    { codigo: 3, tipo: 'H 100', placa: 'ASN-735', marca: 'HYUNDAI', chofer: 'Edwin John Poma Pituy', estado: 'Activo' },
    { codigo: 4, tipo: 'H 100', placa: 'AVX-938', marca: 'HYUNDAI', chofer: 'Edwin Challa Sillcahue', estado: 'Activo' },
    { codigo: 5, tipo: 'H 100', placa: 'AYQ-870', marca: 'HYUNDAI', chofer: 'Reynaldo Geronimo Medoza', estado: 'Activo' },
    { codigo: 6, tipo: 'X 30', placa: 'BBC-766', marca: 'SHINERAY', chofer: 'Jorge Antonio Davila Andia', estado: 'Activo' },
    { codigo: 7, tipo: 'X 30', placa: 'CLJ-797', marca: 'SHINERAY', chofer: 'Egner Hidalgo Loja', estado: 'Activo' },
    { codigo: 8, tipo: 'X 30', placa: 'CLJ-930', marca: 'SHINERAY', chofer: 'Kevin Kid Espinoza Huaraca', estado: 'Activo' },
    { codigo: 9, tipo: 'H 100', placa: 'BTU-716', marca: 'HYUNDAI', chofer: 'Miguel Angel Davila Andia', estado: 'Activo' },
  ];

  for (const u of unidadesData) {
    await prisma.unidad.create({ data: u });
  }
  console.log('✔ 9 Unidades creadas');

  // 2. Sembrar las Rutas de la Proyección de Rutas
  const today = new Date().toISOString().split('T')[0];
  const rutasData = [
    {
      numeroRuta: 741,
      horaSalida: '06:00',
      horaRetorno: '10:15',
      unidadCodigo: 3,
      chofer: 'Pituy',
      ayudante: '',
      destinos: JSON.stringify(['MEDAVAN', 'RISSO', 'DR. LLANOS', 'PRIME AESTETIC', 'ÑAHUI', 'AVENDAÑO', 'CLINICA ANGLO']),
      fecha: today,
    },
    {
      numeroRuta: 737,
      horaSalida: '06:00',
      horaRetorno: '--:--',
      unidadCodigo: 7,
      chofer: 'Egner',
      ayudante: '',
      destinos: JSON.stringify(['LANATTA', 'INSANOR']),
      fecha: today,
    },
    {
      numeroRuta: 738,
      horaSalida: '06:00',
      horaRetorno: '08:15',
      unidadCodigo: 1,
      chofer: 'Ignacio / Na...',
      ayudante: '',
      destinos: JSON.stringify(['SABOGAL']),
      fecha: today,
    },
    {
      numeroRuta: 739,
      horaSalida: '06:00',
      horaRetorno: '--:--',
      unidadCodigo: 2,
      chofer: 'Ricardo',
      ayudante: 'Kenji',
      destinos: JSON.stringify(['SANTA ISABEL', 'CLINICA SAN BORJA', 'CEFRA', 'PROVISION 2000', 'AUNA']),
      fecha: today,
    },
    {
      numeroRuta: 743,
      horaSalida: '06:00',
      horaRetorno: '--:--',
      unidadCodigo: 4,
      chofer: 'Reynaldo',
      ayudante: '',
      destinos: JSON.stringify(['SAN JUAN DE DIOS', 'LOS ROSALES', 'SAN FELIPE - LA MOLINA']),
      fecha: today,
    },
    {
      numeroRuta: 748,
      horaSalida: '06:15',
      horaRetorno: '08:45',
      unidadCodigo: null,
      chofer: 'Onésimo',
      ayudante: '',
      destinos: JSON.stringify(['EUROCLINICA', 'MIRAFLORES', 'CASIMIRO']),
      fecha: today,
    },
  ];

  for (const r of rutasData) {
    await prisma.ruta.create({ data: r });
  }
  console.log('✔ Rutas de proyección sembradas');
  console.log('¡Base de datos sincronizada con las capturas de pantalla!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
