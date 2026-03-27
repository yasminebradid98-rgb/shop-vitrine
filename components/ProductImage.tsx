
export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    
    <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-inner">
      <img src={src} alt={alt} className="w-full h-auto object-cover transition-all duration-300" />
    </div>
  );
}