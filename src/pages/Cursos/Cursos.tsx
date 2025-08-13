import React, { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, addEdge, useEdgesState, useNodesState, Handle, Position } from '@xyflow/react';
import type { NodeProps, Edge, Connection, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Tipos de datos
interface CourseData {
  label: string;
  code: string;            // Código oficial (si no existe se mantiene "NO EXISTE")
  credits: number;         // Créditos oficiales
  cycle: string;           // Ciclo romano I..X
  type: 'generales' | 'especificos' | 'obligatorios' | 'electivo' | 'practicas' | 'extracurricular'; // Área curricular normalizada
}

// Colores por tipo de curso según la imagen
const courseTypeColors: Record<CourseData['type'], string> = {
  'generales': 'from-yellow-400 to-yellow-500',       // Estudios Generales
  'especificos': 'from-green-300 to-green-500',       // Estudios Específicos
  'obligatorios': 'from-emerald-500 to-emerald-600',  // Especialidad Obligatorios
  'electivo': 'from-cyan-400 to-cyan-500',            // Electivos de especialidad
  'practicas': 'from-red-400 to-red-500',             // Prácticas
  'extracurricular': 'from-purple-500 to-fuchsia-600' // Actividades extracurriculares
};

const courseTypeLabels: Record<CourseData['type'], string> = {
  'generales': 'Estudios Generales',
  'especificos': 'Estudios Específicos',
  'obligatorios': 'Estudios de Especialidad Obligatorios',
  'electivo': 'Estudios de Especialidad Electivos',
  'practicas': 'Prácticas',
  'extracurricular': 'Actividades Extracurriculares'
};

// Componente de nodo personalizado
function CourseNode({ data, selected }: NodeProps) {
  const courseData = data as unknown as CourseData;
  const colorClass = courseTypeColors[courseData.type] || 'from-gray-400 to-gray-500';
  
  return (
    <div className={`relative rounded-xl px-3 py-2 text-xs font-medium text-white shadow-xl border-2 ${selected ? 'border-[#FFD700]' : 'border-white/20'} bg-gradient-to-br ${colorClass} min-w-[140px] backdrop-blur-sm`}>
      <Handle type="target" position={Position.Top} style={{ background: '#333', width: 8, height: 8, border: '2px solid #fff' }} />
      
      <div className="text-center space-y-1">
        <div className="font-bold text-[10px] bg-black/20 px-2 py-0.5 rounded-full">
          {courseData.code}
        </div>
        <div className="font-semibold leading-tight text-[11px] text-center">
          {courseData.label}
        </div>
        <div className="text-[10px] opacity-90">
          {courseData.credits} créditos • Ciclo {courseData.cycle}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} style={{ background: '#333', width: 8, height: 8, border: '2px solid #fff' }} />
    </div>
  );
}

const nodeTypes = { courseNode: CourseNode };

// Malla curricular actualizada (sin flechas / prerrequisitos, solo datos oficiales proporcionados)
// Distribución horizontal por ciclo (x) y vertical por orden (y)
const initialNodes: Node[] = [
  // CICLO I
  { id: 'c1-qui-gen', position: { x: 40, y: 40 }, data: { label: 'Química General', code: 'QU001AMT', credits: 4, cycle: 'I', type: 'generales' }, type: 'courseNode' },
  { id: 'c1-alg-geo', position: { x: 40, y: 140 }, data: { label: 'Álgebra y Geometría Analítica', code: 'ME001AMT', credits: 4, cycle: 'I', type: 'generales' }, type: 'courseNode' },
  { id: 'c1-cal-i', position: { x: 40, y: 240 }, data: { label: 'Cálculo I', code: 'MEG02AMT', credits: 4, cycle: 'I', type: 'generales' }, type: 'courseNode' },
  { id: 'c1-fis-i', position: { x: 40, y: 340 }, data: { label: 'Física I', code: 'FIG01AMT', credits: 4, cycle: 'I', type: 'generales' }, type: 'courseNode' },
  { id: 'c1-eco-med', position: { x: 40, y: 440 }, data: { label: 'Ecología y Medio Ambiente', code: 'MLG01AMT', credits: 3, cycle: 'I', type: 'generales' }, type: 'courseNode' },
  { id: 'c1-his-peru', position: { x: 40, y: 540 }, data: { label: 'Historia Cívica del Perú e Identidad Nacional', code: 'HIG01AMT', credits: 3, cycle: 'I', type: 'generales' }, type: 'courseNode' },

  // CICLO II
  { id: 'c2-met-gen', position: { x: 220, y: 40 }, data: { label: 'Metalurgia General', code: 'MLG02AMT', credits: 4, cycle: 'II', type: 'especificos' }, type: 'courseNode' },
  { id: 'c2-estad-gen', position: { x: 220, y: 140 }, data: { label: 'Estadística General', code: 'MEG03AMT', credits: 4, cycle: 'II', type: 'generales' }, type: 'courseNode' },
  { id: 'c2-cal-ii', position: { x: 220, y: 240 }, data: { label: 'Cálculo II', code: 'MEG04AMT', credits: 4, cycle: 'II', type: 'generales' }, type: 'courseNode' },
  { id: 'c2-conf-met', position: { x: 220, y: 340 }, data: { label: 'Conformados de los Metales', code: 'MLG03AMT', credits: 3, cycle: 'II', type: 'especificos' }, type: 'courseNode' },
  { id: 'c2-pc-ia', position: { x: 220, y: 440 }, data: { label: 'Pensamiento Computacional e Inteligencia Artificial', code: 'IFG01AMT', credits: 3, cycle: 'II', type: 'generales' }, type: 'courseNode' },
  { id: 'c2-ling-com', position: { x: 220, y: 540 }, data: { label: 'Lingüística y Comunicación Humana', code: 'LCG01AMT', credits: 3, cycle: 'II', type: 'generales' }, type: 'courseNode' },

  // CICLO III
  { id: 'c3-min-gen', position: { x: 400, y: 40 }, data: { label: 'Mineralogía General', code: 'GO951AMT', credits: 4, cycle: 'III', type: 'especificos' }, type: 'courseNode' },
  { id: 'c3-fqm-i', position: { x: 400, y: 140 }, data: { label: 'Físico Química Metalúrgica I', code: 'ML602AMT', credits: 4, cycle: 'III', type: 'especificos' }, type: 'courseNode' },
  { id: 'c3-met-qui', position: { x: 400, y: 240 }, data: { label: 'Metalurgia Química', code: 'ML610AMT', credits: 4, cycle: 'III', type: 'especificos' }, type: 'courseNode' },
  { id: 'c3-fis-ii', position: { x: 400, y: 340 }, data: { label: 'Fundamentos de Oscilaciones Ondas y Fluidos (FIS II)', code: 'FIG02AMT', credits: 4, cycle: 'III', type: 'generales' }, type: 'courseNode' },
  { id: 'c3-geo-gen', position: { x: 400, y: 440 }, data: { label: 'Geología General', code: 'GO108AMT', credits: 3, cycle: 'III', type: 'especificos' }, type: 'courseNode' },
  { id: 'c3-elec-1', position: { x: 400, y: 540 }, data: { label: 'Estudio de especialidad electivo', code: 'NO EXISTE', credits: 3, cycle: 'III', type: 'electivo' }, type: 'courseNode' },
  { id: 'c3-elec-2', position: { x: 400, y: 640 }, data: { label: 'Estudio de especialidad electivo', code: 'NO EXISTE', credits: 3, cycle: 'III', type: 'electivo' }, type: 'courseNode' },

  // CICLO IV
  { id: 'c4-prep-min', position: { x: 580, y: 40 }, data: { label: 'Preparación Mecánica de Minerales', code: 'ML701AMT', credits: 4, cycle: 'IV', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c4-fun-ing-met', position: { x: 580, y: 140 }, data: { label: 'Fundamentos de Ingeniería Metalúrgica', code: 'ML801AMT', credits: 4, cycle: 'IV', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c4-fqm-ii', position: { x: 580, y: 240 }, data: { label: 'Físico Química Metalúrgica II', code: 'ML603AMT', credits: 4, cycle: 'IV', type: 'especificos' }, type: 'courseNode' },
  { id: 'c4-metod-inv', position: { x: 580, y: 340 }, data: { label: 'Metodología de la Investigación Metalúrgica', code: 'ML105AMT', credits: 3, cycle: 'IV', type: 'especificos' }, type: 'courseNode' },
  { id: 'c4-fis-iii', position: { x: 580, y: 440 }, data: { label: 'Fundamentos de electromagnetismo (FIS III)', code: 'FIG03AMT', credits: 4, cycle: 'IV', type: 'especificos' }, type: 'courseNode' },
  { id: 'c4-min-gen', position: { x: 580, y: 540 }, data: { label: 'Minería General', code: 'IM291AMT', credits: 3, cycle: 'IV', type: 'especificos' }, type: 'courseNode' },

  // CICLO V
  { id: 'c5-conc-min-i', position: { x: 760, y: 40 }, data: { label: 'Concentración de Minerales I', code: 'ML703AMT', credits: 4, cycle: 'V', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c5-trans-flu', position: { x: 760, y: 140 }, data: { label: 'Transporte de fluidos Plantas Metalúrgicas', code: 'ML107AMT', credits: 4, cycle: 'V', type: 'especificos' }, type: 'courseNode' },
  { id: 'c5-termo-met', position: { x: 760, y: 240 }, data: { label: 'Termodinámica Metalúrgica', code: 'ML604AMT', credits: 4, cycle: 'V', type: 'especificos' }, type: 'courseNode' },
  { id: 'c5-ana-qui', position: { x: 760, y: 340 }, data: { label: 'Análisis Químico e Instrumental', code: 'ML611AMT', credits: 4, cycle: 'V', type: 'especificos' }, type: 'courseNode' },
  { id: 'c5-mec-mat', position: { x: 760, y: 440 }, data: { label: 'Mecánica de Materiales', code: 'ML640AMT', credits: 3, cycle: 'V', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c5-ing-amb', position: { x: 760, y: 540 }, data: { label: 'Ing. Ambiental Metalúrgica', code: 'ML501AMT', credits: 3, cycle: 'V', type: 'especificos' }, type: 'courseNode' },

  // CICLO VI
  { id: 'c6-conc-min-ii', position: { x: 940, y: 40 }, data: { label: 'Concentración de Minerales II', code: 'ML704AMT', credits: 4, cycle: 'VI', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c6-trans-cal-mat', position: { x: 940, y: 140 }, data: { label: 'Transmisión de Calor y Materia en Procesos Metalúrgicos', code: 'ML110AMT', credits: 4, cycle: 'VI', type: 'especificos' }, type: 'courseNode' },
  { id: 'c6-dibujo-dis', position: { x: 940, y: 240 }, data: { label: 'Dibujo y Diseño Metalúrgico', code: 'ML112AMT', credits: 4, cycle: 'VI', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c6-model-sim', position: { x: 940, y: 340 }, data: { label: 'Modelamiento y Simulación de Procesos Metalúrgicos', code: 'ML111AMT', credits: 4, cycle: 'VI', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c6-cie-mat', position: { x: 940, y: 440 }, data: { label: 'Ciencia de los Materiales', code: 'ML705AMT', credits: 4, cycle: 'VI', type: 'especificos' }, type: 'courseNode' },
  { id: 'c6-elec-1', position: { x: 940, y: 540 }, data: { label: 'Estudio de Especialidad Electivo', code: 'NO EXISTE', credits: 3, cycle: 'VI', type: 'electivo' }, type: 'courseNode' },

  // CICLO VII
  { id: 'c7-piro-met', position: { x: 1120, y: 40 }, data: { label: 'Pirometalurgia', code: 'ML204AMT', credits: 4, cycle: 'VII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c7-sider', position: { x: 1120, y: 140 }, data: { label: 'Siderurgia', code: 'ML710AMT', credits: 4, cycle: 'VII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c7-cin-react', position: { x: 1120, y: 240 }, data: { label: 'Cinética y Diseño de Reactores Metalúrgicos', code: 'ML614/AMT', credits: 4, cycle: 'VII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c7-control-auto', position: { x: 1120, y: 340 }, data: { label: 'Control y Automatización de Procesos', code: 'ML724AMT', credits: 3, cycle: 'VII', type: 'especificos' }, type: 'courseNode' },
  { id: 'c7-seg-salud', position: { x: 1120, y: 440 }, data: { label: 'Seguridad y Salud en el Trabajo', code: 'ML502AMT', credits: 4, cycle: 'VII', type: 'especificos' }, type: 'courseNode' },
  { id: 'c7-elec-1', position: { x: 1120, y: 540 }, data: { label: 'Estudio de especialidad electivo', code: 'NO EXISTE', credits: 3, cycle: 'VII', type: 'electivo' }, type: 'courseNode' },

  // CICLO VIII
  { id: 'c8-hidro', position: { x: 1300, y: 40 }, data: { label: 'Hidrometalurgia', code: 'ML206AMT', credits: 4, cycle: 'VIII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c8-dis-exp', position: { x: 1300, y: 140 }, data: { label: 'Diseño Experimental Metalúrgico', code: 'ML702AMT', credits: 4, cycle: 'VIII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c8-met-fis', position: { x: 1300, y: 240 }, data: { label: 'Metalurgia Física', code: 'ML714AMT', credits: 5, cycle: 'VIII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c8-mecan-met', position: { x: 1300, y: 340 }, data: { label: 'Mecanización de Metales', code: 'ML711AMT', credits: 3, cycle: 'VIII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c8-gest-emp-met', position: { x: 1300, y: 440 }, data: { label: 'Gestión de Empresas Metalúrgicas', code: 'ML503AMT', credits: 3, cycle: 'VIII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c8-elec-1', position: { x: 1300, y: 540 }, data: { label: 'Estudio de especialidad electivo', code: 'NO EXISTE', credits: 3, cycle: 'VIII', type: 'electivo' }, type: 'courseNode' },

  // CICLO IX
  { id: 'c9-electro', position: { x: 1480, y: 40 }, data: { label: 'Electrometalurgia', code: 'ML302AMT', credits: 4, cycle: 'IX', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c9-fund-mol', position: { x: 1480, y: 140 }, data: { label: 'Fundición y Moldeo', code: 'ML718AMT', credits: 4, cycle: 'IX', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c9-trat-term', position: { x: 1480, y: 240 }, data: { label: 'Tratamiento Térmicos', code: 'ML717AMT', credits: 4, cycle: 'IX', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c9-met-oro', position: { x: 1480, y: 340 }, data: { label: 'Metalurgia del Oro y la Plata', code: 'ML709AMT', credits: 3, cycle: 'IX', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c9-form-eval-proy', position: { x: 1480, y: 440 }, data: { label: 'Formulación y Evaluación de Proyectos Metalúrgicos', code: 'ML723AMT', credits: 4, cycle: 'IX', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c9-musica', position: { x: 1480, y: 540 }, data: { label: 'Música', code: 'ML013AMT', credits: 1, cycle: 'IX', type: 'extracurricular' }, type: 'courseNode' },

  // CICLO X
  { id: 'c10-corr-prot', position: { x: 1660, y: 40 }, data: { label: 'Corrosión y Protección de Metales', code: 'ML303AMT', credits: 4, cycle: 'X', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c10-joy-orf', position: { x: 1660, y: 140 }, data: { label: 'Joyería y Orfebrería', code: 'ML405AMT', credits: 1, cycle: 'X', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c10-soldadura', position: { x: 1660, y: 240 }, data: { label: 'Metalurgia de la Soldadura', code: 'ML719AMT', credits: 4, cycle: 'X', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c10-trab-inv', position: { x: 1660, y: 340 }, data: { label: 'Trabajo de Investigación', code: 'ML751/AMT', credits: 4, cycle: 'X', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c10-pract-pre', position: { x: 1660, y: 440 }, data: { label: 'Prácticas Pre Profesionales', code: 'ML701', credits: 3, cycle: 'X', type: 'practicas' }, type: 'courseNode' },
  { id: 'c10-dis-plant', position: { x: 1660, y: 540 }, data: { label: 'Diseño de Plantas Metalúrgicas', code: 'ML713AMT', credits: 4, cycle: 'X', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c10-edu-fis', position: { x: 1660, y: 640 }, data: { label: 'Educación Física', code: 'ML012AMT', credits: 1, cycle: 'X', type: 'extracurricular' }, type: 'courseNode' },
  { id: 'c10-elec-1', position: { x: 1660, y: 740 }, data: { label: 'Estudio de Especialidad Electivo', code: 'NO EXISTE', credits: 3, cycle: 'X', type: 'electivo' }, type: 'courseNode' },
];

// Conexiones entre cursos (prerrequisitos)
// Sin conexiones (se solicitaron sin flechas / prerrequisitos)
const initialEdges: Edge[] = [];

const Cursos: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [cycleFilter, setCycleFilter] = useState<string>('Todos');
  const [typeFilter, setTypeFilter] = useState<string>('Todos');

  const cycles = ['Todos', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const types: (CourseData['type'] | 'Todos')[] = ['Todos', 'generales', 'especificos', 'obligatorios', 'electivo', 'practicas', 'extracurricular'];

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((_e: any, node: Node) => {
    setSelectedCourse(node.data as any as CourseData);
    setNodes((nds: Node[]) => nds.map((n: Node) => ({ ...n, selected: n.id === node.id })) as Node[]);
  }, [setNodes]);

  const filteredNodes = useMemo(() => {
    let filtered = nodes;
    
    if (cycleFilter !== 'Todos') {
      filtered = filtered.filter((node: Node) => (node.data as any).cycle === cycleFilter);
    }
    
    if (typeFilter !== 'Todos') {
      filtered = filtered.filter((node: Node) => (node.data as any).type === typeFilter);
    }
    
    return filtered;
  }, [nodes, cycleFilter, typeFilter]);

  const filteredIds = new Set(filteredNodes.map((n: Node) => n.id));
  const filteredEdges = useMemo(() => 
    edges.filter((e: Edge) => filteredIds.has(e.source) && filteredIds.has(e.target)), 
    [edges, filteredIds]
  );

  const creditStats = useMemo(() => {
    const totals: Record<string, number> = { total: 0 };
    nodes.forEach((node: Node) => {
      const data = node.data as unknown as CourseData;
      totals.total += data.credits;
      totals[data.type] = (totals[data.type] || 0) + data.credits;
    });
    return totals;
  }, [nodes]);

  return (
    <div className="h-screen text-white overflow-hidden flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 35%, #0f0f0f 70%, #000000 100%)' }}>
      {/* Orbes animados de fondo */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-32 w-[32rem] h-[32rem] bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 right-10 w-[28rem] h-[28rem] bg-[#C9B037]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 -translate-y-1/2 right-1/3 w-72 h-72 bg-[#B8860B]/25 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute bottom-1/3 left-10 w-56 h-56 bg-[#FFD700]/10 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex-shrink-0 px-6 py-5 border-b border-[#FFD700]/10 backdrop-blur-xl bg-[#0f0f0f]/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-3xl font-black shadow-2xl">
                ⚙️
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black">
                  <span className="bg-gradient-to-r from-[#FFD700] to-[#C9B037] bg-clip-text text-transparent">
                    MALLA CURRICULAR - INGENIERÍA METALÚRGICA
                  </span>
                </h1>
                <p className="text-gray-400 text-xs md:text-sm max-w-2xl">
                  Visualización interactiva del plan de estudios. Total: {creditStats.total} créditos académicos
                </p>
              </div>
            </div>

            {/* Estadísticas rápidas dinámicas */}
            <div className="flex flex-wrap gap-2 text-xs">
              {(['generales','especificos','obligatorios','electivo','practicas','extracurricular'] as CourseData['type'][]).map(t => (
                <div key={t} className="px-3 py-1 rounded-full border flex items-center gap-1"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.15)'
                  }}>
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${courseTypeColors[t]}`}></span>
                  <span>{courseTypeLabels[t].split(' ')[0]}: {creditStats[t] || 0} cr</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-400 self-center">Ciclo:</span>
              {cycles.map(cycle => (
                <button
                  key={cycle}
                  onClick={() => setCycleFilter(cycle)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border backdrop-blur-sm ${
                    cycleFilter === cycle 
                      ? 'bg-[#FFD700]/30 border-[#FFD700]/60 text-[#FFD700]' 
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-[#FFD700] hover:border-[#FFD700]/40'
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-400 self-center">Tipo:</span>
        {types.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border backdrop-blur-sm ${
                    typeFilter === type 
                      ? 'bg-[#FFD700]/30 border-[#FFD700]/60 text-[#FFD700]' 
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-[#FFD700] hover:border-[#FFD700]/40'
                  }`}
                >
          {type === 'Todos' ? 'Todos' : courseTypeLabels[type as CourseData['type']]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pb-10">
          <div className="max-w-7xl mx-auto px-6 pt-8 flex gap-6">
            {/* Panel del grafo */}
            <div className="flex-1 min-w-0 bg-[#1a1a1a]/40 backdrop-blur-md rounded-3xl border border-[#FFD700]/20 shadow-2xl p-4 relative">
              <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/5" />
              <div style={{ height: '700px' }} className="relative">
                <ReactFlow
                  nodes={filteredNodes}
                  edges={filteredEdges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.1 }}
                  className="bg-black/10 rounded-xl"
                  defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
                >
                  <Controls className="bg-black/60 border border-[#FFD700]/30" />
                  <Background color="#3d3d3d" gap={24} size={2} />
                </ReactFlow>
              </div>

              {/* Leyenda */}
              <div className="mt-4 flex flex-wrap gap-3">
                {(Object.keys(courseTypeLabels) as CourseData['type'][]).map(key => (
                  <div key={key} className="flex items-center gap-2 text-xs bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${courseTypeColors[key]}`}></div>
                    <span className="text-gray-300">{courseTypeLabels[key]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel lateral de información */}
            {selectedCourse && (
              <aside className="w-[360px] shrink-0 bg-[#1a1a1a]/50 backdrop-blur-md rounded-3xl border border-[#FFD700]/20 shadow-xl p-6 flex flex-col gap-5 h-fit sticky top-8">
                <header>
                  <h2 className="text-xl font-bold text-[#FFD700] leading-snug">{selectedCourse.label}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${courseTypeColors[selectedCourse.type]} text-white`}>
                      {courseTypeLabels[selectedCourse.type]}
                    </span>
                  </div>
                </header>

                <section className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Código</span>
                    <span className="font-mono">{selectedCourse.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Créditos</span>
                    <span>{selectedCourse.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ciclo</span>
                    <span>{selectedCourse.cycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo</span>
                    <span>{courseTypeLabels[selectedCourse.type]}</span>
                  </div>
                </section>

                <div className="text-[11px] text-gray-400 leading-relaxed border-t border-[#FFD700]/10 pt-3">
                  Información basada en la malla curricular oficial de Ingeniería Metalúrgica UNSAAC. 
                  Los prerrequisitos y conexiones se muestran mediante las líneas de conexión.
                </div>

                <button 
                  onClick={() => setSelectedCourse(null)} 
                  className="mt-1 text-xs self-start px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-[#FFD700] transition"
                >
                  Cerrar
                </button>
              </aside>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cursos;
