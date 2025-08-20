import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import BackToHomeButton from '../../components/Shared/BackToHomeButton';
import { ReactFlow, Background, addEdge, useEdgesState, useNodesState, Handle, Position, MarkerType, BaseEdge } from '@xyflow/react';
import { nodes as importedNodes, edges as importedEdges } from './graphData';
import type { CourseData } from './graphData';
import { courseTypeColors, courseTypeLabels, nodeTypes, edgeTypes } from './graphVisuals';
import type { EdgeProps, ReactFlowInstance } from '@xyflow/react';
import type { NodeProps, Edge, Connection, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Los nodos y edges ahora se importan desde graphData.ts
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
// Fleha especial Estadística General -> Metodología de la Investigación (color distinto, trayecto armonizado)
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
  // Forzar todos los nodos a ser estáticos (draggable: false)
  const staticInitialNodes = importedNodes.map(n => ({ ...n, draggable: false }));
  const [nodes, setNodes, onNodesChange] = useNodesState(staticInitialNodes);

  // Siempre forzar draggable: false en cada update de nodos
  const setNodesStatic = (updater: any) => {
    setNodes((prev: Node[]) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      return updated.map((n: Node) => ({ ...n, draggable: false }));
    });
  };

  // Convertir markerEnd.type a MarkerType.ArrowClosed si es 'arrowclosed' y markerEnd es objeto
  const fixEdgeMarkerType = (edge: Edge): Edge => {
    if (
      edge.markerEnd &&
      typeof edge.markerEnd === 'object' &&
      'type' in edge.markerEnd &&
      edge.markerEnd.type === 'arrowclosed'
    ) {
      return {
        ...edge,
        markerEnd: {
          ...(edge.markerEnd as object),
          type: MarkerType.ArrowClosed
        }
      };
    }
    return edge;
  };
  const fixedEdges = importedEdges.map(fixEdgeMarkerType);
  const [edges, setEdges, onEdgesChange] = useEdgesState(fixedEdges);
  // Estado de selección para panel lateral
  const [cycleFilter, setCycleFilter] = useState<string>('Todos');
  const [typeFilter, setTypeFilter] = useState<string>('Todos');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  // Canvas size (se adapta al viewport; el contenido se escala con fitView para evitar overflow horizontal grande)
  const [graphSize, setGraphSize] = useState<{ width: number; height: number }>({
    width: (typeof window !== 'undefined' ? Math.max(900, window.innerWidth - 140) : 1200),
    height: 900
  });

  const cycles = ['Todos', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const types: (CourseData['type'] | 'Todos')[] = ['Todos', 'generales', 'especificos', 'obligatorios', 'electivo', 'practicas', 'extracurricular'];
  // Estado viewport para cálculos responsivos más estrictos
  const [viewport, setViewport] = useState<{ w: number; h: number }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1400,
    h: typeof window !== 'undefined' ? window.innerHeight : 900
  });

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((_e: any, node: Node) => {
    setNodesStatic((nds: Node[]) => nds.map((n: Node) => ({ ...n, selected: n.id === node.id })));
    setSelectedNode(node);
  }, []);

  // Restaurar filtros de ciclo y tipo
  const filteredNodes = useMemo(() => {
    let filtered = nodes;
    if (cycleFilter !== 'Todos') {
      filtered = filtered.filter((node: Node) => ((node.data as any).cycle === cycleFilter));
    }
    if (typeFilter !== 'Todos') {
      filtered = filtered.filter((node: Node) => ((node.data as any).type === typeFilter));
    }
    return filtered.map(n => ({ ...n, draggable: false }));
  }, [nodes, cycleFilter, typeFilter]);

  // Métricas para calcular tamaño dinámico (usamos las posiciones originales, NO modificamos distancias)
  const layoutMetrics = useMemo(() => {
    let maxX = 0; let maxY = 0;
    filteredNodes.forEach((n: Node) => {
      if (n.position.x > maxX) maxX = n.position.x;
      if (n.position.y > maxY) maxY = n.position.y;
    });
    return { maxX, maxY };
  }, [filteredNodes]);

  // Mostrar solo edges entre nodos filtrados
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

  // Responsive auto-fit on resize (debounced)
  const reactFlowInstanceRef = useRef<any>(null);
  useEffect(() => {
    let t: any;
    const handle = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        setViewport({ w: window.innerWidth, h: window.innerHeight });
        try { reactFlowInstanceRef.current?.fitView({ padding: 0.2, duration: 320 }); } catch {}
      }, 110);
    };
    window.addEventListener('resize', handle);
    return () => { clearTimeout(t); window.removeEventListener('resize', handle); };
  }, []);

  // Ajuste: reducimos SOLO el contenedor (no movemos nodos) y escalamos con fitView
  useEffect(() => {
    const nodeApproxWidth = 170;   // ancho estimado (ligeramente menor para permitir más reducción)
    const nodeApproxHeight = 100;  // alto estimado
    const padding = 110;           // margen adicional
    const widthNeeded = layoutMetrics.maxX + nodeApproxWidth + padding;
    const heightNeeded = layoutMetrics.maxY + nodeApproxHeight + padding;
    // Reducimos aún más el mínimo: el contenedor se hace más angosto y fitView escala todo
    const width = Math.min(widthNeeded, Math.max(480, viewport.w - 64));
    const headerReserve = 430; // reserva vertical
    const usableHeight = Math.max(400, viewport.h - headerReserve);
    const height = Math.min(Math.max(400, heightNeeded), usableHeight);
    setGraphSize({ width, height });
    requestAnimationFrame(() => {
      try { reactFlowInstanceRef.current?.fitView({ padding: 0.15, duration: 340 }); } catch {}
    });
  }, [layoutMetrics, viewport]);

  // Debug: mostrar edges y nodos filtrados en consola
  console.log('filteredNodes', filteredNodes);
  console.log('filteredEdges', filteredEdges);
  return (
  <div 
    className="min-h-screen text-white overflow-hidden relative"
    style={{ background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)' }}
  >
      <BackToHomeButton />
      {/* Fondo y partículas igual que en Carrera */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/3"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C9B037]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-[#FFD700]/6 rounded-full blur-2xl animate-pulse delay-500"></div>
        {/* Partículas flotantes responsive */}
        <div className="absolute top-16 md:top-20 left-6 md:left-10 w-2 md:w-3 h-2 md:h-3 bg-[#FFD700]/60 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-32 md:top-40 right-12 md:right-20 w-1.5 md:w-2 h-1.5 md:h-2 bg-[#C9B037]/70 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-24 md:bottom-32 left-12 md:left-20 w-3 md:w-4 h-3 md:h-4 bg-[#FFD700]/50 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-12 md:bottom-20 right-6 md:right-10 w-1.5 md:w-2 h-1.5 md:h-2 bg-[#B8860B]/80 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-48 md:top-60 left-1/3 w-2 md:w-3 h-2 md:h-3 bg-[#C9B037]/60 rounded-full animate-pulse delay-1200"></div>
        <div className="absolute bottom-48 md:bottom-60 right-1/3 w-1.5 md:w-2 h-1.5 md:h-2 bg-[#FFD700]/70 rounded-full animate-pulse delay-800"></div>
      </div>

      {/* Header épico responsivo */}
      <header className="relative py-8 md:py-16 px-4">
        <div className="relative max-w-6xl mx-auto">
          
          {/* Logo / Emoji en recuadro igual que Carrera */}
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-block mb-4 md:mb-6">
              <div className="bg-[#FFD700]/10 p-4 md:p-6 rounded-full border border-[#FFD700]/30 shadow-2xl hover:shadow-[#FFD700]/40 transition-all duration-500">
                <span className="text-4xl md:text-5xl lg:text-6xl">⚙️</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent tracking-wide mb-4 md:mb-6 leading-tight text-center">
            MALLA CURRICULAR
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-[#C9B037] font-medium tracking-wider max-w-3xl mx-auto mb-6 md:mb-10 text-center">
            Ingeniería Metalúrgica • Plan de Estudios Interactivo • {creditStats.total} Créditos
          </p>

          {/* Stats rápidas épicas - Responsive */}
          <div className="flex justify-center gap-4 md:gap-8 text-center mb-6 md:mb-10">
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">10</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Ciclos</div>
            </div>
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">{nodes.length}</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Cursos</div>
            </div>
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">{creditStats.total}</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Créditos</div>
            </div>
          </div>

          {/* Estadísticas por tipo de curso - Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6 max-w-5xl mx-auto mb-8 md:mb-12">
            {(['generales','especificos','obligatorios','electivo','practicas','extracurricular'] as CourseData['type'][]).map((type) => (
              <div key={type} className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all duration-500 cursor-pointer">
                <div className={`text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-[#FFD700] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 w-6 h-6 rounded-full bg-gradient-to-r ${courseTypeColors[type]}`}></div>
                <div className="text-base md:text-xl lg:text-2xl font-bold text-[#FFD700] group-hover:text-white transition-colors duration-300">{creditStats[type] || 0}</div>
                <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">{courseTypeLabels[type]}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 relative px-4 md:px-6 lg:px-8 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Contenedor flex para ReactFlow y panel lateral */}
          <div className="flex flex-col gap-6">
            
            {/* Área principal con ReactFlow */}
            <div className="flex-1 min-h-[600px] overflow-hidden rounded-2xl relative group">
              {/* Gradientes de indicación de scroll en pantallas pequeñas */}
              <div className="pointer-events-none absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-[#0a0a0a] to-transparent opacity-70 md:hidden" />
              <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-[#0a0a0a] to-transparent opacity-70 md:hidden" />
              <div className="bg-[#1a1a1a]/60 backdrop-blur-md rounded-2xl md:rounded-3xl border border-[#FFD700]/20 p-4 md:p-6 lg:p-8 shadow-2xl w-full overflow-hidden">
                
                {/* Filtros */}
                <div className="mb-6 space-y-4">
                  {/* Filtros responsivos: scroll horizontal en móvil */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#FFD700]/30 scrollbar-track-transparent -mx-2 px-2">
                    <span className="text-xs md:text-sm text-gray-400 self-center mr-2 min-w-max">Ciclo:</span>
                    {cycles.map(cycle => (
                      <button
                        key={cycle}
                        onClick={() => setCycleFilter(cycle)}
                        className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 min-w-max ${
                          cycleFilter === cycle 
                            ? 'bg-[#FFD700] text-black shadow-md shadow-[#FFD700]/25' 
                            : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#FFD700]/20 hover:text-[#FFD700]'
                        }`}
                      >
                        {cycle}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#FFD700]/30 scrollbar-track-transparent -mx-2 px-2">
                    <span className="text-xs md:text-sm text-gray-400 self-center mr-2 min-w-max">Tipo:</span>
                    {types.map(type => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 min-w-max ${
                          typeFilter === type 
                            ? 'bg-[#FFD700] text-black shadow-md shadow-[#FFD700]/25' 
                            : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#FFD700]/20 hover:text-[#FFD700]'
                        }`}
                      >
                        {type === 'Todos' ? 'Todos' : courseTypeLabels[type as CourseData['type']]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ReactFlow */}
                {/* Toolbar de zoom / autofit */}
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                  <button
                    onClick={() => { try { reactFlowInstanceRef.current?.fitView({ padding: 0.2, duration: 380 }); } catch {} }}
                    className="px-3 py-1.5 rounded-lg bg-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/30 transition font-semibold"
                  >Autofit</button>
                  <button
                    onClick={() => { try { reactFlowInstanceRef.current?.zoomIn({ duration: 200 }); } catch {} }}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-gray-200"
                  >+</button>
                  <button
                    onClick={() => { try { reactFlowInstanceRef.current?.zoomOut({ duration: 200 }); } catch {} }}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-gray-200"
                  >-</button>
                  <span className="ml-auto text-[10px] text-gray-400 hidden sm:inline">Arrastra para mover • Scroll / Pinch para zoom</span>
                </div>
                {/* ReactFlow */}
                {filteredNodes.length === 0 && (
                  <div className="mb-2 text-xs text-red-400 font-semibold">No hay nodos tras los filtros. (Ciclo={cycleFilter}, Tipo={typeFilter})</div>
                )}
  <div className="relative w-full" style={{ height: graphSize.height }}>
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
            fitViewOptions={{ padding: 0.12, includeHiddenNodes: true }}
            className="bg-[#0a0a0a]/40 rounded-xl border border-[#FFD700]/10"
            defaultViewport={{ x: 0, y: 0, zoom: 0.45 }}
            panOnDrag
            minZoom={0.3}
            maxZoom={1.5}
            onInit={(instance) => {
              reactFlowInstanceRef.current = instance;
              setTimeout(() => {
                try { instance.fitView({ padding: 0.12 }); } catch {}
              }, 50);
            }}
          >
                    {/* Controles y MiniMap removidos */}
                    <Background color="#3d3d3d" gap={24} size={2} />
                  </ReactFlow>
                </div>
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

            {/* Panel lateral de información del curso seleccionado */}
            {selectedNode && selectedNode.data && (
              <div
                className="fixed md:static top-0 right-0 z-50 w-full max-w-full sm:max-w-xs md:max-w-sm h-full md:h-auto bg-[#18181b] border-l md:border-l border-t-2 md:border-t-0 border-[#FFD700]/30 shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-4 animate-fade-in overflow-y-auto transition-all duration-300"
                style={{
                  borderLeft: '1px solid rgba(255, 215, 0, 0.18)',
                  borderTop: '2px solid rgba(255, 215, 0, 0.18)',
                  maxHeight: '100vh',
                  minHeight: '220px',
                  borderRadius: '0 0 1.5rem 1.5rem',
                }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-[#FFD700] text-2xl font-bold"
                  onClick={() => setSelectedNode(null)}
                  aria-label="Cerrar panel"
                >×</button>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📚</span>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFD700] break-words">{((selectedNode.data as unknown) as CourseData).label}</h2>
                </div>
                <div className="text-gray-300 text-xs sm:text-sm md:text-base">
                  <div><b>Código:</b> {((selectedNode.data as unknown) as CourseData).code}</div>
                  <div><b>Créditos:</b> {((selectedNode.data as unknown) as CourseData).credits}</div>
                  <div><b>Ciclo:</b> {((selectedNode.data as unknown) as CourseData).cycle}</div>
                  <div><b>Tipo:</b> {courseTypeLabels[((selectedNode.data as unknown) as CourseData).type]}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cursos;
