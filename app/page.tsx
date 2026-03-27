import { db } from '@/lib/db';
import Link from 'next/link';

// Force Next.js à récupérer les nouveaux produits de Neon sans cache
export const revalidate = 0;

export default async function Home() {
  const { data: products, error } = await db.getAllProducts();

  if (error) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-red-500 font-bold">Erreur de connexion à Neon</h1>
        <p className="text-gray-500">Vérifie ton DATABASE_URL dans .env.local</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-12">
        {/* Titre style Roadz */}
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black mb-12">
          Let's Roadz
        </h2>

        {/* Grille avec espacement large (gap-x-12 et gap-y-16) comme sur ta photo */}
        <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-16 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product: any) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col">
              
              {/* IMAGE CARRÉE (aspect-square) */}
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 group-hover:opacity-85 transition-opacity">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                />
              </div>

              {/* TEXTE CENTRÉ ET BIEN ESPACÉ */}
              <div className="mt-6 text-center">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
                  {product.name}
                </h3>
                {/* Petit trait ou catégorie comme sur ton image */}
                <p className="mt-1 text-xs text-zinc-400 uppercase tracking-widest">
                  {product.category.split(',')[0]} {/* Affiche seulement la 1ère catégorie */}
                </p>
                <p className="mt-2 text-base font-black text-black">
                  {product.price} DA
                </p>
              </div>

            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}