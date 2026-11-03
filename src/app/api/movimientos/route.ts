import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const movimientos = await prisma.movimientoAlmacen.findMany({
      orderBy: { fecha: 'desc' },
      take: 50,
      include: {
        articulo: true,
        ordenCompra: true,
      },
    });

    return NextResponse.json(movimientos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, articuloId, cantidad, motivo, documentoRef, observaciones, responsable } = body;

    const cant = parseFloat(cantidad);
    if (!tipo || !articuloId || isNaN(cant) || cant <= 0) {
      return NextResponse.json(
        { error: 'Tipo, artículo y cantidad positiva son requeridos' },
        { status: 400 }
      );
    }

    const articulo = await prisma.articulo.findUnique({
      where: { id: articuloId },
    });

    if (!articulo) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    const stockAnterior = articulo.stockActual;
    let stockNuevo = stockAnterior;

    if (tipo === 'ENTRADA') {
      stockNuevo = stockAnterior + cant;
    } else if (tipo === 'SALIDA') {
      if (stockAnterior < cant) {
        return NextResponse.json(
          { error: `Stock insuficiente. Stock actual: ${stockAnterior}` },
          { status: 400 }
        );
      }
      stockNuevo = stockAnterior - cant;
    } else if (tipo === 'AJUSTE') {
      stockNuevo = cant; // En ajuste, la cantidad es el nuevo conteo físico
    }

    // Actualizar artículo y crear movimiento en transacción
    const [movimiento] = await prisma.$transaction([
      prisma.movimientoAlmacen.create({
        data: {
          tipo,
          articuloId,
          cantidad: cant,
          stockAnterior,
          stockNuevo,
          motivo: motivo || 'Ajuste manual',
          documentoRef: documentoRef || '',
          observaciones: observaciones || '',
          responsable: responsable || 'William (Logística)',
        },
        include: { articulo: true },
      }),
      prisma.articulo.update({
        where: { id: articuloId },
        data: { stockActual: stockNuevo },
      }),
    ]);

    return NextResponse.json(movimiento, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
