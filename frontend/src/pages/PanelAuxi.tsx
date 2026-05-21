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
import { useNavigate } from "react-router-dom";
export default function Aux() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id_equipo: "",
    id_auxiliar: "",
    turno: "",
    tipo: "",
    descripcion: "",
  });
  const [auxData, setAuxData] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [openChat, setOpenChat] = useState(false);
  const [mensajes, setMensajes] = useState<string[]>([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    const cargarDatos = async () => {
      const resEquipos = await fetch("http://localhost:3000/api/equipos", {
        credentials: "include",
      });

      const dataEquipos = await resEquipos.json();
      setEquipos(dataEquipos.data);
    };

    cargarDatos();
  }, []);
  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/incidencias", {
          credentials: "include",
        });

        const data = await res.json();

        setIncidencias(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    // carga inicial
    fetchIncidencias();

    // auto actualizar cada 3 segundos
    const interval = setInterval(() => {
      fetchIncidencias();
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchAuxiliar = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auxiliares/me");

        const data = await res.json();

        setAuxData(data);

        setFormData((prev) => ({
          ...prev,
          id_auxiliar: data.id_usuario,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchAuxiliar();
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
      const incidenciaData = {
        ...formData,
        fecha: new Date().toISOString().split("T")[0],
      };

      const response = await fetch("http://localhost:3000/api/incidencias", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incidenciaData),
      });

      const data = await response.json();

      setIncidencias((prev) => [data.data, ...prev]);

      toastr.success(data.message);

      setOpenModal(false);

      setFormData({
        id_equipo: "",
        id_auxiliar: auxData?.id_usuario || "",
        turno: "",
        tipo: "",
        descripcion: "",
      });
    } catch (error) {
      toastr.error("Error al guardar");
    }
  };
  const navigate = useNavigate();
  const cerrarSesion = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login", { replace: true });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const verificarAux = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auxiliares/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.rol?.nombre !== "AUXILIAR") {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };
    verificarAux();
  }, []);
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
            <button className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-100">
              <Repeat size={18} />
              Ver Estado Auxiliares
            </button>
            <button
              onClick={() => setOpenChat(true)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-100"
            >
              <FileText size={18} />
              Chat Interno
            </button>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <p className="text-sm font-semibold">Sistema ICEPAL</p>
          </div>
        </aside>
      )}
      <div className="flex-1 flex flex-col">
        <header className="bg-white px-6 py-4 flex justify-between items-center border-b">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </button>

          <div className="flex items-center gap-4">
            <Moon />
            <Bell />
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenUserMenu(!openUserMenu);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
              >
                {/* FOTO */}
                <div className="relative">
                  <img
                    src={
                      preview
                        ? preview
                        : auxData?.foto
                          ? `http://localhost:3000/uploads/${auxData.foto}`
                          : "https://i.pravatar.cc/100"
                    }
                    alt="aux"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                  />

                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>

                {/* INFO */}
                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-gray-800">
                    {auxData?.nombre_completo}
                  </p>

                  <p className="text-xs text-gray-500">AUXILIAR</p>
                </div>
              </button>

              {/* MENU */}
              {openUserMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800">
                      {auxData?.nombre_completo}
                    </p>

                    <p className="text-xs text-gray-500">
                      {auxData?.codigo_acceso}
                    </p>
                  </div>

                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setOpenUserMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
                    >
                      Perfil
                    </button>

                    <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm">
                      Configuración
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 space-y-6">
          {/* CARDS */}
          <div className="grid grid-cols-3 gap-6">
            <Card title="Equipos revisados hoy" value="12" />
            <Card title="Incidencias reportadas" value={incidencias.length} />
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
                  <th className="py-2">Equipo</th>
                  <th className="py-2">Tipo</th>
                  <th className="py-2">Descripción</th>
                  <th className="py-2">Auxiliar</th>
                  <th className="py-2">Fecha</th>
                </tr>
              </thead>

              <tbody>
                {incidencias.slice(0, 5).map((inc) => (
                  <tr
                    key={inc.id_incidencia}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-2">{inc.equipo?.codigo_equipo}</td>

                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          inc.tipo === "HARDWARE" ? "bg-red-500" : "bg-blue-500"
                        }`}
                      >
                        {inc.tipo}
                      </span>
                    </td>

                    <td className="py-2">{inc.descripcion}</td>

                    <td className="py-2">{inc.auxiliar?.nombre_completo}</td>

                    <td className="py-2">
                      {new Date(inc.fecha).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
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
                      {equipo.codigo_equipo}
                    </option>
                  ))}
                </select>
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
        {/* MODAL PERFIL */}
        {showProfileModal && auxData && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[400px] rounded-2xl shadow-lg p-6 relative">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-3 right-3 text-gray-500"
              >
                ✖
              </button>

              {/* FOTO */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <img
                    src={
                      preview
                        ? preview
                        : auxData?.foto
                          ? `http://localhost:3000/uploads/${auxData.foto}`
                          : "https://i.pravatar.cc/150"
                    }
                    className="w-full h-full rounded-full object-cover"
                  />

                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                    ✏️
                    <input
                      type="file"
                      className="hidden"
                      onChange={async (e: any) => {
                        const file = e.target.files[0];

                        if (!file) return;

                        const formData = new FormData();

                        formData.append("foto", file);

                        try {
                          const res = await fetch(
                            `http://localhost:3000/api/upload-photo/${auxData.id_usuario}`,
                            {
                              method: "POST",
                              body: formData,
                            },
                          );

                          const data = await res.json();

                          setPreview(URL.createObjectURL(file));

                          setAuxData({
                            ...auxData,
                            foto: data.foto,
                          });

                          toastr.success("Foto actualizada");
                        } catch (error) {
                          toastr.error("Error al subir");
                        }
                      }}
                    />
                  </label>
                </div>

                <h2 className="text-lg font-bold mt-3">
                  {auxData.nombre_completo}
                </h2>

                <p className="text-sm text-gray-500">AUXILIAR</p>
              </div>

              {/* INFO */}
              <div className="mt-5 space-y-2 text-sm">
                <p>
                  <strong>ID:</strong> {auxData.id_usuario}
                </p>

                <p>
                  <strong>Código:</strong> {auxData.codigo_acceso}
                </p>

                <p>
                  <strong>Estado:</strong> {auxData.estado}
                </p>

                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(auxData.fecha_creacion).toLocaleDateString()}
                </p>
                <button
                  onClick={cerrarSesion}
                  className="w-full mt-5 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
        {openChat && (
          <div className="fixed right-0 top-0 h-full w-[350px] bg-white shadow-2xl border-l flex flex-col z-50">
            {/* HEADER CHAT */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">Chat Interno</h2>

              <button
                onClick={() => setOpenChat(false)}
                className="text-red-500"
              >
                ✖
              </button>
            </div>

            {/* MENSAJES */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
              {mensajes.length === 0 ? (
                <p className="text-sm text-gray-400 text-center mt-10">
                  No hay mensajes
                </p>
              ) : (
                mensajes.map((msg, i) => (
                  <div key={i} className="bg-white p-2 rounded shadow text-sm">
                    {msg}
                  </div>
                ))
              )}
            </div>

            {/* INPUT */}
            <div className="p-3 border-t flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 border rounded px-2 py-1 text-sm"
              />

              <button
                onClick={() => {
                  if (!input.trim()) return;
                  setMensajes([...mensajes, input]);
                  setInput("");
                }}
                className="bg-blue-600 text-white px-3 rounded"
              >
                Enviar
              </button>
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
