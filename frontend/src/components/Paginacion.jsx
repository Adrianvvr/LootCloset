const RANGO_VISIBLE = 2; // páginas a cada lado de la actual

export default function Paginacion({ paginaActual, totalPaginas, onChange }) {
    if (totalPaginas <= 1) return null;

    // Genera el array de páginas a mostrar con "..." donde corresponda
    const generarPaginas = () => {
        const paginas = [];
        const inicio = Math.max(1, paginaActual - RANGO_VISIBLE);
        const fin    = Math.min(totalPaginas, paginaActual + RANGO_VISIBLE);

        if (inicio > 1) {
            paginas.push(1);
            if (inicio > 2) paginas.push('...');
        }

        for (let i = inicio; i <= fin; i++) paginas.push(i);

        if (fin < totalPaginas) {
            if (fin < totalPaginas - 1) paginas.push('...');
            paginas.push(totalPaginas);
        }

        return paginas;
    };

    const paginas = generarPaginas();

    const btnBase =
        'flex items-center justify-center h-9 min-w-[2.25rem] px-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1';
    const btnActivo   = 'bg-blue-600 text-white shadow-sm';
    const btnInactivo = 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600';
    const btnDisabled = 'bg-white text-gray-300 border border-gray-100 cursor-not-allowed';

    return (
        <nav
            aria-label="Paginación"
            className="flex items-center justify-center gap-1 mt-10 flex-wrap"
        >
            {/* Anterior */}
            <button
                id="btn-pagina-anterior"
                onClick={() => onChange(paginaActual - 1)}
                disabled={paginaActual === 1}
                className={`${btnBase} ${paginaActual === 1 ? btnDisabled : btnInactivo} gap-1 px-3`}
                aria-label="Página anterior"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Números */}
            {paginas.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-gray-400 select-none">…</span>
                ) : (
                    <button
                        key={p}
                        id={`btn-pagina-${p}`}
                        onClick={() => onChange(p)}
                        className={`${btnBase} ${p === paginaActual ? btnActivo : btnInactivo}`}
                        aria-current={p === paginaActual ? 'page' : undefined}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Siguiente */}
            <button
                id="btn-pagina-siguiente"
                onClick={() => onChange(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className={`${btnBase} ${paginaActual === totalPaginas ? btnDisabled : btnInactivo} gap-1 px-3`}
                aria-label="Página siguiente"
            >
                <span className="hidden sm:inline">Siguiente</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </nav>
    );
}
