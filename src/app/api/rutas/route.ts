import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const rutas = await prisma.ruta.findMany({
      orderBy: { numeroRuta: 'desc' },
      include: {
        unidad: true,
      },
    });

    const parsed = rutas.map((r) => ({
      ...r,
      destinos: JSON.parse(r.destinos || '[]'),
    }));

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { numeroRuta, horaSalida, horaRetorno, unidadCodigo, chofer, ayudante, destinos, fecha } = body;

    const count = await prisma.ruta.count();
    const nueva = await prisma.ruta.create({
      data: {
        numeroRuta: numeroRuta ? parseInt(numeroRuta) : 750 + count,
        horaSalida: horaSalida || '06:00',
        horaRetorno: horaRetorno || '--:--',
        unidadCodigo: unidadCodigo ? parseInt(unidadCodigo) : null,
        chofer: chofer || 'Sin Asignar',
        ayudante: ayudante || '',
        destinos: JSON.stringify(destinos || []),
        fecha: fecha || new Date().toISOString().split('T')[0],
      },
      include: {
        unidad: true,
      },
    });

    return NextResponse.json({
      ...nueva,
      destinos: JSON.parse(nueva.destinos),
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, horaSalida, horaRetorno, unidadCodigo, chofer, ayudante, destinos } = body;

    const data: any = {};
    if (horaSalida !== undefined) data.horaSalida = horaSalida;
    if (horaRetorno !== undefined) data.horaRetorno = horaRetorno;
    if (unidadCodigo !== undefined) data.unidadCodigo = unidadCodigo ? parseInt(unidadCodigo) : null;
    if (chofer !== undefined) data.chofer = chofer;
    if (ayudante !== undefined) data.ayudante = ayudante;
    if (destinos !== undefined) data.destinos = JSON.stringify(destinos);

    const updated = await prisma.ruta.update({
      where: { id },
      data,
      include: { unidad: true },
    });

    return NextResponse.json({
      ...updated,
      destinos: JSON.parse(updated.destinos),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
