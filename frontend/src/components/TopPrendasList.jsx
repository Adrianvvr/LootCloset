export default function TopPrendasList({ titulo, icono, colorTexto, prendas }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className={`text-xl font-bold ${colorTexto} mb-4 flex items-center gap-2`}>
        {icono} {titulo}
      </h2>
      <ul className="space-y-4">
        {prendas.length === 0 && (
          <p className="text-gray-500 text-sm">No hay prendas con precio registrado.</p>
        )}
        {prendas.map((prenda, index) => (
          <li key={prenda.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-400 w-4">{index + 1}</span>
              {prenda.foto_url ? (
                <img 
                  src={`http://localhost:8000${prenda.foto_url}`} 
                  alt={prenda.categoria} 
                  className="w-12 h-12 object-cover rounded-md shadow-sm" 
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-[10px] text-gray-500">
                  Sin foto
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-700 capitalize">{prenda.categoria}</p>
                <p className="text-xs text-gray-500">Usos: {prenda.contador_usos}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${colorTexto}`}>{prenda.coste_por_uso} €</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">por uso</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}