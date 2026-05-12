import { useState, useEffect } from "react";
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
  const [openModal, setOpenModal] = useState(false);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [auxiliares, setAuxiliares] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id_equipo: "",
    id_auxiliar: "",
    fecha: new Date().toISOString().split("T")[0],
    turno: "",
    tipo: "",
    descripcion: "",
  });
  useEffect(() => {
    const cargarDatos = async () => {
      const resEquipos = await fetch("http://localhost:3000/api/equipos");

      const dataEquipos = await resEquipos.json();
      setEquipos(dataEquipos.data);

      const resAux = await fetch("http://localhost:3000/api/auxiliares");

      const dataAux = await resAux.json();
      setAuxiliares(dataAux.data);
    };

    cargarDatos();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const guardarIncidencia = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/incidencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      setOpenModal(false);
    } catch (error) {
      alert("Error al guardar");
    }
  };
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
            <MenuItem
              icon={<ClipboardCheck size={18} />}
              text="Revisión Equipos"
            />
            <MenuItem icon={<AlertTriangle size={18} />} text="Incidencias" />
            <MenuItem icon={<Repeat size={18} />} text="Movimientos" />
            <MenuItem icon={<FileText size={18} />} text="Reporte Turno" />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <p className="text-sm font-semibold">Sistema ICEPAL</p>
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

              <button
                onClick={() => setOpenModal(true)}
                className="bg-yellow-500 text-white p-3 rounded"
              >
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
        {/* MODAL */}
        {openModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">Registrar Incidencia</h2>

                <button
                  onClick={() => setOpenModal(false)}
                  className="text-red-500 text-xl"
                >
                  X
                </button>
              </div>

              <div className="space-y-4">
                <select
                  name="id_equipo"
                  className="w-full border p-3 rounded"
                  onChange={handleChange}
                >
                  <option value="">Seleccionar equipo</option>

                  {equipos.map((equipo) => (
                    
                    <option key={equipo.id_equipo} value={equipo.id_equipo}>
                      {equipo.codigo_equipo }
                    </option>
                  ))}
                  
                </select>
                <select
                  name="id_auxiliar"
                  className="w-full border p-3 rounded"
                  onChange={handleChange}
                >
                  <option value="">Seleccionar auxiliar</option>

                  {auxiliares?.map((aux) => (
                    <option key={aux.id_usuario} value={aux.id_usuario}>
                      {aux.nombre_completo}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  className="w-full border p-3 rounded"
                  onChange={handleChange}
                />

                <select
                  name="turno"
                  className="w-full border p-3 rounded"
                  onChange={handleChange}
                >
                  <option value="">Seleccionar turno</option>
                  <option value="MAÑANA">MAÑANA</option>
                  <option value="TARDE">TARDE</option>
                  <option value="NOCHE">NOCHE</option>
                </select>

                <select
                  name="tipo"
                  className="w-full border p-3 rounded"
                  onChange={handleChange}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="HARDWARE">HARDWARE</option>
                  <option value="SOFTWARE">SOFTWARE</option>
                </select>

                <textarea
                  name="descripcion"
                  placeholder="Descripción"
                  className="w-full border p-3 rounded"
                  rows={4}
                  onChange={handleChange}
                />

                <button
                  onClick={guardarIncidencia}
                  className="w-full bg-blue-600 text-white p-3 rounded-xl"
                >
                  Guardar incidencia
                </button>
              </div>
            </div>
          </div>
        )}
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
