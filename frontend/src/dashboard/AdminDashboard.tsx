export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Panel de Administrador
      </h1>

      {/* tarjetas superiores */}

      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Equipos Activos</p>
          <h2 className="text-2xl font-bold">24</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">En Mantenimiento</p>
          <h2 className="text-2xl font-bold">3</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Fuera de Servicio</p>
          <h2 className="text-2xl font-bold">2</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Periféricos</p>
          <h2 className="text-2xl font-bold">15</h2>
        </div>

      </div>

    </div>
  )
}