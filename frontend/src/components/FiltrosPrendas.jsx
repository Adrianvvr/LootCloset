import { useState } from 'react';

const CATEGORIAS = [
    'Camiseta', 'Vestido', 'Sudadera', 'Chaqueta', 'Abrigo',
    'Pantalón', 'Falda', 'Zapatos', 'Zapatillas', 'Accesorios', 'Ropa Interior',
];

const ORDENACIONES = [
    { value: '',            label: 'Por defecto' },
    { value: 'usos_desc',   label: 'Más usadas' },
    { value: 'usos_asc',    label: 'Menos usadas' },
    { value: 'precio_desc', label: 'Mayor precio' },
    { value: 'precio_asc',  label: 'Menor precio' },
    { value: 'reciente',    label: 'Más recientes' },
];

export default function FiltrosPrendas({ filtros, onChange, marcas, totalPrendas, totalFiltradas }) {
    const [abierto, setAbierto] = useState(false);

    const hayFiltrosActivos =
        filtros.busqueda || filtros.categoria || filtros.marca || filtros.estado || filtros.orden;

    const limpiarFiltros = () =>
        onChange({ busqueda: '', categoria: '', marca: '', estado: '', orden: '' });

    return (
        <div className="mb-6">
            {/* Barra principal */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Buscador */}
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                    <input
                        id="filtro-busqueda"
                        type="text"
                        placeholder="Buscar por categoría, marca o color..."
                        value={filtros.busqueda}
                        onChange={e => onChange({ ...filtros, busqueda: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    />
                </div>

                {/* Botón mostrar/ocultar filtros */}
                <button
                    id="btn-toggle-filtros"
                    onClick={() => setAbierto(!abierto)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium shadow-sm transition-colors whitespace-nowrap
                        ${abierto || hayFiltrosActivos
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                    Filtros
                    {hayFiltrosActivos && (
                        <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {[filtros.categoria, filtros.marca, filtros.estado, filtros.orden].filter(Boolean).length}
                        </span>
                    )}
                </button>
            </div>

            {/* Panel de filtros expandible */}
            {abierto && (
                <div className="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Categoría */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Categoría
                        </label>
                        <select
                            id="filtro-categoria"
                            value={filtros.categoria}
                            onChange={e => onChange({ ...filtros, categoria: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Todas</option>
                            {CATEGORIAS.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Marca */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Marca
                        </label>
                        <select
                            id="filtro-marca"
                            value={filtros.marca}
                            onChange={e => onChange({ ...filtros, marca: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Todas</option>
                            {marcas.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Estado
                        </label>
                        <select
                            id="filtro-estado"
                            value={filtros.estado}
                            onChange={e => onChange({ ...filtros, estado: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Todas</option>
                            <option value="limpia">✅ Limpia</option>
                            <option value="sucia">🧺 Sucia</option>
                        </select>
                    </div>

                    {/* Ordenar */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Ordenar por
                        </label>
                        <select
                            id="filtro-orden"
                            value={filtros.orden}
                            onChange={e => onChange({ ...filtros, orden: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {ORDENACIONES.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Resultado + botón limpiar */}
            <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-gray-500">
                    Mostrando <span className="font-semibold text-gray-800">{totalFiltradas}</span> de{' '}
                    <span className="font-semibold text-gray-800">{totalPrendas}</span> prendas
                </p>
                {hayFiltrosActivos && (
                    <button
                        id="btn-limpiar-filtros"
                        onClick={limpiarFiltros}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Limpiar filtros
                    </button>
                )}
            </div>
        </div>
    );
}
