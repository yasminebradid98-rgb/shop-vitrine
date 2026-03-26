"use client";
import { useState } from 'react';
import { db } from '@/lib/db'; // REMPLACE supabase par db
import citiesData from '@/data/algeria_cities.json';
import agenciesData from '@/data/yalidine_agencies.json';


export default function OrderModal({ product, selectedColor, selectedSize, selectedCategory, onClose }: any) {

  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', wilaya: '', deliveryType: 'Domicile'
  });

  const uniqueWilayas = Array.from(new Set(citiesData.map((item: any) => item.wilaya_name_ascii))).sort();
  const filteredAgencies = agenciesData.filter((a: any) =>
    a.Wilaya?.trim().toLowerCase() === formData.wilaya?.trim().toLowerCase()
  );

const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // On utilise une nouvelle fonction qu'on va ajouter à lib/db.ts
    const { error } = await db.insertOrder({
      product_name: product.name,
      color: selectedColor,
      size: selectedSize,
      customer_name: formData.name,
      phone: formData.phone,
      address: formData.address,
      wilaya: formData.wilaya,
      delivery_type: formData.deliveryType
    });

    if (error) {
      alert("Erreur lors de la commande.");
    } else {
      alert("Commande validée avec succès !");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form onSubmit={submitOrder} className="bg-white p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-bold">Confirm Order</h2>
        <input required placeholder="Name" className="border p-3 rounded-lg" onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <input required type="tel" placeholder="Phone Number" className="border p-3 rounded-lg" onChange={(e) => setFormData({...formData, phone: e.target.value})} />

        <select required className="border p-3 rounded-lg" onChange={(e) => setFormData({...formData, wilaya: e.target.value, address: ''})}>
          <option value="">Select Wilaya</option>
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
          <button type="button" onClick={onClose} className="flex-1 p-3 border rounded-lg">Cancel</button>
          <button type="submit" className="flex-1 p-3 bg-black text-white rounded-lg">Validate</button>
        </div>
      </form>
    </div>
  );
}