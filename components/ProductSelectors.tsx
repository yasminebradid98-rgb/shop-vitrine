"use client";

const colorMapping: { [key: string]: string } = {
  "Aubergine": "#4a0404", "Beige Clair": "#cfbeae", "Beige Foncé": "#c4a377",
  "Blanc": "#ffffff", "Bleu Ciel": "#84c2d7", "Bleu Nuit": "#0b0837",
  "Bleu Roi Foncé": "#211d96", "Bleu Vert": "#33bcbc", "Gris Clair": "#cfc9c9",
  "Gris Foncé": "#555555", "Jaune Moutarde": "#dd9d21", "Marron": "#4e2e21",
  "Noir": "#000000", "Orange": "#ff6700", "Rose Clair": "#d2afb1", 
  "Rose Fuchsia": "#e5004f", "Rouge": "#b71e1e", "Saumon": "#ea9c73", 
  "Vert Bouteille": "#0e331a", "Vert Kaki": "#6c5c3b", "Vert Passport": "#0e331a", 
  "Violet": "#4c2f72" ,"Jaune":"#ebd531ff" ,"Vert Roadz": "#063a2cff",
};

export default function ProductSelectors({ 
  product, selectedColor, selectedSize, selectedCategory, 
  onColorSelect, onSizeSelect, onCategorySelect, onOpenModal 
}: any) {

  // Listes de référence mises à jour avec tes nouveaux liens Drive
// J'ai harmonisé les noms pour qu'ils matchent EXACTEMENT ton SQL et ton colorMapping
  const hoodieList = [
    "Blanc", "Gris Clair", "Bleu Ciel", 
    "Bleu Nuit", "Jaune", "Gris Foncé", "Orange", 
    "Rouge", "Vert Roadz", "Violet"
  ];
  
  const sweaterList = ["Blanc", "Bleu Nuit", "Beige Clair", "Gris Clair", "Marron", "Noir", "Vert Passport"];

  // LOGIQUE DE FILTRAGE
  let finalColors = [];
  const dbColors = product.colors || [];

  if (selectedCategory === 'hoodie') {
    finalColors = dbColors.filter((c: string) => hoodieList.includes(c));
  } else if (selectedCategory === 'sweater') {
    finalColors = dbColors.filter((c: string) => sweaterList.includes(c));
  } else {
    finalColors = dbColors; 
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* BOUTONS DE CATÉGORIE */}
      <div>
        <h3 className="text-sm font-bold mb-3 uppercase text-gray-400">Modèle</h3>
        <div className="flex flex-wrap gap-2">
          {['tshirt', 'hoodie', 'sweater'].map((cat) => (
            <button 
              key={cat} 
              onClick={() => onCategorySelect(cat)} 
              className={`px-4 py-2 border-2 rounded-lg text-sm uppercase font-bold transition-all 
              ${selectedCategory === cat ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SÉLECTEUR DE COULEUR */}
      <div>
        <h3 className="text-sm font-bold mb-3 uppercase text-gray-400">
          Couleur {selectedColor ? <span className="text-black ml-2">— {selectedColor}</span> : ""}
        </h3>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
          {finalColors.map((color: string) => (
            <button 
              key={`${selectedCategory}-${color}`} 
              onClick={() => onColorSelect(color)}
              className={`w-9 h-9 rounded-full border-2 transition-all
              ${selectedColor === color ? 'border-black ring-2 ring-black ring-offset-2 scale-110' : 'border-gray-200'}`}
              style={{ backgroundColor: colorMapping[color] || "#ccc" }} 
              title={color}
            />
          ))}
        </div>
      </div>

      {/* TAILLE */}
      <div>
        <h3 className="text-sm font-bold mb-3 uppercase text-gray-400">Taille</h3>
        <div className="flex flex-wrap gap-2">
          {product.sizes?.map((size: string) => (
            <button key={size} onClick={() => onSizeSelect(size)}
              className={`w-12 h-12 border-2 rounded-xl font-bold transition-all
              ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-500'}`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      <button onClick={onOpenModal} disabled={!selectedColor || !selectedSize}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all
        ${!selectedColor || !selectedSize ? 'bg-gray-100 text-gray-400' : 'bg-black text-white shadow-lg'}`}>
        Order Now
      </button>
    </div>
  );
}