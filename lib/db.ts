import { neon } from '@neondatabase/serverless';

// On essaie de récupérer l'une ou l'autre selon si on est sur le serveur ou le client
const databaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

if (!databaseUrl) {
  // Ce message ne devrait plus apparaître si ton .env.local est bien rempli
  console.error("DATABASE_URL is missing! Check your .env.local file.");
}



const sql = neon(databaseUrl!);

interface Database {
  getProductById: (id: string) => Promise<{ data: any; error: any }>;
  getAllProducts: () => Promise<{ data: any[]; error: any }>;
  insertOrder: (orderData: any) => Promise<{ error: any }>;
}


export const db: Database = {
  // 1. Récupérer un seul produit (utilisé dans product/[id]/page.tsx)
  getProductById: async (id: string) => {
    try {
      const result = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;
      return { data: result[0] || null, error: null };
    } catch (err) {
      console.error("Erreur Neon getProductById:", err);
      return { data: null, error: err };
    }
  },

  // 2. Récupérer tous les produits (utilisé dans app/page.tsx)
  getAllProducts: async () => {
    try {
      const result = await sql`SELECT * FROM products ORDER BY name ASC`;
      return { data: result, error: null };
    } catch (err) {
      console.error("Erreur Neon getAllProducts:", err);
      return { data: [], error: err };
    }
  },

  // 3. Insérer une nouvelle commande (utilisé dans OrderModal.tsx)
  insertOrder: async (orderData: any) => {
    try {
      await sql`
        INSERT INTO orders (
          product_name, 
          color, 
          size, 
          customer_name, 
          phone, 
          address, 
          wilaya, 
          delivery_type
        ) VALUES (
          ${orderData.product_name}, 
          ${orderData.color}, 
          ${orderData.size}, 
          ${orderData.customer_name}, 
          ${orderData.phone}, 
          ${orderData.address}, 
          ${orderData.wilaya}, 
          ${orderData.delivery_type}
        )
      `;
      return { error: null };
    } catch (err) {
      console.error("Erreur Neon insertOrder:", err);
      return { error: err };
    }
  }
};