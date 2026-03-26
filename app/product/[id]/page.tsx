"use client";
import { useEffect, useState, use } from 'react';
import { db } from '@/lib/db';
import ProductImage from '@/components/ProductImage';
import ProductSelectors from '@/components/ProductSelectors';
import OrderModal from '@/components/OrderModal';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'tshirt' | 'hoodie' | 'sweater'>('tshirt');
  const [displayImage, setDisplayImage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configuration des listes de couleurs (doit être identique à ProductSelectors)
  const hoodieColors = ["Blanc", "Gris Clair", "Noir", "Beige Clair"];
  const sweaterColors = ["Blanc", "Bleu Nuit", "Beige Clair", "Gris Clair", "Marron", "Noir", "Vert Passport"];

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await db.getProductById(id);
      
      if (data) { 
        // Parsing sécurisé des données JSON de Neon
        const colors = typeof data.colors === 'string' ? JSON.parse(data.colors) : data.colors;
        const sizes = typeof data.sizes === 'string' ? JSON.parse(data.sizes) : data.sizes;
        const images_json = typeof data.images_json === 'string' ? JSON.parse(data.images_json) : data.images_json;

        setProduct({ ...data, colors, sizes, images_json }); 
        
        setDisplayImage(data.image_url); 
        
        if (colors && colors.length > 0) setSelectedColor(colors[0]);
      } else if (error) {
        console.error("Erreur de récupération Neon:", error);
      }
    }
    
    if (id) fetchProduct();
  }, [id]);

  // Fonction pour changer l'image selon la couleur ET la catégorie
  const updateDisplayImage = (color: string, category: string, currentProduct: any) => {
    const images = currentProduct?.images_json;
    if (!images) return;

    let suffix = category === "hoodie" ? "_h" : category === "sweater" ? "_s" : "";
    const key = `${color}${suffix}`;

    // On cherche la clé spécifique (ex: Noir_s), sinon la couleur simple, sinon l'image par défaut
    const newUrl = images[key] || images[color] || currentProduct.image_url;
    console.log("--- DEBUG ROADZ ---");
console.log("Clé cherchée :", key);
console.log("Contenu de images_json :", images);
console.log("URL trouvée :", images[key]);
    setDisplayImage(newUrl);
  };

  const handleColorSelection = (color: string) => {
    setSelectedColor(color);
    updateDisplayImage(color, selectedCategory, product);
  };

  const handleCategorySelection = (cat: 'tshirt' | 'hoodie' | 'sweater') => {
    setSelectedCategory(cat);

    const allColors = product.colors || [];
    let available: string[] = [];

    // Filtrage identique à l'affichage
    if (cat === 'hoodie') {
      available = allColors.filter((c: string) => hoodieColors.includes(c));
    } else if (cat === 'sweater') {
      available = allColors.filter((c: string) => sweaterColors.includes(c));
    } else {
      available = allColors;
    }

    if (available.length > 0) {
      const nextColor = available[0];
      setSelectedColor(nextColor);
      // On force la mise à jour immédiate de l'image avec la nouvelle catégorie
      updateDisplayImage(nextColor, cat, product);
    }
  };

  if (!product) return <div className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest">Chargement Roadz...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
        
        {/* Colonne Gauche : Image */}
        <div className="sticky top-24">
          <ProductImage src={displayImage} alt={product.name} />
        </div>
        
        {/* Colonne Droite : Sélecteurs */}
        <div className="flex flex-col gap-2">
          <div className="mb-4">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black">{product.name}</h1>
            <p className="text-xl font-bold text-zinc-500">{product.price} DZD</p>
          </div>

          <ProductSelectors 
            product={product} 
            selectedColor={selectedColor} 
            selectedSize={selectedSize}
            selectedCategory={selectedCategory}
            onColorSelect={handleColorSelection}
            onSizeSelect={setSelectedSize}
            onCategorySelect={handleCategorySelection}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
      </div>
      
      {/* Modal de commande */}
      {isModalOpen && (
        <OrderModal 
          product={product} 
          selectedColor={selectedColor} 
          selectedSize={selectedSize} 
          selectedCategory={selectedCategory}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}