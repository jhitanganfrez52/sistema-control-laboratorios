export default function AuxDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Panel Auxiliar
      </h1>

      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Mis Tareas de Hoy</p>
          <h2 className="text-2xl font-bold">5</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Equipos Asignados</p>
          <h2 className="text-2xl font-bold">12</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Reportes Pendientes</p>
          <h2 className="text-2xl font-bold">1</h2>
        </div>

      </div>

    </div>
  )
}