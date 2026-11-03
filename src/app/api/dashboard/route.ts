import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalArticulos = await prisma.articulo.count();
    const articulos = await prisma.articulo.findMany();
    const articulosBajoStock = articulos.filter((a) => a.stockActual <= a.stockMinimo);
    const totalProveedores = await prisma.proveedor.count();
    const totalOrdenes = await prisma.ordenCompra.count();
    const ordenesPendientes = await prisma.ordenCompra.count({
      where: { estado: 'PENDIENTE' },
    });

    const ultimosMovimientos = await prisma.movimientoAlmacen.findMany({
      take: 6,
      orderBy: { fecha: 'desc' },
      include: {
        articulo: true,
      },
    });

    const valorEstimadoInventario = articulos.reduce(
      (acc, cur) => acc + cur.stockActual * (cur.precioReferencia || 0),
      0
    );

    return NextResponse.json({
      totalArticulos,
      articulosBajoStockCount: articulosBajoStock.length,
      articulosBajoStock,
      totalProveedores,
      totalOrdenes,
      ordenesPendientes,
      valorEstimadoInventario,
      ultimosMovimientos,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
