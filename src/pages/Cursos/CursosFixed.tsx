import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Componente personalizado para los nodos de curso basado en la malla curricular oficial
const CourseNodeComponent = ({ data, selected }: any) => {
  const getNodeStyle = (category: string) => {
    switch (category) {
      case 'estudios-generales': // Amarillo en la malla
        return 'bg-yellow-500/30 border-yellow-400 text-yellow-100 hover:bg-yellow-500/40';
      case 'ciencias-basicas': // Azul en la malla
        return 'bg-blue-500/30 border-blue-400 text-blue-100 hover:bg-blue-500/40';
      case 'ciencias-ingenieria': // Verde en la malla
        return 'bg-green-500/30 border-green-400 text-green-100 hover:bg-green-500/40';
      case 'especialidad': // Morado/Púrpura en la malla
        return 'bg-purple-500/30 border-purple-400 text-purple-100 hover:bg-purple-500/40';
      case 'electivos': // Naranja en la malla
        return 'bg-orange-500/30 border-orange-400 text-orange-100 hover:bg-orange-500/40';
      case 'complementarios': // Rosa en la malla
        return 'bg-pink-500/30 border-pink-400 text-pink-100 hover:bg-pink-500/40';
      default:
        return 'bg-gray-500/30 border-gray-400 text-gray-100 hover:bg-gray-500/40';
    }
  };

  const selectedStyle = selected ? 'ring-2 ring-[#FFD700] ring-opacity-70 shadow-xl transform scale-105' : '';

  return (
    <button 
      className={`px-3 py-2 shadow-lg rounded-xl border-2 backdrop-blur-sm w-44 transition-all duration-300 cursor-pointer ${getNodeStyle(data.category)} ${selectedStyle} hover:shadow-2xl hover:transform hover:scale-105`}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-[#FFD700]" />
      <div className="text-center">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs font-bold text-[#FFD700]">{data.code}</div>
          <div className="text-xs bg-black/30 rounded px-1 py-0.5">
            {typeof data.cycle === 'string' ? data.cycle : `C${data.cycle}`}
          </div>
        </div>
        <div className="text-xs leading-tight font-medium mb-1">{data.label}</div>
        <div className="text-xs opacity-80 bg-black/20 rounded px-1 py-0.5 inline-block">{data.credits} Cred</div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-[#FFD700]" />
    </button>
  );
};

// Datos de cursos extraídos de la malla curricular oficial UNSAAC
const initialNodes = [
  // CICLO I
  { id: '1', position: { x: 50, y: 50 }, data: { label: 'Metalurgia General I', code: 'MT101AMT', credits: 4, cycle: 1, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '2', position: { x: 50, y: 180 }, data: { label: 'Química General I', code: 'QU101AMT', credits: 4, cycle: 1, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '3', position: { x: 50, y: 310 }, data: { label: 'Álgebra y Geometría Analítica', code: 'MA101AMT', credits: 4, cycle: 1, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '4', position: { x: 50, y: 440 }, data: { label: 'Cálculo I', code: 'MT001AMT', credits: 4, cycle: 1, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '5', position: { x: 50, y: 570 }, data: { label: 'Física I', code: 'FI001AMT', credits: 4, cycle: 1, category: 'ciencias-basicas' }, type: 'courseNode' },

  // CICLO II
  { id: '6', position: { x: 300, y: 50 }, data: { label: 'Mineralogía General', code: 'MT112AMT', credits: 4, cycle: 2, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '7', position: { x: 300, y: 180 }, data: { label: 'Química Descriptiva e Inorgánica I', code: 'QU112AMT', credits: 4, cycle: 2, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '8', position: { x: 300, y: 310 }, data: { label: 'Cálculo II', code: 'MA112AMT', credits: 4, cycle: 2, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '9', position: { x: 300, y: 440 }, data: { label: 'Física II', code: 'FI112AMT', credits: 4, cycle: 2, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '10', position: { x: 300, y: 570 }, data: { label: 'Comprensión de Textos', code: 'HU112AMT', credits: 2, cycle: 2, category: 'estudios-generales' }, type: 'courseNode' },

  // CICLO III
  { id: '11', position: { x: 550, y: 50 }, data: { label: 'Preparación Mecánica de Minerales', code: 'MT221AMT', credits: 4, cycle: 3, category: 'ciencias-ingenieria' }, type: 'courseNode' },
  { id: '12', position: { x: 550, y: 180 }, data: { label: 'Fisicoquímica I', code: 'QU231AMT', credits: 4, cycle: 3, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '13', position: { x: 550, y: 310 }, data: { label: 'Cálculo III', code: 'MA221AMT', credits: 4, cycle: 3, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '14', position: { x: 550, y: 440 }, data: { label: 'Ecuaciones Diferenciales', code: 'MA231AMT', credits: 4, cycle: 3, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '15', position: { x: 550, y: 570 }, data: { label: 'Fundamentos de Resistencia de Materiales', code: 'IC231AMT', credits: 4, cycle: 3, category: 'ciencias-ingenieria' }, type: 'courseNode' },

  // CICLO IV
  { id: '16', position: { x: 800, y: 50 }, data: { label: 'Concentración de Minerales', code: 'MT332AMT', credits: 4, cycle: 4, category: 'ciencias-ingenieria' }, type: 'courseNode' },
  { id: '17', position: { x: 800, y: 180 }, data: { label: 'Termodinámica Metalúrgica I', code: 'MT342AMT', credits: 4, cycle: 4, category: 'especialidad' }, type: 'courseNode' },
  { id: '18', position: { x: 800, y: 310 }, data: { label: 'Estadística', code: 'MA332AMT', credits: 4, cycle: 4, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '19', position: { x: 800, y: 440 }, data: { label: 'Mecánica de Fluidos Metalúrgicos', code: 'MT352AMT', credits: 4, cycle: 4, category: 'especialidad' }, type: 'courseNode' },
  { id: '20', position: { x: 800, y: 570 }, data: { label: 'Ciencia de los Materiales', code: 'MT362AMT', credits: 4, cycle: 4, category: 'especialidad' }, type: 'courseNode' },

  // CICLO V
  { id: '21', position: { x: 1050, y: 50 }, data: { label: 'Concentración de Minerales II', code: 'MT433AMT', credits: 4, cycle: 5, category: 'especialidad' }, type: 'courseNode' },
  { id: '22', position: { x: 1050, y: 180 }, data: { label: 'Pirometalurgia I', code: 'MT443AMT', credits: 4, cycle: 5, category: 'especialidad' }, type: 'courseNode' },
  { id: '23', position: { x: 1050, y: 310 }, data: { label: 'Cinética y Catálisis', code: 'QU443AMT', credits: 4, cycle: 5, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '24', position: { x: 1050, y: 440 }, data: { label: 'Métodos Numéricos', code: 'MT453AMT', credits: 3, cycle: 5, category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '25', position: { x: 1050, y: 570 }, data: { label: 'Modelamiento y Simulación de Procesos Metalúrgicos', code: 'MT463AMT', credits: 3, cycle: 5, category: 'especialidad' }, type: 'courseNode' },

  // CICLO VI
  { id: '26', position: { x: 1300, y: 50 }, data: { label: 'Pirometalurgia II', code: 'MT544AMT', credits: 4, cycle: 6, category: 'especialidad' }, type: 'courseNode' },
  { id: '27', position: { x: 1300, y: 180 }, data: { label: 'Hidrometalurgia I', code: 'MT554AMT', credits: 4, cycle: 6, category: 'especialidad' }, type: 'courseNode' },
  { id: '28', position: { x: 1300, y: 310 }, data: { label: 'Supervivencia y Salud en el Trabajo', code: 'MT564AMT', credits: 4, cycle: 6, category: 'complementarios' }, type: 'courseNode' },
  { id: '29', position: { x: 1300, y: 440 }, data: { label: 'Gestión de Empresas Metalúrgicas', code: 'MT574AMT', credits: 4, cycle: 6, category: 'complementarios' }, type: 'courseNode' },
  { id: '30', position: { x: 1300, y: 570 }, data: { label: 'Evaluación y Formulación de Proyectos', code: 'MT584AMT', credits: 4, cycle: 6, category: 'complementarios' }, type: 'courseNode' },

  // CICLO VII
  { id: '31', position: { x: 1550, y: 50 }, data: { label: 'Electrometalurgia I', code: 'MT645AMT', credits: 4, cycle: 7, category: 'especialidad' }, type: 'courseNode' },
  { id: '32', position: { x: 1550, y: 180 }, data: { label: 'Hidrometalurgia II', code: 'MT655AMT', credits: 4, cycle: 7, category: 'especialidad' }, type: 'courseNode' },
  { id: '33', position: { x: 1550, y: 310 }, data: { label: 'Control y Automatización de Procesos', code: 'MT665AMT', credits: 3, cycle: 7, category: 'especialidad' }, type: 'courseNode' },
  { id: '34', position: { x: 1550, y: 440 }, data: { label: 'Metalurgia Física', code: 'MT675AMT', credits: 4, cycle: 7, category: 'especialidad' }, type: 'courseNode' },
  { id: '35', position: { x: 1550, y: 570 }, data: { label: 'Metalurgia del Hierro', code: 'MT685AMT', credits: 4, cycle: 7, category: 'especialidad' }, type: 'courseNode' },

  // CICLO VIII
  { id: '36', position: { x: 1800, y: 50 }, data: { label: 'Electrometalurgia II', code: 'MT746AMT', credits: 4, cycle: 8, category: 'especialidad' }, type: 'courseNode' },
  { id: '37', position: { x: 1800, y: 180 }, data: { label: 'Metalurgia No Ferrosa', code: 'MT756AMT', credits: 4, cycle: 8, category: 'especialidad' }, type: 'courseNode' },
  { id: '38', position: { x: 1800, y: 310 }, data: { label: 'Ensayos y Análisis Metalúrgicos', code: 'MT766AMT', credits: 4, cycle: 8, category: 'especialidad' }, type: 'courseNode' },
  { id: '39', position: { x: 1800, y: 440 }, data: { label: 'Trabajo de Grado de Pregrado de Ingeniería Metalúrgica', code: 'MT776AMT', credits: 4, cycle: 8, category: 'especialidad' }, type: 'courseNode' },

  // CICLO IX
  { id: '40', position: { x: 2050, y: 50 }, data: { label: 'Problemas Esp. Metalurgia I', code: 'MT847AMT', credits: 3, cycle: 9, category: 'electivos' }, type: 'courseNode' },
  { id: '41', position: { x: 2050, y: 180 }, data: { label: 'Preparación de Tesis', code: 'MT857AMT', credits: 4, cycle: 9, category: 'especialidad' }, type: 'courseNode' },

  // CICLO X
  { id: '42', position: { x: 2300, y: 50 }, data: { label: 'Problemas Esp. Metalurgia II', code: 'MT948AMT', credits: 4, cycle: 10, category: 'electivos' }, type: 'courseNode' },
  { id: '43', position: { x: 2300, y: 180 }, data: { label: 'Sustentación de Tesis', code: 'MT958AMT', credits: 4, cycle: 10, category: 'especialidad' }, type: 'courseNode' },

  // CURSOS COMPLEMENTARIOS Y ELECTIVOS (posicionados en la parte inferior con mayor separación)
  { id: '44', position: { x: 50, y: 750 }, data: { label: 'Geología General', code: 'GE101AMT', credits: 4, cycle: 'electivo', category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '45', position: { x: 300, y: 750 }, data: { label: 'Petrología-Petrografía y Geoquímica', code: 'GE201AMT', credits: 4, cycle: 'electivo', category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '46', position: { x: 550, y: 750 }, data: { label: 'Geología General', code: 'GE301AMT', credits: 4, cycle: 'electivo', category: 'ciencias-basicas' }, type: 'courseNode' },
  { id: '47', position: { x: 800, y: 750 }, data: { label: 'Mecánica de Sólidos Deformables', code: 'IC441AMT', credits: 4, cycle: 'electivo', category: 'ciencias-ingenieria' }, type: 'courseNode' },
  { id: '48', position: { x: 1050, y: 750 }, data: { label: 'Historia, Crítica y Filosofía', code: 'HU541AMT', credits: 3, cycle: 'electivo', category: 'estudios-generales' }, type: 'courseNode' },
  { id: '49', position: { x: 1300, y: 750 }, data: { label: 'Gestión de Seguridad e Higiene Ocupacional', code: 'MT641AMT', credits: 3, cycle: 'electivo', category: 'complementarios' }, type: 'courseNode' },
  { id: '50', position: { x: 1550, y: 750 }, data: { label: 'Estudio de Impacto Ambiental', code: 'MT742AMT', credits: 3, cycle: 'electivo', category: 'complementarios' }, type: 'courseNode' },
  { id: '51', position: { x: 1800, y: 750 }, data: { label: 'Educación Física', code: 'EF101AMT', credits: 2, cycle: 'electivo', category: 'estudios-generales' }, type: 'courseNode' },
  { id: '52', position: { x: 2050, y: 750 }, data: { label: 'Legislación de Seguridad Minera', code: 'MT843AMT', credits: 3, cycle: 'electivo', category: 'complementarios' }, type: 'courseNode' },
];

// Conexiones entre cursos según prerequisitos de la malla curricular oficial
const initialEdges = [
  // Conexiones desde CICLO I a CICLO II
  { id: 'e1-6', source: '1', target: '6', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e2-7', source: '2', target: '7', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e4-8', source: '4', target: '8', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e5-9', source: '5', target: '9', style: { stroke: '#FFD700', strokeWidth: 2 } },

  // Conexiones desde CICLO II a CICLO III
  { id: 'e6-11', source: '6', target: '11', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e7-12', source: '7', target: '12', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e8-13', source: '8', target: '13', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e8-14', source: '8', target: '14', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e9-15', source: '9', target: '15', style: { stroke: '#FFD700', strokeWidth: 2 } },

  // Conexiones desde CICLO III a CICLO IV
  { id: 'e11-16', source: '11', target: '16', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e12-17', source: '12', target: '17', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e13-18', source: '13', target: '18', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e15-19', source: '15', target: '19', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e12-20', source: '12', target: '20', style: { stroke: '#FFD700', strokeWidth: 2 } },

  // Conexiones desde CICLO IV a CICLO V
  { id: 'e16-21', source: '16', target: '21', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e17-22', source: '17', target: '22', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e17-23', source: '17', target: '23', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e18-24', source: '18', target: '24', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e19-25', source: '19', target: '25', style: { stroke: '#FFD700', strokeWidth: 2 } },

  // Conexiones desde CICLO V a CICLO VI
  { id: 'e22-26', source: '22', target: '26', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e21-27', source: '21', target: '27', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e23-28', source: '23', target: '28', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e24-29', source: '24', target: '29', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e25-30', source: '25', target: '30', style: { stroke: '#FFD700', strokeWidth: 2 } },

  // Conexiones desde CICLO VI a CICLO VII
  { id: 'e27-31', source: '27', target: '31', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e27-32', source: '27', target: '32', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e25-33', source: '25', target: '33', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e26-34', source: '26', target: '34', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e26-35', source: '26', target: '35', style: { stroke: '#FFD700', strokeWidth: 2 } },

  // Conexiones desde CICLO VII a CICLO VIII
  { id: 'e31-36', source: '31', target: '36', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e35-37', source: '35', target: '37', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e34-38', source: '34', target: '38', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e33-39', source: '33', target: '39', style: { stroke: '#FFD700', strokeWidth: 2 } },

  // Conexiones desde CICLO VIII a CICLO IX
  { id: 'e36-40', source: '36', target: '40', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e39-41', source: '39', target: '41', style: { stroke: '#FFD700', strokeWidth: 2 } },

  // Conexiones desde CICLO IX a CICLO X
  { id: 'e40-42', source: '40', target: '42', style: { stroke: '#FFD700', strokeWidth: 2 } },
  { id: 'e41-43', source: '41', target: '43', style: { stroke: '#FFD700', strokeWidth: 2 } },

  // Conexiones de cursos electivos y complementarios
  { id: 'e44-45', source: '44', target: '45', style: { stroke: '#FFD700', strokeWidth: 1, strokeDasharray: '5,5' } },
  { id: 'e45-46', source: '45', target: '46', style: { stroke: '#FFD700', strokeWidth: 1, strokeDasharray: '5,5' } },
];

const nodeTypes = {
  courseNode: CourseNodeComponent,
};

const Cursos: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: any, node: any) => {
    setSelectedCourse(node.data);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, [setNodes]);

  return (
    <div className="min-h-screen text-white overflow-x-hidden flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)' }}>
      
      {/* Efectos de fondo avanzados */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#C9B037]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#B8860B]/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-20 w-48 h-48 bg-[#FFD700]/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header fijo */}
      <div className="relative z-20 flex-shrink-0 px-6 py-6 border-b border-[#FFD700]/10 backdrop-blur-xl bg-[#1a1a1a]/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-2xl font-bold shadow-2xl">
              📚
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">
                <span className="bg-gradient-to-r from-[#FFD700] to-[#C9B037] bg-clip-text text-transparent">
                  MALLA CURRICULAR
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Plan de Estudios - Ingeniería Metalúrgica UNSAAC</p>
            </div>
          </div>
          
          {/* Stats Badge */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center px-4 py-2 bg-[#1a1a1a]/60 backdrop-blur-md rounded-xl border border-[#FFD700]/20">
              <div className="text-lg font-bold text-[#FFD700]">52</div>
              <div className="text-xs text-gray-400">Cursos</div>
            </div>
            <div className="text-center px-4 py-2 bg-[#1a1a1a]/60 backdrop-blur-md rounded-xl border border-[#FFD700]/20">
              <div className="text-lg font-bold text-[#FFD700]">10</div>
              <div className="text-xs text-gray-400">Ciclos</div>
            </div>
            <div className="text-center px-4 py-2 bg-[#1a1a1a]/60 backdrop-blur-md rounded-xl border border-[#FFD700]/20">
              <div className="text-lg font-bold text-[#FFD700]">220</div>
              <div className="text-xs text-gray-400">Créditos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          
          {/* Leyenda de colores */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-sm">🎨</span>
              Categorías de Cursos
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="group p-4 bg-[#1a1a1a]/30 backdrop-blur-md rounded-2xl border border-[#FFD700]/20 hover:border-yellow-400/50 hover:bg-[#1a1a1a]/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm font-medium">Estudios Generales</span>
                </div>
              </div>
              <div className="group p-4 bg-[#1a1a1a]/30 backdrop-blur-md rounded-2xl border border-[#FFD700]/20 hover:border-blue-400/50 hover:bg-[#1a1a1a]/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium">Ciencias Básicas</span>
                </div>
              </div>
              <div className="group p-4 bg-[#1a1a1a]/30 backdrop-blur-md rounded-2xl border border-[#FFD700]/20 hover:border-green-400/50 hover:bg-[#1a1a1a]/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm font-medium">Ciencias de Ingeniería</span>
                </div>
              </div>
              <div className="group p-4 bg-[#1a1a1a]/30 backdrop-blur-md rounded-2xl border border-[#FFD700]/20 hover:border-purple-400/50 hover:bg-[#1a1a1a]/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm font-medium">Especialidad</span>
                </div>
              </div>
              <div className="group p-4 bg-[#1a1a1a]/30 backdrop-blur-md rounded-2xl border border-[#FFD700]/20 hover:border-orange-400/50 hover:bg-[#1a1a1a]/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm font-medium">Electivos</span>
                </div>
              </div>
              <div className="group p-4 bg-[#1a1a1a]/30 backdrop-blur-md rounded-2xl border border-[#FFD700]/20 hover:border-pink-400/50 hover:bg-[#1a1a1a]/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-pink-500 rounded"></div>
                  <span className="text-sm font-medium">Complementarios</span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagrama curricular - Pantalla completa sin marcos */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-sm">🗺️</span>
              Diagrama Interactivo - Malla Curricular Completa
            </h2>
            
            <div className="flex gap-4">
              {/* Diagrama de flujo sin marcos */}
              <div className={`transition-all duration-300 ${selectedCourse ? 'w-3/4' : 'w-full'}`}>
                <div className="h-[80vh] bg-black/5 rounded-xl overflow-hidden">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-transparent"
                    fitViewOptions={{
                      padding: 0.1,
                      includeHiddenNodes: false,
                      minZoom: 0.1,
                      maxZoom: 1.5
                    }}
                  >
                    <Controls className="bg-black/50 border border-[#FFD700]/30 backdrop-blur-sm" />
                    <Background color="#FFD700" gap={20} />
                  </ReactFlow>
                </div>
              </div>

              {/* Panel lateral desplegable */}
              {selectedCourse && (
                <div className="w-1/4 transition-all duration-300 transform animate-slideInRight">
                  <div className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl border border-[#FFD700]/20 overflow-hidden shadow-xl h-[80vh] relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative h-full overflow-y-auto p-6">
                      {/* Botón cerrar */}
                      <button 
                        onClick={() => {
                          setSelectedCourse(null);
                          setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
                        }}
                        className="absolute top-4 right-4 w-8 h-8 bg-[#FFD700]/20 hover:bg-[#FFD700]/40 rounded-full flex items-center justify-center transition-all duration-200 z-10"
                      >
                        <span className="text-[#FFD700] text-lg">×</span>
                      </button>

                      <h3 className="text-lg font-bold text-[#FFD700] mb-4 pr-8">
                        {selectedCourse.label}
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-[#C9B037] mb-3 flex items-center gap-2">
                            <span className="w-5 h-5 bg-[#FFD700]/20 rounded flex items-center justify-center text-xs">ℹ️</span>
                            Información General
                          </h4>
                          <div className="text-sm space-y-2 bg-[#0f0f0f]/50 rounded-xl p-4">
                            <p><span className="text-gray-400">Código:</span> <span className="text-[#FFD700] font-mono">{selectedCourse.code}</span></p>
                            <p><span className="text-gray-400">Créditos:</span> <span className="text-white font-semibold">{selectedCourse.credits}</span></p>
                            <p><span className="text-gray-400">Ciclo:</span> <span className="text-[#C9B037]">{typeof selectedCourse.cycle === 'string' ? selectedCourse.cycle : `Ciclo ${selectedCourse.cycle}`}</span></p>
                            <p><span className="text-gray-400">Área:</span> <span className="text-[#FFF8DC]">{getCategoryName(selectedCourse.category)}</span></p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-[#C9B037] mb-3 flex items-center gap-2">
                            <span className="w-5 h-5 bg-[#FFD700]/20 rounded flex items-center justify-center text-xs">📖</span>
                            Descripción
                          </h4>
                          <div className="bg-[#0f0f0f]/50 rounded-xl p-4">
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {getCourseDescription(selectedCourse.label)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-[#C9B037] mb-3 flex items-center gap-2">
                            <span className="w-5 h-5 bg-[#FFD700]/20 rounded flex items-center justify-center text-xs">🎯</span>
                            Competencias
                          </h4>
                          <div className="bg-[#0f0f0f]/50 rounded-xl p-4">
                            <ul className="text-sm text-gray-300 space-y-1">
                              <li className="flex items-start gap-2">
                                <span className="text-[#FFD700] mt-1">•</span>
                                <span>Desarrollo de competencias técnicas especializadas</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#FFD700] mt-1">•</span>
                                <span>Aplicación de principios teóricos en casos prácticos</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#FFD700] mt-1">•</span>
                                <span>Preparación para el ejercicio profesional</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer institucional */}
      <footer className="relative bg-gradient-to-t from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] text-white py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Grid principal del footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Universidad */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <img 
                  src="/assets/logo-metalurgia.jpg" 
                  alt="Logo Metalurgia" 
                  className="w-12 h-12 rounded-xl shadow-lg mr-3"
                />
                <div>
                  <h3 className="text-[#FFD700] font-bold text-lg">
                    Metalurgia UNSAAC
                  </h3>
                  <p className="text-gray-400 text-sm">Excelencia Académica</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Formando profesionales metalúrgicos de excelencia desde 1692. 
                Tradición, innovación y compromiso con el desarrollo tecnológico del país.
              </p>
            </div>

            {/* Enlaces Académicos */}
            <div className="text-center md:text-left">
              <h4 className="text-[#FFD700] font-semibold text-lg mb-4">
                Académico
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/carrera" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    🎓 Plan de Estudios
                  </a>
                </li>
                <li>
                  <a href="/cursos" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    📚 Malla Curricular
                  </a>
                </li>
                <li>
                  <a href="/docentes" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    👥 Plana Docente
                  </a>
                </li>
                <li>
                  <a href="/oportunidades" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    💼 Oportunidades y Especializaciones
                  </a>
                </li>
              </ul>
            </div>

            {/* Recursos */}
            <div className="text-center md:text-left">
              <h4 className="text-[#FFD700] font-semibold text-lg mb-4">
                Recursos
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/documentos" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    📋 Documentos Académicos
                  </a>
                </li>
                <li>
                  <a href="/oportunidades" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    💼 Oportunidades Laborales
                  </a>
                </li>
                <li>
                  <a href="/noticias" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    📰 Noticias y Eventos
                  </a>
                </li>
                <li>
                  <a href="/chatbot" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    🤖 Consulta Inteligente
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="text-center md:text-left">
              <h4 className="text-[#FFD700] font-semibold text-lg mb-4">
                Contacto
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center md:justify-start">
                  <span className="text-[#C9B037] mr-2">📧</span>
                  <a href="mailto:metalurgia@unsaac.edu.pe" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    metalurgia@unsaac.edu.pe
                  </a>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <span className="text-[#C9B037] mr-2">📞</span>
                  <span className="text-gray-400">+51 84 604100</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <span className="text-[#C9B037] mr-2">📍</span>
                  <span className="text-gray-400">Av. de la Cultura 733</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <span className="text-[#C9B037] mr-2">🏛️</span>
                  <span className="text-gray-400">Cusco, Perú</span>
                </div>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent mb-8"></div>

          {/* Información de copyright y enlaces adicionales */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-1">
                © 2025 Ingeniería Metalúrgica - Universidad Nacional de San Antonio Abad del Cusco
              </p>
              <p className="text-gray-500 text-xs">
                Todos los derechos reservados | Desarrollado con tecnología de vanguardia
              </p>
            </div>
            
            {/* Enlaces de políticas */}
            <div className="flex space-x-6 text-xs">
              <a href="/politica-privacidad" className="text-gray-500 hover:text-[#FFD700] transition-colors duration-300">
                Política de Privacidad
              </a>
              <a href="/terminos" className="text-gray-500 hover:text-[#FFD700] transition-colors duration-300">
                Términos de Uso
              </a>
              <a href="/accesibilidad" className="text-gray-500 hover:text-[#FFD700] transition-colors duration-300">
                Accesibilidad
              </a>
            </div>
          </div>

          {/* Universidad Nacional de San Antonio Abad del Cusco */}
          <div className="text-center mt-8 pt-6 border-t border-[#FFD700]/10">
            <p className="text-[#C9B037] text-sm font-medium">
              🏛️ Universidad Nacional de San Antonio Abad del Cusco
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Fundada en 1692 | Excelencia Académica y Tradición
            </p>
          </div>
        </div>
        
        {/* Efectos decorativos del footer */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#FFD700]/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-[#C9B037]/4 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 bg-[#FFD700]/2 rounded-full blur-3xl"></div>
        
        {/* Partículas decorativas */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#FFD700]/60 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-[#C9B037]/50 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-10 left-20 w-2 h-2 bg-[#FFD700]/40 rounded-full animate-pulse delay-1000"></div>
      </footer>
    </div>
  );
};

// Función auxiliar para obtener el nombre de la categoría
function getCategoryName(category: string): string {
  const names: { [key: string]: string } = {
    'estudios-generales': 'Estudios Generales',
    'ciencias-basicas': 'Ciencias Básicas',
    'ciencias-ingenieria': 'Ciencias de Ingeniería',
    'especialidad': 'Especialidad',
    'electivos': 'Electivos',
    'complementarios': 'Complementarios'
  };
  return names[category] || 'Sin categoría';
}

// Función auxiliar para obtener descripción del curso
function getCourseDescription(courseName: string): string {
  const descriptions: { [key: string]: string } = {
    // CICLO I
    'Metalurgia General I': 'Introducción a los principios fundamentales de la metalurgia, procesos de extracción y transformación de metales. Base conceptual para toda la carrera.',
    'Química General I': 'Fundamentos de química general, estructura atómica, enlaces químicos y reacciones básicas aplicadas a procesos metalúrgicos.',
    'Álgebra y Geometría Analítica': 'Conceptos fundamentales de álgebra lineal y geometría analítica aplicados a la ingeniería metalúrgica.',
    'Cálculo I': 'Límites, derivadas y sus aplicaciones en problemas de ingeniería metalúrgica y análisis de procesos.',
    'Física I': 'Mecánica clásica, cinemática, dinámica y principios de conservación aplicados a sistemas metalúrgicos.',
    
    // CICLO II
    'Mineralogía General': 'Estudio de minerales, su clasificación, propiedades físicas y químicas, base para procesos de concentración.',
    'Química Descriptiva e Inorgánica I': 'Química de elementos y compuestos inorgánicos relevantes en procesos metalúrgicos.',
    'Cálculo II': 'Integrales, series y ecuaciones diferenciales básicas aplicadas a modelamiento de procesos.',
    'Física II': 'Electromagnetismo, termodinámica y óptica aplicados a procesos metalúrgicos.',
    'Comprensión de Textos': 'Desarrollo de habilidades de comprensión lectora y comunicación técnica.',
    
    // CICLO III
    'Preparación Mecánica de Minerales': 'Procesos de chancado, molienda, clasificación y concentración física de minerales.',
    'Fisicoquímica I': 'Principios fisicoquímicos aplicados a sistemas metalúrgicos, equilibrios y cinética.',
    'Cálculo III': 'Cálculo vectorial, ecuaciones diferenciales parciales y análisis matemático avanzado.',
    'Ecuaciones Diferenciales': 'Resolución de ecuaciones diferenciales aplicadas al modelamiento de procesos metalúrgicos.',
    'Fundamentos de Resistencia de Materiales': 'Análisis de esfuerzos, deformaciones y comportamiento mecánico de materiales.',
    
    // CICLO IV
    'Concentración de Minerales': 'Procesos de flotación, separación magnética y gravimétrica para concentración de minerales.',
    'Termodinámica Metalúrgica I': 'Principios termodinámicos aplicados a procesos de reducción y oxidación de metales.',
    'Estadística': 'Métodos estadísticos para análisis de datos y control de calidad en procesos metalúrgicos.',
    'Mecánica de Fluidos Metalúrgicos': 'Comportamiento de fluidos en procesos metalúrgicos, transporte de masa y momentum.',
    'Ciencia de los Materiales': 'Estructura, propiedades y comportamiento de materiales metálicos y cerámicos.',
    
    // CICLO V
    'Concentración de Minerales II': 'Procesos avanzados de concentración, diseño de plantas y optimización de circuitos.',
    'Pirometalurgia I': 'Procesos de alta temperatura para extracción de metales, tostación y fusión.',
    'Cinética y Catálisis': 'Velocidad de reacciones químicas y catalíticas en procesos metalúrgicos.',
    'Métodos Numéricos': 'Técnicas computacionales para resolución de problemas de ingeniería metalúrgica.',
    'Modelamiento y Simulación de Procesos Metalúrgicos': 'Desarrollo de modelos matemáticos y simulación de procesos.',
    
    // CICLO VI
    'Pirometalurgia II': 'Procesos avanzados de pirometalurgia, refinación y tratamiento de escorias.',
    'Hidrometalurgia I': 'Procesos de lixiviación, extracción por solventes y recuperación de metales en medio acuoso.',
    'Supervivencia y Salud en el Trabajo': 'Seguridad industrial, prevención de riesgos y salud ocupacional en minería.',
    'Gestión de Empresas Metalúrgicas': 'Administración, gestión empresarial y aspectos económicos de la industria metalúrgica.',
    'Evaluación y Formulación de Proyectos': 'Análisis de factibilidad, evaluación económica y formulación de proyectos minero-metalúrgicos.',
    
    // CICLO VII
    'Electrometalurgia I': 'Procesos electroquímicos para extracción y refinación de metales, principios de electrólisis.',
    'Hidrometalurgia II': 'Procesos avanzados de hidrometalurgia, precipitación y purificación de soluciones.',
    'Control y Automatización de Procesos': 'Sistemas de control automático y instrumentación en plantas metalúrgicas.',
    'Metalurgia Física': 'Estructura cristalina, transformaciones de fase y propiedades físicas de metales.',
    'Metalurgia del Hierro': 'Procesos específicos para producción de hierro y acero, alto horno y acería.',
    
    // CICLO VIII
    'Electrometalurgia II': 'Procesos avanzados de electrometalurgia, diseño de celdas y optimización electroquímica.',
    'Metalurgia No Ferrosa': 'Procesos específicos para metales no ferrosos: cobre, zinc, plomo, aluminio.',
    'Ensayos y Análisis Metalúrgicos': 'Técnicas analíticas, caracterización de materiales y control de calidad.',
    'Trabajo de Grado de Pregrado de Ingeniería Metalúrgica': 'Proyecto de investigación aplicada en ingeniería metalúrgica.',
    
    // CICLO IX-X
    'Problemas Esp. Metalurgia I': 'Análisis de problemas específicos y casos de estudio en metalurgia.',
    'Preparación de Tesis': 'Desarrollo de propuesta de tesis y metodología de investigación.',
    'Problemas Esp. Metalurgia II': 'Problemas avanzados y soluciones innovadoras en metalurgia.',
    'Sustentación de Tesis': 'Presentación y defensa del trabajo de tesis de grado.',
    
    // CURSOS COMPLEMENTARIOS
    'Geología General': 'Fundamentos de geología, minerales, rocas y formaciones geológicas.',
    'Petrología-Petrografía y Geoquímica': 'Estudio de rocas, su formación y composición química.',
    'Mecánica de Sólidos Deformables': 'Análisis avanzado de deformaciones y comportamiento de sólidos.',
    'Historia, Crítica y Filosofía': 'Desarrollo del pensamiento crítico y análisis histórico-filosófico.',
    'Gestión de Seguridad e Higiene Ocupacional': 'Sistemas de gestión de seguridad y salud ocupacional.',
    'Estudio de Impacto Ambiental': 'Evaluación y mitigación de impactos ambientales en proyectos mineros.',
    'Educación Física': 'Desarrollo físico y promoción de la salud integral.',
    'Legislación de Seguridad Minera': 'Marco legal y normativo de la seguridad en operaciones mineras.',
  };
  
  return descriptions[courseName] || 'Curso especializado en el área de ingeniería metalúrgica que desarrolla competencias técnicas y científicas específicas según la malla curricular oficial de la UNSAAC.';
}

export default Cursos;
