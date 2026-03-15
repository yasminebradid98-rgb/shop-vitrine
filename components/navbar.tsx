export default function Navbar() {
  return (
    <nav className="bg-[#1a3a3a] text-white p-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Remplace par ton fichier logo.png dans le dossier public */}
        <img src="/LOGO.png" alt="Roadz Logo" className="h-12 w-auto" />
        <div className="text-sm font-light">Adventure & City Lifestyle</div>
      </div>
    </nav>
  );
}