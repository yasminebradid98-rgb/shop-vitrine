import { db } from '@/lib/db';
import { ProductCard } from '@/components/productcard';

export const revalidate = 0;

export default async function Home() {
  const { data: products, error } = await db.getAllProducts();

  if (error) return <div>Erreur Neon...</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-16 text-center">
          Roadz Gallery
        </h2>

        {/* La grille espacée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-12 gap-y-20">
          {products?.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              price={product.price}
              imageUrl={product.image_url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}