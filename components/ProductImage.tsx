export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group relative aspect-[4/5] w-full bg-gray-50 rounded-2xl overflow-hidden shadow-inner border border-zinc-100">
      {/* Badge "Nouveau" ou "Roadz Original" en option */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">
          Original
        </span>
      </div>

      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-110" 
      />

      {/* Overlay subtil au survol pour faire ressortir le design */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}