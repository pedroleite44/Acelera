import './globals.css'; // ESTA LINHA TRAZ AS CORES E O TAILWIND
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Acelera Pré-Escola',
  description: 'Sistema de Gestão Pedagógica Inteligente',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
