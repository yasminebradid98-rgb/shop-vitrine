"use client";
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import citiesData from '@/data/algeria_cities.json';
import agenciesData from '@/data/yalidine_agencies.json';

const colorMapping: { [key: string]: string } = {
  "Aubergine": "#4a0404", "Beige Clair": "#cfbeae", "Beige Foncé": "#c4a377",
  "Blanc": "#ffffff", "Bleu Ciel": "#84c2d7", "Bleu Nuit": "#0b0837",
  "Bleu Roi Foncé": "#211d96", "Bleu Vert": "#33bcbc", "Gris Clair": "#cfc9c9",
  "Gris Foncé": "#828282", "Jaune Moutarde": "#dd9d21", "Marron": "#4e2e21",
  "Noir": "#000000", "Rose Clair": "#d2afb1", "Rose Fuchsia": "#e5004f",
  "Rouge": "#b71e1e", "Saumon": "#ea9c73", "Vert Bouteille": "#0e331a",
  "Vert Kaki": "#2b5442", "Vert Passport": "#6c5c3b", "Violet": "#4c2f72"
};

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. AJOUT DE L'ÉTAT POUR L'IMAGE DYNAMIQUE
  const [displayImage, setDisplayImage] = useState<string>('');

  const [formData, setFormData] = useState({ 
    name: '', phone: '', address: '', wilaya: '', deliveryType: 'Domicile' 
  });

  const uniqueWilayas = Array.from(new Set(citiesData.map((item: any) => item.wilaya_name_ascii))).sort();
  
  const filteredAgencies = agenciesData.filter((a: any) => 
    a.Wilaya?.trim().toLowerCase() === formData.wilaya?.trim().toLowerCase()
  );

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) {
        console.error("Erreur Supabase:", error);
      } else {
        console.log("Produit chargé:", data);
        setProduct(data);
        setDisplayImage(data.image_url); // Image initiale
      }
    }
    if (id) fetchProduct();
  }, [id]);

  // 2. FONCTION DE CHANGEMENT DE COULEUR AMÉLIORÉE
  const handleColorSelection = (color: string) => {
    console.log("Couleur cliquée:", color);
    setSelectedColor(color);

    if (product?.images_json && product.images_json[color]) {
      console.log("Image trouvée pour cette couleur:", product.images_json[color]);
      setDisplayImage(product.images_json[color]);
    } else {
      console.warn("Aucune image spécifique dans images_json pour:", color);
      setDisplayImage(product?.image_url);
    }
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('orders').insert([{
      product_name: product.name,
      color: selectedColor,
      size: selectedSize,
      customer_name: formData.name,
      phone: formData.phone,
      address: formData.address,
      wilaya: formData.wilaya,
      delivery_type: formData.deliveryType
    }]);

    if (error) {
      alert("Erreur lors de la commande : " + error.message);
    } else {
      alert("Commande validée avec succès !");
      setIsModalOpen(false);
    }
  };

  if (!product) return <div className="p-20 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-inner">
          {/* 3. UTILISATION DE L'IMAGE DYNAMIQUE ICI */}
          <img 
            src={displayImage || product.image_url} 
            alt={product.name} 
            className="w-full h-auto object-cover transition-all duration-300" 
          />
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold">{product.price} DA</p>

          <div>
            <h3 className="text-sm font-medium mb-3">Couleur</h3>
            <div className="grid grid-cols-5 gap-3 max-w-[280px]">
              {product.colors?.map((color: string) => (
                <button 
                  key={color} 
                  // 4. ON APPELLE LA FONCTION DE SELECTION ICI
                  onClick={() => handleColorSelection(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform ${selectedColor === color ? 'border-black ring-2 ring-offset-2 ring-black scale-110' : 'border-gray-200 hover:scale-105'}`}
                  style={{ backgroundColor: colorMapping[color] || "#ccc" }} 
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Taille</h3>
            <div className="flex gap-3">
              {product.sizes?.map((size: string) => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 border-2 rounded-xl font-bold ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setIsModalOpen(true)} disabled={!selectedColor || !selectedSize}
            className={`w-full py-4 rounded-xl font-bold text-lg ${!selectedColor || !selectedSize ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:opacity-90'}`}>
            Commander
          </button>
        </div>
      </div>

      {/* MODAL (Inchangé pour garder tes options) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={submitOrder} className="bg-white p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold">Confirmer la commande</h2>
            <input required placeholder="Nom et Prénom" className="border p-3 rounded-lg" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input required type="tel" placeholder="Téléphone" className="border p-3 rounded-lg" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            
            <select required className="border p-3 rounded-lg" onChange={(e) => setFormData({...formData, wilaya: e.target.value, address: ''})}>
              <option value="">Sélectionnez votre Wilaya</option>
              {uniqueWilayas.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>

            <div className="flex gap-6 p-2 text-sm font-medium">
              <label className="flex items-center gap-2">
                <input type="radio" name="del" value="Domicile" checked={formData.deliveryType === 'Domicile'} onChange={(e) => setFormData({...formData, deliveryType: e.target.value, address: ''})} /> Domicile
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="del" value="Stop Desk" checked={formData.deliveryType === 'Stop Desk'} onChange={(e) => setFormData({...formData, deliveryType: e.target.value, address: ''})} /> Stop Desk
              </label>
            </div>

            {formData.deliveryType === 'Stop Desk' ? (
              <select required className="border p-3 rounded-lg" onChange={(e) => setFormData({...formData, address: e.target.value})}>
                <option value="">{filteredAgencies.length > 0 ? "Sélectionnez votre agence" : "Aucune agence trouvée"}</option>
                {filteredAgencies.map((a: any, index: number) => (
                  <option key={index} value={`${a.Nom} - ${a.Adresse}`}>{a.Nom}</option>
                ))}
              </select>
            ) : (
              <textarea required placeholder="Votre adresse complète" className="border p-3 rounded-lg" onChange={(e) => setFormData({...formData, address: e.target.value})} />
            )}
            
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-3 border rounded-lg">Annuler</button>
              <button type="submit" className="flex-1 p-3 bg-black text-white rounded-lg">Valider</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}