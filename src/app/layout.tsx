import type { Metadata } from 'next';
import './globals.css';
import TopNavbar from '@/components/TopNavbar';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'ERP Asepsis - Logística (DEV)',
  description: 'Módulo de Logística: Rutas y Unidades - Entorno local de desarrollo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans antialiased">
        <TopNavbar />
        <div className="flex-1 flex min-h-[calc(100vh-3.5rem)]">
          <Sidebar />
          <main className="flex-1 min-w-0 bg-[#080d1a] overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
