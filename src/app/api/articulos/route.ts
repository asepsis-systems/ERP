import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const categoria = searchParams.get('categoria') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { codigo: { contains: search } },
        { descripcion: { contains: search } },
      ];
    }
    if (categoria && categoria !== 'TODAS') {
      where.categoria = categoria;
    }

    const articulos = await prisma.articulo.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json(articulos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      codigo,
      nombre,
      descripcion,
      categoria,
      unidadMedida,
      stockActual,
      stockMinimo,
      precioReferencia,
      ubicacion,
    } = body;

    if (!codigo || !nombre) {
      return NextResponse.json(
        { error: 'Código y nombre son obligatorios' },
        { status: 400 }
      );
    }

    const nuevo = await prisma.articulo.create({
      data: {
        codigo: codigo.trim().toUpperCase(),
        nombre: nombre.trim(),
        descripcion: descripcion || '',
        categoria: categoria || 'Insumo',
        unidadMedida: unidadMedida || 'UND',
        stockActual: parseFloat(stockActual) || 0,
        stockMinimo: parseFloat(stockMinimo) || 5,
        precioReferencia: parseFloat(precioReferencia) || 0,
        ubicacion: ubicacion || 'Almacén Principal',
      },
    });

    // Registrar movimiento inicial si stock > 0
    if (nuevo.stockActual > 0) {
      await prisma.movimientoAlmacen.create({
        data: {
          tipo: 'ENTRADA',
          articuloId: nuevo.id,
          cantidad: nuevo.stockActual,
          stockAnterior: 0,
          stockNuevo: nuevo.stockActual,
          motivo: 'Inventario Inicial',
          responsable: 'William (Logística)',
          documentoRef: 'INICIAL',
        },
      });
    }

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
