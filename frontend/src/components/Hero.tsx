export default function Hero() {
  return (
    <section className="text-center py-28 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-200">

      <h2 className="text-5xl font-extrabold text-blue-800">
        Panel Administrativo ICEPAL
      </h2>

      <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
        Sistema diseñado para la gestión integral de laboratorios,
        control de personal auxiliar y supervisión del estado de equipos tecnológicos.
      </p>

      <p className="mt-4 text-gray-500 max-w-xl mx-auto">
        Administra usuarios, controla asistencia en tiempo real y recibe reportes automáticos
        de incidencias en los equipos.
      </p>
      
      {/* BOTONES */}
      <div className="mt-10 flex justify-center gap-6">
        <button className="border border-blue-600 text-blue-700 px-8 py-3 rounded-xl hover:bg-blue-100 transition cursor-pointer">
          Ver funcionalidades
        </button>

      </div>

    </section>
  )
}