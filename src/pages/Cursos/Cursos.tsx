import React, { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, addEdge, useEdgesState, useNodesState, Handle, Position, MarkerType, BaseEdge } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
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
  'generales': 'from-yellow-400 to-yellow-500',        // Estudios Generales
  'especificos': 'from-indigo-400 to-indigo-600',      // Estudios Específicos (nuevo color diferenciado)
  'obligatorios': 'from-emerald-500 to-emerald-600',   // Especialidad Obligatorios
  'electivo': 'from-cyan-400 to-cyan-500',             // Electivos de especialidad
  'practicas': 'from-red-400 to-red-500',              // Prácticas
  'extracurricular': 'from-purple-500 to-fuchsia-600'  // Actividades extracurriculares
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
  <div className={`relative rounded-xl w-44 px-3 py-2 text-xs font-medium text-white shadow-xl border-2 ${selected ? 'border-[#FFD700]' : 'border-white/20'} bg-gradient-to-br ${colorClass} backdrop-blur-sm`}>
  {/* Handles superiores/inferiores conservados para futuras conexiones verticales */}
  <Handle type="target" position={Position.Top} style={{ background: '#333', width: 8, height: 8, border: '2px solid #fff' }} />
  <Handle id="l" type="target" position={Position.Left} style={{ background: '#333', width: 8, height: 8, border: '2px solid #fff' }} />
  <Handle id="r" type="source" position={Position.Right} style={{ background: '#333', width: 8, height: 8, border: '2px solid #fff' }} />
      
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

// Nodo de encabezado de ciclo para separar visualmente columnas
function CycleHeaderNode({ data }: NodeProps) {
  const d = data as any as CourseData;
  return (
    <div className="w-44 px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-[11px] font-bold tracking-wide text-center text-[#FFD700] uppercase shadow-inner backdrop-blur-sm">
      Ciclo {d.cycle}
    </div>
  );
}

// Edge personalizado para hacer que las flechas viajen por espacios vacíos (pasillo superior)
const LateralEdge: React.FC<EdgeProps> = (props) => {
  const { id, sourceX, sourceY, targetX, targetY, markerEnd, style } = props;
  const corridorY = 225; // Pasillo entre Estadística (y=140) y Cálculo II (y=240)
  // Trayectoria ortogonal armonizada:
  // 1. Pequeño avance horizontal desde el origen para despegar el trazo del borde del nodo.
  // 2. Descenso/ascenso vertical hasta el pasillo libre (entre Estadística y Cálculo II).
  // 3. Tramo horizontal principal.
  // 4. Aproximación vertical antes de tocar el nodo destino (a la izquierda de su borde).
  // 5. Entrada horizontal corta hacia el handle izquierdo del nodo destino.

  const initialOffset = 25; // avance lateral inicial (reducido)
  const approachOffset = 28; // distancia lateral antes de entrar al destino (reducido)

  const dir = sourceX < targetX ? 1 : -1; // dirección horizontal (si alguna vez hay edges inversas)
  const xStart = sourceX + dir * initialOffset;
  const xBeforeTarget = targetX - dir * approachOffset; // punto vertical antes de entrar al nodo

  const path = [
    `M ${sourceX} ${sourceY}`,
    `L ${xStart} ${sourceY}`,
    `L ${xStart} ${corridorY}`,
    `L ${xBeforeTarget} ${corridorY}`,
    `L ${xBeforeTarget} ${targetY}`,
    `L ${targetX} ${targetY}`
  ].join(' ');
  return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ ...style, fill: 'none' }} />;
};

// Edge para corredor medio entre Conformados (y=340) y Pensamiento (y=440)
const MidCorridorEdge: React.FC<EdgeProps> = (props) => {
  const { id, sourceX, sourceY, targetX, targetY, markerEnd, style } = props;
  const corridorY = 425; // centro de ese espacio
  const initialOffset = 25;
  const approachOffset = 18;
  const dir = sourceX < targetX ? 1 : -1;
  const xStart = sourceX + dir * initialOffset;
  const xBeforeTarget = targetX - dir * approachOffset;
  const path = [
    `M ${sourceX} ${sourceY}`,
    `L ${xStart} ${sourceY}`,
    `L ${xStart} ${corridorY}`,
    `L ${xBeforeTarget} ${corridorY}`,
    `L ${xBeforeTarget} ${targetY}`,
    `L ${targetX} ${targetY}`
  ].join(' ');
  return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ ...style, fill: 'none' }} />;
};

const nodeTypes = { courseNode: CourseNode, cycleHeader: CycleHeaderNode };
// Edge genérico que calcula un corredor medio entre source y target para armonizar trazos verticales
const VerticalCorridorEdge: React.FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, markerEnd, style }) => {
  const initialOffset = 20;
  const approachOffset = 14;
  const dir = sourceX < targetX ? 1 : -1;
  const corridorY = sourceY + (targetY - sourceY) / 2; // punto medio vertical
  const xStart = sourceX + dir * initialOffset;
  const xBeforeTarget = targetX - dir * approachOffset;
  const path = [
    `M ${sourceX} ${sourceY}`,
    `L ${xStart} ${sourceY}`,
    `L ${xStart} ${corridorY}`,
    `L ${xBeforeTarget} ${corridorY}`,
    `L ${xBeforeTarget} ${targetY}`,
    `L ${targetX} ${targetY}`
  ].join(' ');
  return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ ...style, fill: 'none' }} />;
};

// Edge simple: sale horizontal, baja (o sube) directamente hasta la altura del destino y luego entra horizontal.
const ExitDownEdge: React.FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, markerEnd, style }) => {
  const initialOffset = 25;
  const dir = sourceX < targetX ? 1 : -1;
  const xMid = sourceX + dir * initialOffset;
  const path = [
    `M ${sourceX} ${sourceY}`,
    `L ${xMid} ${sourceY}`,
    `L ${xMid} ${targetY}`,
    `L ${targetX} ${targetY}`
  ].join(' ');
  return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ ...style, fill: 'none' }} />;
};

const edgeTypes = { lateral: LateralEdge, midcorridor: MidCorridorEdge, verticalcorridor: VerticalCorridorEdge, exitdown: ExitDownEdge };

// Malla curricular actualizada (sin flechas / prerrequisitos, solo datos oficiales proporcionados)
// Distribución horizontal por ciclo (x) y vertical por orden (y)
const initialNodes: Node[] = [
  // ENCABEZADOS DE CICLO
  { id: 'hdr-c1', position: { x: 40, y: 0 }, data: { label: 'Ciclo I', code: '', credits: 0, cycle: 'I', type: 'generales' }, type: 'cycleHeader', selectable: false, draggable: false },
  { id: 'hdr-c2', position: { x: 270, y: 0 }, data: { label: 'Ciclo II', code: '', credits: 0, cycle: 'II', type: 'generales' }, type: 'cycleHeader', selectable: false, draggable: false },
  { id: 'hdr-c3', position: { x: 500, y: 0 }, data: { label: 'Ciclo III', code: '', credits: 0, cycle: 'III', type: 'generales' }, type: 'cycleHeader', selectable: false, draggable: false },
  { id: 'hdr-c4', position: { x: 730, y: 0 }, data: { label: 'Ciclo IV', code: '', credits: 0, cycle: 'IV', type: 'generales' }, type: 'cycleHeader', selectable: false, draggable: false },
  { id: 'hdr-c5', position: { x: 960, y: 0 }, data: { label: 'Ciclo V', code: '', credits: 0, cycle: 'V', type: 'generales' }, type: 'cycleHeader', selectable: false, draggable: false },
  { id: 'hdr-c6', position: { x: 1190, y: 0 }, data: { label: 'Ciclo VI', code: '', credits: 0, cycle: 'VI', type: 'generales' }, type: 'cycleHeader', selectable: false, draggable: false },
  { id: 'hdr-c7', position: { x: 1420, y: 0 }, data: { label: 'Ciclo VII', code: '', credits: 0, cycle: 'VII', type: 'generales' }, type: 'cycleHeader', selectable: false, draggable: false },
  { id: 'hdr-c8', position: { x: 1650, y: 0 }, data: { label: 'Ciclo VIII', code: '', credits: 0, cycle: 'VIII', type: 'generales' }, type: 'cycleHeader', selectable: false, draggable: false },
  { id: 'hdr-c9', position: { x: 1880, y: 0 }, data: { label: 'Ciclo IX', code: '', credits: 0, cycle: 'IX', type: 'generales' }, type: 'cycleHeader', selectable: false, draggable: false },
  { id: 'hdr-c10', position: { x: 2110, y: 0 }, data: { label: 'Ciclo X', code: '', credits: 0, cycle: 'X', type: 'generales' }, type: 'cycleHeader', selectable: false, draggable: false },
  
  // CICLO I
  { id: 'c1-qui-gen', position: { x: 40, y: 40 }, data: { label: 'Química General', code: 'QU001AMT', credits: 4, cycle: 'I', type: 'generales' }, type: 'courseNode' },
  { id: 'c1-alg-geo', position: { x: 40, y: 140 }, data: { label: 'Álgebra y Geometría Analítica', code: 'ME001AMT', credits: 4, cycle: 'I', type: 'generales' }, type: 'courseNode' },
  { id: 'c1-cal-i', position: { x: 40, y: 240 }, data: { label: 'Cálculo I', code: 'MEG02AMT', credits: 4, cycle: 'I', type: 'generales' }, type: 'courseNode' },
  { id: 'c1-fis-i', position: { x: 40, y: 340 }, data: { label: 'Física I', code: 'FIG01AMT', credits: 4, cycle: 'I', type: 'generales' }, type: 'courseNode' },
  { id: 'c1-eco-med', position: { x: 40, y: 440 }, data: { label: 'Ecología y Medio Ambiente', code: 'MLG01AMT', credits: 3, cycle: 'I', type: 'generales' }, type: 'courseNode' },
  { id: 'c1-his-peru', position: { x: 40, y: 540 }, data: { label: 'Historia Cívica del Perú e Identidad Nacional', code: 'HIG01AMT', credits: 3, cycle: 'I', type: 'generales' }, type: 'courseNode' },

  // CICLO II
  { id: 'c2-met-gen', position: { x: 270, y: 40 }, data: { label: 'Metalurgia General', code: 'MLG02AMT', credits: 4, cycle: 'II', type: 'generales' }, type: 'courseNode' },
  { id: 'c2-estad-gen', position: { x: 270, y: 140 }, data: { label: 'Estadística General', code: 'MEG03AMT', credits: 4, cycle: 'II', type: 'generales' }, type: 'courseNode' },
  { id: 'c2-cal-ii', position: { x: 270, y: 240 }, data: { label: 'Cálculo II', code: 'MEG04AMT', credits: 4, cycle: 'II', type: 'generales' }, type: 'courseNode' },
  { id: 'c2-conf-met', position: { x: 270, y: 340 }, data: { label: 'Conformados de los Metales', code: 'MLG03AMT', credits: 3, cycle: 'II', type: 'generales' }, type: 'courseNode' },
  { id: 'c2-pc-ia', position: { x: 270, y: 440 }, data: { label: 'Pensamiento Computacional e Inteligencia Artificial', code: 'IFG01AMT', credits: 3, cycle: 'II', type: 'generales' }, type: 'courseNode' },
  { id: 'c2-ling-com', position: { x: 270, y: 540 }, data: { label: 'Lingüística y Comunicación Humana', code: 'LCG01AMT', credits: 3, cycle: 'II', type: 'generales' }, type: 'courseNode' },

  // CICLO III
  { id: 'c3-min-gen', position: { x: 500, y: 40 }, data: { label: 'Mineralogía General', code: 'GO951AMT', credits: 4, cycle: 'III', type: 'especificos' }, type: 'courseNode' },
  { id: 'c3-fqm-i', position: { x: 500, y: 140 }, data: { label: 'Físico Química Metalúrgica I', code: 'ML602AMT', credits: 4, cycle: 'III', type: 'especificos' }, type: 'courseNode' },
  { id: 'c3-met-qui', position: { x: 500, y: 240 }, data: { label: 'Metalurgia Química', code: 'ML610AMT', credits: 4, cycle: 'III', type: 'especificos' }, type: 'courseNode' },
  { id: 'c3-fis-ii', position: { x: 500, y: 340 }, data: { label: 'Fundamentos de Oscilaciones Ondas y Fluidos (FIS II)', code: 'FIG02AMT', credits: 4, cycle: 'III', type: 'especificos' }, type: 'courseNode' },
  { id: 'c3-geo-gen', position: { x: 500, y: 440 }, data: { label: 'Geología General', code: 'GO108AMT', credits: 3, cycle: 'III', type: 'especificos' }, type: 'courseNode' },
  { id: 'c3-elec-1', position: { x: 500, y: 540 }, data: { label: 'Estudio de especialidad electivo', code: 'NO EXISTE', credits: 3, cycle: 'III', type: 'electivo' }, type: 'courseNode' },
  { id: 'c3-elec-2', position: { x: 500, y: 640 }, data: { label: 'Estudio de especialidad electivo', code: 'NO EXISTE', credits: 3, cycle: 'III', type: 'electivo' }, type: 'courseNode' },

  // CICLO IV
  { id: 'c4-prep-min', position: { x: 730, y: 40 }, data: { label: 'Preparación Mecánica de Minerales', code: 'ML701AMT', credits: 4, cycle: 'IV', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c4-fun-ing-met', position: { x: 730, y: 140 }, data: { label: 'Fundamentos de Ingeniería Metalúrgica', code: 'ML801AMT', credits: 4, cycle: 'IV', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c4-fqm-ii', position: { x: 730, y: 240 }, data: { label: 'Físico Química Metalúrgica II', code: 'ML603AMT', credits: 4, cycle: 'IV', type: 'especificos' }, type: 'courseNode' },
  { id: 'c4-metod-inv', position: { x: 730, y: 340 }, data: { label: 'Metodología de la Investigación Metalúrgica', code: 'ML105AMT', credits: 3, cycle: 'IV', type: 'especificos' }, type: 'courseNode' },
  { id: 'c4-fis-iii', position: { x: 730, y: 440 }, data: { label: 'Fundamentos de electromagnetismo (FIS III)', code: 'FIG03AMT', credits: 4, cycle: 'IV', type: 'especificos' }, type: 'courseNode' },
  { id: 'c4-min-gen', position: { x: 730, y: 540 }, data: { label: 'Minería General', code: 'IM291AMT', credits: 3, cycle: 'IV', type: 'especificos' }, type: 'courseNode' },

  // CICLO V
  { id: 'c5-conc-min-i', position: { x: 960, y: 40 }, data: { label: 'Concentración de Minerales I', code: 'ML703AMT', credits: 4, cycle: 'V', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c5-trans-flu', position: { x: 960, y: 140 }, data: { label: 'Transporte de fluidos Plantas Metalúrgicas', code: 'ML107AMT', credits: 4, cycle: 'V', type: 'especificos' }, type: 'courseNode' },
  { id: 'c5-termo-met', position: { x: 960, y: 240 }, data: { label: 'Termodinámica Metalúrgica', code: 'ML604AMT', credits: 4, cycle: 'V', type: 'especificos' }, type: 'courseNode' },
  { id: 'c5-ana-qui', position: { x: 960, y: 340 }, data: { label: 'Análisis Químico e Instrumental', code: 'ML611AMT', credits: 4, cycle: 'V', type: 'especificos' }, type: 'courseNode' },
  { id: 'c5-mec-mat', position: { x: 960, y: 440 }, data: { label: 'Mecánica de Materiales', code: 'ML640AMT', credits: 3, cycle: 'V', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c5-ing-amb', position: { x: 960, y: 540 }, data: { label: 'Ing. Ambiental Metalúrgica', code: 'ML501AMT', credits: 3, cycle: 'V', type: 'especificos' }, type: 'courseNode' },

  // CICLO VI
  { id: 'c6-conc-min-ii', position: { x: 1190, y: 40 }, data: { label: 'Concentración de Minerales II', code: 'ML704AMT', credits: 4, cycle: 'VI', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c6-trans-cal-mat', position: { x: 1190, y: 140 }, data: { label: 'Transmisión de Calor y Materia en Procesos Metalúrgicos', code: 'ML110AMT', credits: 4, cycle: 'VI', type: 'especificos' }, type: 'courseNode' },
  { id: 'c6-dibujo-dis', position: { x: 1190, y: 240 }, data: { label: 'Dibujo y Diseño Metalúrgico', code: 'ML112AMT', credits: 4, cycle: 'VI', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c6-model-sim', position: { x: 1190, y: 340 }, data: { label: 'Modelamiento y Simulación de Procesos Metalúrgicos', code: 'ML111AMT', credits: 4, cycle: 'VI', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c6-cie-mat', position: { x: 1190, y: 440 }, data: { label: 'Ciencia de los Materiales', code: 'ML705AMT', credits: 4, cycle: 'VI', type: 'especificos' }, type: 'courseNode' },
  { id: 'c6-elec-1', position: { x: 1190, y: 540 }, data: { label: 'Estudio de Especialidad Electivo', code: 'NO EXISTE', credits: 3, cycle: 'VI', type: 'electivo' }, type: 'courseNode' },

  // CICLO VII
  { id: 'c7-piro-met', position: { x: 1420, y: 40 }, data: { label: 'Pirometalurgia', code: 'ML204AMT', credits: 4, cycle: 'VII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c7-sider', position: { x: 1420, y: 140 }, data: { label: 'Siderurgia', code: 'ML710AMT', credits: 4, cycle: 'VII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c7-cin-react', position: { x: 1420, y: 240 }, data: { label: 'Cinética y Diseño de Reactores Metalúrgicos', code: 'ML614/AMT', credits: 4, cycle: 'VII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c7-control-auto', position: { x: 1420, y: 340 }, data: { label: 'Control y Automatización de Procesos', code: 'ML724AMT', credits: 3, cycle: 'VII', type: 'especificos' }, type: 'courseNode' },
  { id: 'c7-seg-salud', position: { x: 1420, y: 440 }, data: { label: 'Seguridad y Salud en el Trabajo', code: 'ML502AMT', credits: 4, cycle: 'VII', type: 'especificos' }, type: 'courseNode' },
  { id: 'c7-elec-1', position: { x: 1420, y: 540 }, data: { label: 'Estudio de especialidad electivo', code: 'NO EXISTE', credits: 3, cycle: 'VII', type: 'electivo' }, type: 'courseNode' },

  // CICLO VIII
  { id: 'c8-hidro', position: { x: 1650, y: 40 }, data: { label: 'Hidrometalurgia', code: 'ML206AMT', credits: 4, cycle: 'VIII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c8-dis-exp', position: { x: 1650, y: 140 }, data: { label: 'Diseño Experimental Metalúrgico', code: 'ML702AMT', credits: 4, cycle: 'VIII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c8-met-fis', position: { x: 1650, y: 240 }, data: { label: 'Metalurgia Física', code: 'ML714AMT', credits: 5, cycle: 'VIII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c8-mecan-met', position: { x: 1650, y: 340 }, data: { label: 'Mecanización de Metales', code: 'ML711AMT', credits: 3, cycle: 'VIII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c8-gest-emp-met', position: { x: 1650, y: 440 }, data: { label: 'Gestión de Empresas Metalúrgicas', code: 'ML503AMT', credits: 3, cycle: 'VIII', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c8-elec-1', position: { x: 1650, y: 540 }, data: { label: 'Estudio de especialidad electivo', code: 'NO EXISTE', credits: 3, cycle: 'VIII', type: 'electivo' }, type: 'courseNode' },

  // CICLO IX
  { id: 'c9-electro', position: { x: 1880, y: 40 }, data: { label: 'Electrometalurgia', code: 'ML302AMT', credits: 4, cycle: 'IX', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c9-fund-mol', position: { x: 1880, y: 140 }, data: { label: 'Fundición y Moldeo', code: 'ML718AMT', credits: 4, cycle: 'IX', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c9-trat-term', position: { x: 1880, y: 240 }, data: { label: 'Tratamiento Térmicos', code: 'ML717AMT', credits: 4, cycle: 'IX', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c9-met-oro', position: { x: 1880, y: 340 }, data: { label: 'Metalurgia del Oro y la Plata', code: 'ML709AMT', credits: 3, cycle: 'IX', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c9-form-eval-proy', position: { x: 1880, y: 440 }, data: { label: 'Formulación y Evaluación de Proyectos Metalúrgicos', code: 'ML723AMT', credits: 4, cycle: 'IX', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c9-musica', position: { x: 1880, y: 540 }, data: { label: 'Música', code: 'ML013AMT', credits: 1, cycle: 'IX', type: 'extracurricular' }, type: 'courseNode' },

  // CICLO X
  { id: 'c10-corr-prot', position: { x: 2110, y: 40 }, data: { label: 'Corrosión y Protección de Metales', code: 'ML303AMT', credits: 4, cycle: 'X', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c10-joy-orf', position: { x: 2110, y: 140 }, data: { label: 'Joyería y Orfebrería', code: 'ML405AMT', credits: 1, cycle: 'X', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c10-soldadura', position: { x: 2110, y: 240 }, data: { label: 'Metalurgia de la Soldadura', code: 'ML719AMT', credits: 4, cycle: 'X', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c10-trab-inv', position: { x: 2110, y: 340 }, data: { label: 'Trabajo de Investigación', code: 'ML751/AMT', credits: 4, cycle: 'X', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c10-pract-pre', position: { x: 2110, y: 440 }, data: { label: 'Prácticas Pre Profesionales', code: 'ML701', credits: 3, cycle: 'X', type: 'practicas' }, type: 'courseNode' },
  { id: 'c10-dis-plant', position: { x: 2110, y: 540 }, data: { label: 'Diseño de Plantas Metalúrgicas', code: 'ML713AMT', credits: 4, cycle: 'X', type: 'obligatorios' }, type: 'courseNode' },
  { id: 'c10-edu-fis', position: { x: 2110, y: 640 }, data: { label: 'Educación Física', code: 'ML012AMT', credits: 1, cycle: 'X', type: 'extracurricular' }, type: 'courseNode' },
  { id: 'c10-elec-1', position: { x: 2110, y: 740 }, data: { label: 'Estudio de Especialidad Electivo', code: 'NO EXISTE', credits: 3, cycle: 'X', type: 'electivo' }, type: 'courseNode' },
];

// Conexiones entre cursos (prerrequisitos)
// Flechas laterales desde Química General -> Mineralogía General, FQM I, Metalurgia Química y Geología General
const initialEdges: Edge[] = [
  {
    id: 'e-qui-min',
    source: 'c1-qui-gen',
    sourceHandle: 'r',
    target: 'c3-min-gen',
    targetHandle: 'l',
  type: 'lateral',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 18, height: 18 },
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  {
    id: 'e-qui-fqm1',
    source: 'c1-qui-gen',
    sourceHandle: 'r',
    target: 'c3-fqm-i',
    targetHandle: 'l',
  type: 'lateral',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 18, height: 18 },
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  {
    id: 'e-qui-metqui',
    source: 'c1-qui-gen',
    sourceHandle: 'r',
    target: 'c3-met-qui',
    targetHandle: 'l',
  type: 'lateral',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 18, height: 18 },
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  {
    id: 'e-qui-geo',
    source: 'c1-qui-gen',
    sourceHandle: 'r',
    target: 'c3-geo-gen',
    targetHandle: 'l',
  type: 'lateral',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 18, height: 18 },
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  {
    id: 'e-cal1-cal2',
    source: 'c1-cal-i',
    sourceHandle: 'r',
    target: 'c2-cal-ii',
    targetHandle: 'l',
  type: 'straight',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 18, height: 18 },
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  {
    id: 'e-fis1-fis2',
    source: 'c1-fis-i',
    sourceHandle: 'r',
    target: 'c3-fis-ii',
    targetHandle: 'l',
    type: 'midcorridor',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6', width: 18, height: 18 },
    style: { stroke: '#3b82f6', strokeWidth: 2 }
  },
  // Nuevas flechas solicitadas
  // Aristas ciclo III -> ciclo IV armonizadas (salir, bajar/subir, entrar)
  {
    id: 'e-min-prep',
    source: 'c3-min-gen',
    sourceHandle: 'r',
    target: 'c4-prep-min',
    targetHandle: 'l',
    type: 'exitdown',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 },
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  {
    id: 'e-fqm1-fun-ing',
    source: 'c3-fqm-i',
    sourceHandle: 'r',
    target: 'c4-fun-ing-met',
    targetHandle: 'l',
    type: 'exitdown',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 },
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  {
    id: 'e-fqm1-fqm2',
    source: 'c3-fqm-i',
    sourceHandle: 'r',
    target: 'c4-fqm-ii',
    targetHandle: 'l',
    type: 'exitdown',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 },
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  {
    id: 'e-fis2-fis3',
    source: 'c3-fis-ii',
    sourceHandle: 'r',
    target: 'c4-fis-iii',
    targetHandle: 'l',
    type: 'exitdown',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 },
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  {
    id: 'e-geo-min',
    source: 'c3-geo-gen',
    sourceHandle: 'r',
    target: 'c4-min-gen',
    targetHandle: 'l',
    type: 'exitdown',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 },
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  }
  ,
  // Nuevas conexiones inter-ciclo solicitadas (configuración exitdown)
  // Ciclo IV -> V
  {
    id: 'e-prep-conc1',
    source: 'c4-prep-min', sourceHandle: 'r', target: 'c5-conc-min-i', targetHandle: 'l',
    type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  { id: 'e-fun-transflu', source: 'c4-fun-ing-met', sourceHandle: 'r', target: 'c5-trans-flu', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-fqm2-termo', source: 'c4-fqm-ii', sourceHandle: 'r', target: 'c5-termo-met', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-fqm2-ingamb', source: 'c4-fqm-ii', sourceHandle: 'r', target: 'c5-ing-amb', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-fis3-mecmat', source: 'c4-fis-iii', sourceHandle: 'r', target: 'c5-mec-mat', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  // Ciclo V -> VI
  { id: 'e-conc1-conc2', source: 'c5-conc-min-i', sourceHandle: 'r', target: 'c6-conc-min-ii', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-transflu-transcal', source: 'c5-trans-flu', sourceHandle: 'r', target: 'c6-trans-cal-mat', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-termo-model', source: 'c5-termo-met', sourceHandle: 'r', target: 'c6-model-sim', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-mecmat-cienmat', source: 'c5-mec-mat', sourceHandle: 'r', target: 'c6-cie-mat', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  // Ciclo VI -> VII
  { id: 'e-conc2-piro', source: 'c6-conc-min-ii', sourceHandle: 'r', target: 'c7-piro-met', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-transcal-sider', source: 'c6-trans-cal-mat', sourceHandle: 'r', target: 'c7-sider', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-transcal-cinreact', source: 'c6-trans-cal-mat', sourceHandle: 'r', target: 'c7-cin-react', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-model-control', source: 'c6-model-sim', sourceHandle: 'r', target: 'c7-control-auto', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  // Ciclo VII -> VIII
  { id: 'e-piro-hidro', source: 'c7-piro-met', sourceHandle: 'r', target: 'c8-hidro', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-seg-gest', source: 'c7-seg-salud', sourceHandle: 'r', target: 'c8-gest-emp-met', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  // Ciclo VIII -> IX
  { id: 'e-hidro-electro', source: 'c8-hidro', sourceHandle: 'r', target: 'c9-electro', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-hidro-oro', source: 'c8-hidro', sourceHandle: 'r', target: 'c9-met-oro', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-metfis-trat', source: 'c8-met-fis', sourceHandle: 'r', target: 'c9-trat-term', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6', width: 15, height: 15 }, style: { stroke: '#8b5cf6', strokeWidth: 2 } }, // color distinto
  { id: 'e-gest-formeval', source: 'c8-gest-emp-met', sourceHandle: 'r', target: 'c9-form-eval-proy', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  // Ciclo IX -> X
  { id: 'e-electro-corrosion', source: 'c9-electro', sourceHandle: 'r', target: 'c10-corr-prot', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-fundicion-joyeria', source: 'c9-fund-mol', sourceHandle: 'r', target: 'c10-joy-orf', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-trat-soldadura', source: 'c9-trat-term', sourceHandle: 'r', target: 'c10-soldadura', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-oro-trabinv', source: 'c9-met-oro', sourceHandle: 'r', target: 'c10-trab-inv', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-formeval-diseno', source: 'c9-form-eval-proy', sourceHandle: 'r', target: 'c10-dis-plant', targetHandle: 'l', type: 'exitdown', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } }
];
// Flecha especial Estadística General -> Metodología de la Investigación (color distinto, trayecto armonizado)
initialEdges.push({
  id: 'e-estad-metod',
  source: 'c2-estad-gen',
  sourceHandle: 'r',
  target: 'c4-metod-inv',
  targetHandle: 'l',
  type: 'verticalcorridor',
  markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899', width: 18, height: 18 },
  style: { stroke: '#ec4899', strokeWidth: 2 }
});

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
                  edgeTypes={edgeTypes}
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
