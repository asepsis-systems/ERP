import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { razonSocial: { contains: search } },
        { ruc: { contains: search } },
        { contacto: { contains: search } },
      ];
    }

    const proveedores = await prisma.proveedor.findMany({
      where,
      orderBy: { razonSocial: 'asc' },
      include: {
        _count: {
          select: { ordenes: true },
        },
      },
    });

    return NextResponse.json(proveedores);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ruc, razonSocial, contacto, telefono, email, direccion, condicionPago } = body;

    if (!ruc || !razonSocial) {
      return NextResponse.json(
        { error: 'RUC y Razón Social son requeridos' },
        { status: 400 }
      );
    }

    const nuevo = await prisma.proveedor.create({
      data: {
        ruc: ruc.trim(),
        razonSocial: razonSocial.trim(),
        contacto: contacto || '',
        telefono: telefono || '',
        email: email || '',
        direccion: direccion || '',
        condicionPago: condicionPago || 'Contado',
      },
    });

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
