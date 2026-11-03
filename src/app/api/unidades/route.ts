import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const unidades = await prisma.unidad.findMany({
      orderBy: { codigo: 'asc' },
    });
    return NextResponse.json(unidades);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codigo, tipo, placa, marca, chofer, estado } = body;

    const nueva = await prisma.unidad.create({
      data: {
        codigo: parseInt(codigo),
        tipo: tipo || 'H 100',
        placa: placa.toUpperCase(),
        marca: marca.toUpperCase(),
        chofer,
        estado: estado || 'Activo',
      },
    });

    return NextResponse.json(nueva, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
