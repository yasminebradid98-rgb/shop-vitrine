import Navbar from '@/components/navbar'; // Importation du composant

import './globals.css'; // Vérifie que ce fichier contient bien les directives @tailwind

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Navbar />         {/* Ta barre sera tout en haut ici */}
        <main>{children}</main>
      </body>
    </html>
  );
}