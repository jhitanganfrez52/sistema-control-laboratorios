import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  AlertTriangle,
  Repeat,
  FileText,
  Menu,
  Bell,
  Moon,
} from "lucide-react";

export default function Aux() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside className="w-64 bg-white border-r p-4 flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-600 mb-6">
              Panel Auxiliar
            </h1>

            <MenuItem icon={<LayoutDashboard size={18} />} text="Dashboard" />
            <MenuItem icon={<ClipboardCheck size={18} />} text="Asistencia" />
            <MenuItem icon={<ClipboardCheck size={18} />} text="Revisión Equipos" />
            <MenuItem icon={<AlertTriangle size={18} />} text="Incidencias" />
            <MenuItem icon={<Repeat size={18} />} text="Movimientos" />
            <MenuItem icon={<FileText size={18} />} text="Reporte Turno" />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <p className="text-sm font-semibold">
              Sistema ICEPAL
            </p>
          </div>
        </aside>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        
        {/* TOPBAR */}
        <header className="bg-white px-6 py-4 flex justify-between items-center border-b">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </button>

          <div className="flex items-center gap-4">
            <Moon />
            <Bell />
            <div className="flex items-center gap-2">
              {/* AVATAR */}
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/100" // puedes cambiar la imagen
                  alt="admin"
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* PUNTO VERDE (ONLINE) */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              <span className="text-sm font-medium">Auxiliar</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 space-y-6">

          {/* CARDS */}
          <div className="grid grid-cols-3 gap-6">
            <Card title="Equipos revisados hoy" value="12" />
            <Card title="Incidencias reportadas" value="3" />
            <Card title="Movimientos realizados" value="5" />
          </div>

          {/* ACCIONES RÁPIDAS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="mb-4 font-semibold">Acciones rápidas</h3>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-blue-600 text-white p-3 rounded">
                Asistencias
              </button>

              <button className="bg-green-600 text-white p-3 rounded">
                Revisar equipos
              </button>

              <button className="bg-yellow-500 text-white p-3 rounded">
                Reportar incidencia
              </button>

              <button className="bg-purple-600 text-white p-3 rounded">
                Registrar movimiento
              </button>
            </div>
          </div>

          {/* TABLA SIMPLE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="mb-4 font-semibold">Últimas incidencias</h3>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th>Equipo</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td>PC-01</td>
                  <td>Hardware</td>
                  <td>No enciende</td>
                </tr>
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}

/* COMPONENTES */

function MenuItem({ icon, text }: any) {
  return (
    <button className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-100">
      {icon}
      {text}
    </button>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}