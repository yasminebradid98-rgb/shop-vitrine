import { db } from '@/lib/db';
import Link from 'next/link';
export const revalidate = 0; // Cela désactive le cache pour cette page
export default async function Home() {
  // Récupération des produits depuis Neon
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
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Let's Roadz</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products?.map((product: any) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="h-full w-full object-cover object-center" 
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price} DA</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}