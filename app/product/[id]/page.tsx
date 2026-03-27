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
const hoodieColors = ["Blanc", "Gris Clair", "Bleu Ciel", "Bleu Nuit", "Jaune", "Gris Foncé", "Orange", "Rouge", "Vert Roadz", "Violet"];
const sweaterColors = ["Blanc", "Bleu Nuit", "Beige Clair", "Gris Clair", "Marron", "Noir", "Vert Passport"];
const tshirtColors = ["Noir", "Blanc", "Rouge", "Marron", "Saumon", "Violet", "Aubergine", "Bleu Ciel", "Bleu Nuit", "Bleu Vert", "Vert Kaki", "Gris Clair", "Rose Clair", "Beige Clair", "Gris Foncé", "Beige Foncé", "Rose Fuchsia", "Vert Passport", "Jaune Moutarde", "Vert Bouteille", "Bleu Roi Foncé"];

useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await db.getProductById(id);
      
      if (data) { 
        const colors = typeof data.colors === 'string' ? JSON.parse(data.colors) : data.colors;
        const sizes = typeof data.sizes === 'string' ? JSON.parse(data.sizes) : data.sizes;
        const images_json = typeof data.images_json === 'string' ? JSON.parse(data.images_json) : data.images_json;

        const currentProduct = { ...data, colors, sizes, images_json };
        setProduct(currentProduct); 
        
        // --- LOGIQUE MODIFIÉE ICI ---
        if (colors && colors.length > 0) {
          const firstColor = colors[0]; // "Noir" par exemple
          setSelectedColor(firstColor);
          
          // Au lieu de data.image_url, on cherche l'image de la première couleur
          const firstImage = images_json[firstColor] || data.image_url;
          setDisplayImage(firstImage);
        } else {
          setDisplayImage(data.image_url); 
        }
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

  // PRIORITÉ : 
  // 1. La clé exacte (ex: Blanc_h)
  // 2. Si c'est un tshirt, la couleur simple (ex: Noir)
  // 3. Sinon, on ne change rien ou on met une image vide pour éviter le bug
  const newUrl = images[key] || (category === "tshirt" ? images[color] : null) || currentProduct.image_url;
  
  setDisplayImage(newUrl);
};

  const handleColorSelection = (color: string) => {
    setSelectedColor(color);
    updateDisplayImage(color, selectedCategory, product);
  };

const handleCategorySelection = (cat: 'tshirt' | 'hoodie' | 'sweater') => {
  setSelectedCategory(cat);

  const allColors = product.colors || [];
  let nextColor = "";

  // 1. On définit la couleur par défaut selon le bouton cliqué
  if (cat === 'hoodie') {
    nextColor = "Blanc"; // Force le Blanc pour le Hoodie
  } else if (cat === 'sweater') {
    nextColor = "Blanc"; // Force le Blanc pour le Sweater
  } else {
    nextColor = "Noir";  // Force le Noir pour le T-shirt
  }

  // 2. On met à jour l'état de la couleur
  setSelectedColor(nextColor);

  // 3. On force la mise à jour de l'image IMMÉDIATEMENT
  updateDisplayImage(nextColor, cat, product);
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