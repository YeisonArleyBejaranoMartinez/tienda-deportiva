const MESSAGES = [
  "Venta de Temporada",
  "Envío Gratis en compras +$200.000",
  "Nuevos Productos",
];

export const TopBar = () => {
  return (
    <div className="bg-[#C45C1A] text-white text-xs sm:text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-3 sm:gap-6">
        {MESSAGES.map((msg, i) => (
          <span key={msg} className="flex items-center gap-3 sm:gap-6">
            {i > 0 && <span className="text-white/50 select-none">|</span>}
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};
