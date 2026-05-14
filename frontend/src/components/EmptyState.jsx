export default function EmptyState({ icono, titulo, descripcion, textoBoton, onClickBoton, colorBoton = "bg-blue-600 hover:bg-blue-700 text-white" }) {
    return (
        <div className="flex flex-col items-center justify-center bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center mt-4 w-full">
            <span className="text-6xl mb-4 block">{icono}</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{titulo}</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {descripcion}
            </p>
            {textoBoton && onClickBoton && (
                <button 
                    onClick={onClickBoton} 
                    className={`${colorBoton} px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 mx-auto`}
                >
                    {textoBoton}
                </button>
            )}
        </div>
    );
}
