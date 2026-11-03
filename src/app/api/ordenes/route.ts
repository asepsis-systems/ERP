import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const ordenes = await prisma.ordenCompra.findMany({
      orderBy: { fecha: 'desc' },
      include: {
        proveedor: true,
        items: {
          include: {
            articulo: true,
          },
        },
      },
    });

    return NextResponse.json(ordenes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proveedorId, items, observaciones, solicitante } = body;

    if (!proveedorId || !items || !items.length) {
      return NextResponse.json(
        { error: 'Proveedor e items son obligatorios' },
        { status: 400 }
      );
    }

    // Generar correlativo automático
    const count = await prisma.ordenCompra.count();
    const year = new Date().getFullYear();
    const numero = `OC-${year}-${String(count + 1).padStart(4, '0')}`;

    let subtotal = 0;
    const itemsData = items.map((it: any) => {
      const cant = parseFloat(it.cantidad) || 0;
      const precio = parseFloat(it.precioUnitario) || 0;
      const sub = cant * precio;
      subtotal += sub;
      return {
        articuloId: it.articuloId,
        cantidad: cant,
        precioUnitario: precio,
        subtotal: sub,
      };
    });

    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    const nuevaOrden = await prisma.ordenCompra.create({
      data: {
        numero,
        proveedorId,
        observaciones: observaciones || '',
        solicitante: solicitante || 'William (Logística)',
        subtotal,
        igv,
        total,
        items: {
          create: itemsData,
        },
      },
      include: {
        proveedor: true,
        items: {
          include: {
            articulo: true,
          },
        },
      },
    });

    return NextResponse.json(nuevaOrden, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
