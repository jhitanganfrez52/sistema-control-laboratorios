export default function Features() {
  return (
    <section className="py-24 bg-white">

      <h2 className="text-3xl font-bold text-center text-blue-700">
        Funciones del Administrador
      </h2>

      <div className="grid md:grid-cols-3 gap-10 mt-14 px-14">

        {/* CARD */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="font-bold text-lg text-blue-700">
            Gestión de Auxiliares
          </h3>
          <p className="text-gray-600 mt-2">
            Crear, activar o desactivar auxiliares y controlar su periodo de contrato.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="font-bold text-lg text-blue-700">
            Supervisión en Tiempo Real
          </h3>
          <p className="text-gray-600 mt-2">
            Visualiza la asistencia de auxiliares mediante registro de huella digital.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="font-bold text-lg text-blue-700">
            Control de Equipos
          </h3>
          <p className="text-gray-600 mt-2">
            Monitorea el estado de los equipos y recibe reportes automáticos de fallas.
          </p>
        </div>

      </div>

    </section>
  )
}