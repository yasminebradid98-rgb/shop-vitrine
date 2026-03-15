"use client"
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Checkout() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from('orders').insert([{
      product_name: "Commande Article #" + searchParams.get('id'),
      details: `Taille: ${searchParams.get('size')}, Couleur: ${searchParams.get('color')}`,
      customer_name: formData.get('name'),
      phone: formData.get('phone'),
      wilaya: formData.get('wilaya'),
      commune: formData.get('commune'),
      delivery_type: formData.get('delivery')
    }]);

    if (!error) router.push('/success');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Vos Informations</h2>
      <input name="name" placeholder="Nom et Prénom" required className="w-full border p-2 rounded" />
      <input name="phone" placeholder="Numéro de téléphone" required className="w-full border p-2 rounded" />
      <input name="wilaya" placeholder="Wilaya" required className="w-full border p-2 rounded" />
      <input name="commune" placeholder="Commune" required className="w-full border p-2 rounded" />
      
      <div className="flex justify-between p-2 bg-gray-50 rounded">
        <label><input type="radio" name="delivery" value="domicile" required /> À domicile</label>
        <label><input type="radio" name="delivery" value="stopdesk" /> Stopdesk (Bureau)</label>
      </div>

      <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded font-bold">
        Confirmer la commande
      </button>
    </form>
  );
}