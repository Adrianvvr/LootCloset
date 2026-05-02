export default function Loader({ mensaje = "Cargando..." }) {
    return (
        <div className="flex-grow flex items-center justify-center text-xl font-semibold text-gray-600 p-8 text-center animate-pulse w-full">
            {mensaje} ⏳
        </div>
    );
}