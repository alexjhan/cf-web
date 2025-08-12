import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant
} from '@xyflow/react';
import type {
  Node,
  Edge,
  NodeProps,
  Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Definición de tipos
interface CourseData {
  id: string;
  code: string;
  name: string;
  credits: number;
  cycle: number;
  type: 'Formación General' | 'Formación Básica' | 'Formación Especializada' | 'Optativo';
  prerequisites?: string[];
  teachers?: string[];
  schedule?: string;
  syllabus?: string;
  competencies?: string[];
}

// Datos de cursos basados en la malla curricular oficial
const coursesData: CourseData[] = [
  // CICLO I
  { id: '1', code: 'MA101', name: 'Matemática Básica', credits: 5, cycle: 1, type: 'Formación General', teachers: ['Dr. Carlos Mendoza'], schedule: 'L-V 08:00-10:00' },
  { id: '2', code: 'FI101', name: 'Física I', credits: 4, cycle: 1, type: 'Formación General', teachers: ['Mg. Ana Torres'], schedule: 'M-J 10:00-12:00' },
  { id: '3', code: 'QU101', name: 'Química General', credits: 4, cycle: 1, type: 'Formación General', teachers: ['Dr. Luis Vargas'], schedule: 'L-V 14:00-16:00' },
  { id: '4', code: 'IN101', name: 'Introducción a la Ingeniería', credits: 3, cycle: 1, type: 'Formación General', teachers: ['Ing. María López'], schedule: 'S 08:00-11:00' },
  { id: '5', code: 'CO101', name: 'Comunicación', credits: 3, cycle: 1, type: 'Formación General', teachers: ['Lic. Pedro Quispe'], schedule: 'M-J 16:00-17:30' },
  { id: '6', code: 'PS101', name: 'Psicología General', credits: 2, cycle: 1, type: 'Formación General', teachers: ['Psic. Rosa Huamán'], schedule: 'V 08:00-10:00' },
  
  // CICLO II
  { id: '7', code: 'MA201', name: 'Cálculo I', credits: 5, cycle: 2, type: 'Formación General', prerequisites: ['MA101'], teachers: ['Dr. Jorge Silva'], schedule: 'L-V 08:00-10:00' },
  { id: '8', code: 'FI201', name: 'Física II', credits: 4, cycle: 2, type: 'Formación General', prerequisites: ['FI101'], teachers: ['Mg. Elena Castro'], schedule: 'M-J 10:00-12:00' },
  { id: '9', code: 'QU201', name: 'Química Inorgánica', credits: 4, cycle: 2, type: 'Formación Básica', prerequisites: ['QU101'], teachers: ['Dr. Roberto Flores'], schedule: 'L-V 14:00-16:00' },
  { id: '10', code: 'DI201', name: 'Dibujo de Ingeniería', credits: 3, cycle: 2, type: 'Formación Básica', teachers: ['Arq. Carmen Ruiz'], schedule: 'S 08:00-11:00' },
  { id: '11', code: 'FI201L', name: 'Filosofía', credits: 3, cycle: 2, type: 'Formación General', teachers: ['Dr. Antonio Vega'], schedule: 'M-J 16:00-17:30' },
  { id: '12', code: 'ED201', name: 'Educación Física', credits: 2, cycle: 2, type: 'Formación General', teachers: ['Prof. Miguel Sánchez'], schedule: 'V 08:00-10:00' },

  // CICLO III
  { id: '13', code: 'MA301', name: 'Cálculo II', credits: 5, cycle: 3, type: 'Formación General', prerequisites: ['MA201'], teachers: ['Dr. Patricia Morales'], schedule: 'L-V 08:00-10:00' },
  { id: '14', code: 'FI301', name: 'Física III', credits: 4, cycle: 3, type: 'Formación General', prerequisites: ['FI201'], teachers: ['Dr. Fernando García'], schedule: 'M-J 10:00-12:00' },
  { id: '15', code: 'QU301', name: 'Química Orgánica', credits: 4, cycle: 3, type: 'Formación Básica', prerequisites: ['QU201'], teachers: ['Dra. Sofía Herrera'], schedule: 'L-V 14:00-16:00' },
  { id: '16', code: 'ME301', name: 'Mecánica Racional', credits: 4, cycle: 3, type: 'Formación Básica', prerequisites: ['FI201', 'MA201'], teachers: ['Dr. Alberto Ramírez'], schedule: 'M-J 14:00-16:00' },
  { id: '17', code: 'GE301', name: 'Geometría Descriptiva', credits: 3, cycle: 3, type: 'Formación Básica', prerequisites: ['DI201'], teachers: ['Ing. Lucía Campos'], schedule: 'S 08:00-11:00' },
  { id: '18', code: 'SO301', name: 'Sociología', credits: 2, cycle: 3, type: 'Formación General', teachers: ['Mg. Oscar Medina'], schedule: 'V 16:00-18:00' },

  // CICLO IV
  { id: '19', code: 'MA401', name: 'Cálculo III', credits: 5, cycle: 4, type: 'Formación General', prerequisites: ['MA301'], teachers: ['Dr. Ricardo Delgado'], schedule: 'L-V 08:00-10:00' },
  { id: '20', code: 'ES401', name: 'Estadística y Probabilidades', credits: 4, cycle: 4, type: 'Formación General', prerequisites: ['MA301'], teachers: ['Mg. Beatriz Aguilar'], schedule: 'M-J 10:00-12:00' },
  { id: '21', code: 'QU401', name: 'Fisicoquímica', credits: 4, cycle: 4, type: 'Formación Básica', prerequisites: ['QU301', 'FI301'], teachers: ['Dr. Alejandro Paz'], schedule: 'L-V 14:00-16:00' },
  { id: '22', code: 'ME401', name: 'Resistencia de Materiales I', credits: 4, cycle: 4, type: 'Formación Básica', prerequisites: ['ME301'], teachers: ['Ing. Gloria Núñez'], schedule: 'M-J 14:00-16:00' },
  { id: '23', code: 'MT401', name: 'Cristalografía y Mineralogía', credits: 4, cycle: 4, type: 'Formación Especializada', prerequisites: ['QU201'], teachers: ['Dr. Víctor Chávez'], schedule: 'L-M 16:00-18:00' },
  { id: '24', code: 'EC401', name: 'Economía General', credits: 3, cycle: 4, type: 'Formación General', teachers: ['Econ. Nelly Paredes'], schedule: 'S 08:00-11:00' },

  // CICLO V
  { id: '25', code: 'MA501', name: 'Ecuaciones Diferenciales', credits: 4, cycle: 5, type: 'Formación Básica', prerequisites: ['MA401'], teachers: ['Dr. Raúl Jiménez'], schedule: 'M-J 08:00-10:00' },
  { id: '26', code: 'MT501', name: 'Ciencia de Materiales', credits: 4, cycle: 5, type: 'Formación Especializada', prerequisites: ['MT401', 'QU401'], teachers: ['Dr. Andrés Rojas'], schedule: 'L-V 10:00-12:00' },
  { id: '27', code: 'ME501', name: 'Resistencia de Materiales II', credits: 4, cycle: 5, type: 'Formación Básica', prerequisites: ['ME401'], teachers: ['Ing. Sandra Vilca'], schedule: 'M-J 14:00-16:00' },
  { id: '28', code: 'TE501', name: 'Termodinámica', credits: 4, cycle: 5, type: 'Formación Básica', prerequisites: ['FI301', 'MA301'], teachers: ['Dr. Héctor Ordóñez'], schedule: 'L-V 14:00-16:00' },
  { id: '29', code: 'MT502', name: 'Metalografía', credits: 4, cycle: 5, type: 'Formación Especializada', prerequisites: ['MT501'], teachers: ['Mg. Isabel Contreras'], schedule: 'M-J 16:00-18:00' },
  { id: '30', code: 'GE501', name: 'Geología General', credits: 3, cycle: 5, type: 'Formación Básica', teachers: ['Geol. Manuel Espinoza'], schedule: 'S 08:00-11:00' },

  // CICLO VI
  { id: '31', code: 'MT601', name: 'Metalurgia Física', credits: 4, cycle: 6, type: 'Formación Especializada', prerequisites: ['MT502'], teachers: ['Dr. César Molina'], schedule: 'L-V 08:00-10:00' },
  { id: '32', code: 'MT602', name: 'Pirometalurgia I', credits: 4, cycle: 6, type: 'Formación Especializada', prerequisites: ['TE501', 'MT501'], teachers: ['Dr. Diana Gutiérrez'], schedule: 'M-J 10:00-12:00' },
  { id: '33', code: 'MT603', name: 'Hidrometalurgia I', credits: 4, cycle: 6, type: 'Formación Especializada', prerequisites: ['QU401', 'MT501'], teachers: ['Ing. Pablo Mendoza'], schedule: 'L-V 14:00-16:00' },
  { id: '34', code: 'ME601', name: 'Máquinas Térmicas', credits: 4, cycle: 6, type: 'Formación Básica', prerequisites: ['TE501'], teachers: ['Ing. Mónica Salazar'], schedule: 'M-J 14:00-16:00' },
  { id: '35', code: 'EL601', name: 'Electrotecnia', credits: 3, cycle: 6, type: 'Formación Básica', prerequisites: ['FI301'], teachers: ['Ing. Tomás Rivera'], schedule: 'M-J 16:00-17:30' },
  { id: '36', code: 'AD601', name: 'Administración de Empresas', credits: 3, cycle: 6, type: 'Formación General', prerequisites: ['EC401'], teachers: ['MBA. Laura Castillo'], schedule: 'S 08:00-11:00' },

  // CICLO VII
  { id: '37', code: 'MT701', name: 'Pirometalurgia II', credits: 4, cycle: 7, type: 'Formación Especializada', prerequisites: ['MT602'], teachers: ['Dr. Francisco Valdez'], schedule: 'L-V 08:00-10:00' },
  { id: '38', code: 'MT702', name: 'Hidrometalurgia II', credits: 4, cycle: 7, type: 'Formación Especializada', prerequisites: ['MT603'], teachers: ['Dra. Claudia Moreno'], schedule: 'M-J 10:00-12:00' },
  { id: '39', code: 'MT703', name: 'Electrometalurgia', credits: 4, cycle: 7, type: 'Formación Especializada', prerequisites: ['EL601', 'MT603'], teachers: ['Dr. Javier Ramos'], schedule: 'L-V 14:00-16:00' },
  { id: '40', code: 'MT704', name: 'Fundición de Metales', credits: 4, cycle: 7, type: 'Formación Especializada', prerequisites: ['MT602'], teachers: ['Ing. Silvia Guerrero'], schedule: 'M-J 14:00-16:00' },
  { id: '41', code: 'IN701', name: 'Investigación de Operaciones', credits: 3, cycle: 7, type: 'Formación Básica', prerequisites: ['ES401'], teachers: ['Ing. Mario Lozano'], schedule: 'M-J 16:00-17:30' },
  { id: '42', code: 'AM701', name: 'Impacto Ambiental', credits: 3, cycle: 7, type: 'Formación General', teachers: ['Ing. Ambiental Rosa Fernández'], schedule: 'S 08:00-11:00' },

  // CICLO VIII
  { id: '43', code: 'MT801', name: 'Metalurgia de Procesos', credits: 4, cycle: 8, type: 'Formación Especializada', prerequisites: ['MT701', 'MT702'], teachers: ['Dr. Eduardo Santos'], schedule: 'L-V 08:00-10:00' },
  { id: '44', code: 'MT802', name: 'Refinación de Metales', credits: 4, cycle: 8, type: 'Formación Especializada', prerequisites: ['MT703'], teachers: ['Ing. Pilar Navarro'], schedule: 'M-J 10:00-12:00' },
  { id: '45', code: 'CO801', name: 'Control de Calidad', credits: 4, cycle: 8, type: 'Formación Especializada', prerequisites: ['ES401', 'MT601'], teachers: ['Ing. Rodrigo Cabrera'], schedule: 'L-V 14:00-16:00' },
  { id: '46', code: 'PL801', name: 'Planeamiento Minero', credits: 4, cycle: 8, type: 'Formación Especializada', prerequisites: ['GE501'], teachers: ['Ing. de Minas Carlos Vera'], schedule: 'M-J 14:00-16:00' },
  { id: '47', code: 'PR801', name: 'Formulación de Proyectos', credits: 3, cycle: 8, type: 'Formación General', prerequisites: ['AD601'], teachers: ['Ing. Económico Luz Pariona'], schedule: 'M-J 16:00-17:30' },

  // CICLO IX
  { id: '48', code: 'SE901', name: 'Seminario de Tesis I', credits: 2, cycle: 9, type: 'Formación Especializada', teachers: ['Dr. Comité de Investigación'], schedule: 'V 14:00-16:00' },
  { id: '49', code: 'PR901', name: 'Prácticas Pre-Profesionales', credits: 4, cycle: 9, type: 'Formación Especializada', teachers: ['Coordinador de Prácticas'], schedule: 'Tiempo completo' },
  { id: '50', code: 'OP901', name: 'Curso Optativo I', credits: 3, cycle: 9, type: 'Optativo', teachers: ['Varios docentes'], schedule: 'Por definir' },
  { id: '51', code: 'OP902', name: 'Curso Optativo II', credits: 3, cycle: 9, type: 'Optativo', teachers: ['Varios docentes'], schedule: 'Por definir' },

  // CICLO X
  { id: '52', code: 'SE1001', name: 'Seminario de Tesis II', credits: 4, cycle: 10, type: 'Formación Especializada', prerequisites: ['SE901'], teachers: ['Dr. Comité de Investigación'], schedule: 'V 14:00-18:00' },
];

// Componente de nodo personalizado
const CourseNodeComponent: React.FC<NodeProps> = ({ data }) => {
  const courseData = data as {
    code: string;
    name: string;
    credits: number;
    onClick: () => void;
  };
  
  return (
    <button 
      className="w-44 h-auto p-3 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-lg text-white text-xs font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-golden/20 focus:outline-none focus:ring-2 focus:ring-golden/50"
      onClick={courseData.onClick}
    >
      <div className="space-y-1">
        <div className="text-golden font-bold">{courseData.code}</div>
        <div className="text-gray-200 leading-tight">{courseData.name}</div>
        <div className="text-gray-400 text-xs">{courseData.credits} créditos</div>
      </div>
    </button>
  );
};

// Función para obtener descripción del curso
const getCourseDescription = (course: CourseData): string => {
  const descriptions: { [key: string]: string } = {
    'MA101': 'Fundamentos matemáticos esenciales para ingeniería, incluyendo álgebra, trigonometría y geometría analítica.',
    'FI101': 'Principios fundamentales de la física mecánica, cinemática, dinámica y estática.',
    'QU101': 'Conceptos básicos de química general, estructura atómica, enlaces químicos y reacciones.',
    'IN101': 'Introducción a las disciplinas de ingeniería, metodología y ética profesional.',
    'CO101': 'Desarrollo de habilidades de comunicación oral y escrita para profesionales.',
    'PS101': 'Fundamentos de psicología aplicada al ámbito profesional y personal.',
    'MA201': 'Cálculo diferencial e integral de funciones de una variable real.',
    'FI201': 'Electromagnetismo, ondas, óptica y física moderna básica.',
    'QU201': 'Química de los elementos y compuestos inorgánicos, propiedades y aplicaciones.',
    'DI201': 'Técnicas de representación gráfica y dibujo técnico para ingeniería.',
    'FI201L': 'Fundamentos del pensamiento filosófico y su aplicación en ingeniería.',
    'ED201': 'Actividades físicas y deportivas para el desarrollo integral.',
    'MA301': 'Cálculo de funciones de varias variables, integrales múltiples y series.',
    'FI301': 'Mecánica de fluidos, termodinámica básica y transferencia de calor.',
    'QU301': 'Química de compuestos orgánicos, estructura, propiedades y reacciones.',
    'ME301': 'Principios de mecánica clásica, cinemática y dinámica de sistemas.',
    'GE301': 'Representación tridimensional y proyecciones geométricas.',
    'SO301': 'Análisis de la estructura y funcionamiento de la sociedad.',
    'MA401': 'Ecuaciones diferenciales, series de Fourier y transformadas.',
    'ES401': 'Estadística descriptiva e inferencial, probabilidades y aplicaciones.',
    'QU401': 'Principios fisicoquímicos, termodinámica química y cinética.',
    'ME401': 'Análisis de esfuerzos y deformaciones en elementos estructurales.',
    'MT401': 'Estudio de la estructura cristalina y propiedades de minerales.',
    'EC401': 'Principios económicos básicos, microeconomía y macroeconomía.',
    'MA501': 'Resolución de ecuaciones diferenciales ordinarias y parciales.',
    'MT501': 'Propiedades, estructura y comportamiento de materiales de ingeniería.',
    'ME501': 'Análisis avanzado de esfuerzos, deflexiones y estabilidad.',
    'TE501': 'Leyes de la termodinámica y sus aplicaciones en ingeniería.',
    'MT502': 'Técnicas de análisis microestructural de materiales metálicos.',
    'GE501': 'Fundamentos de geología, minerales, rocas y procesos geológicos.',
    'MT601': 'Propiedades físicas de metales y aleaciones, diagramas de fase.',
    'MT602': 'Procesos pirometalúrgicos para extracción y refinación de metales.',
    'MT603': 'Procesos hidrometalúrgicos para extracción y refinación de metales.',
    'ME601': 'Máquinas térmicas, ciclos termodinámicos y eficiencia energética.',
    'EL601': 'Principios de electricidad, circuitos y máquinas eléctricas.',
    'AD601': 'Fundamentos de administración, planificación y gestión empresarial.',
    'MT701': 'Procesos pirometalúrgicos avanzados y optimización de hornos.',
    'MT702': 'Técnicas avanzadas de lixiviación y purificación hidrometalúrgica.',
    'MT703': 'Procesos electroquímicos para refinación y obtención de metales.',
    'MT704': 'Tecnología de fundición, moldeo y colada de metales.',
    'IN701': 'Métodos cuantitativos para optimización de procesos industriales.',
    'AM701': 'Evaluación y mitigación del impacto ambiental en procesos metalúrgicos.',
    'MT801': 'Integración y optimización de procesos metalúrgicos completos.',
    'MT802': 'Técnicas de refinación final y purificación de metales.',
    'CO801': 'Sistemas de calidad, control estadístico y mejora continua.',
    'PL801': 'Planificación y diseño de operaciones mineras.',
    'PR801': 'Metodología para formulación y evaluación de proyectos.',
    'SE901': 'Introducción a la investigación científica y metodología de tesis.',
    'PR901': 'Experiencia práctica en empresas del sector metalúrgico.',
    'OP901': 'Cursos especializados según intereses del estudiante.',
    'OP902': 'Cursos especializados según intereses del estudiante.',
    'SE1001': 'Desarrollo y defensa de proyecto de tesis de grado.'
  };
  return descriptions[course.code] || 'Descripción no disponible.';
};

// Función para obtener docentes del curso
const getCourseTeachers = (course: CourseData): string[] => {
  return course.teachers || ['Por asignar'];
};

// Función para obtener horario del curso
const getCourseSchedule = (course: CourseData): string => {
  return course.schedule || 'Por definir';
};

// Función para obtener competencias del curso
const getCourseCompetencies = (course: CourseData): string[] => {
  const competencies: { [key: string]: string[] } = {
    'MA101': ['Resuelve problemas matemáticos básicos', 'Aplica conceptos algebraicos', 'Utiliza trigonometría'],
    'FI101': ['Comprende principios físicos básicos', 'Resuelve problemas de mecánica', 'Aplica leyes de Newton'],
    'QU101': ['Comprende estructura atómica', 'Identifica tipos de enlaces', 'Balancea ecuaciones químicas'],
    'MT501': ['Caracteriza materiales', 'Selecciona materiales apropiados', 'Evalúa propiedades mecánicas'],
    'MT601': ['Analiza diagramas de fase', 'Comprende transformaciones metalúrgicas', 'Diseña tratamientos térmicos'],
    'MT801': ['Optimiza procesos metalúrgicos', 'Integra operaciones unitarias', 'Evalúa eficiencia de procesos']
  };
  return competencies[course.code] || ['Competencias por definir'];
};

// Función para generar posiciones de nodos
const generateNodePositions = () => {
  const positions: { [key: number]: { x: number; y: number } } = {};
  const cyclePositions = [
    { x: 100, y: 50 },    // Ciclo 1
    { x: 300, y: 180 },   // Ciclo 2
    { x: 500, y: 310 },   // Ciclo 3
    { x: 700, y: 440 },   // Ciclo 4
    { x: 900, y: 570 },   // Ciclo 5
    { x: 1100, y: 50 },   // Ciclo 6
    { x: 1300, y: 180 },  // Ciclo 7
    { x: 1500, y: 310 },  // Ciclo 8
    { x: 1700, y: 440 },  // Ciclo 9
    { x: 1900, y: 570 }   // Ciclo 10
  ];

  coursesData.forEach((course) => {
    const cycleIndex = course.cycle - 1;
    const basePosition = cyclePositions[cycleIndex];
    const coursesInCycle = coursesData.filter(c => c.cycle === course.cycle);
    const courseIndexInCycle = coursesInCycle.findIndex(c => c.id === course.id);
    
    positions[parseInt(course.id)] = {
      x: basePosition.x,
      y: basePosition.y + (courseIndexInCycle * 80)
    };
  });

  return positions;
};

const Cursos: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  const nodePositions = generateNodePositions();

  const initialNodes: Node[] = coursesData.map((course) => ({
    id: course.id,
    type: 'custom',
    position: nodePositions[parseInt(course.id)],
    data: {
      code: course.code,
      name: course.name,
      credits: course.credits,
      onClick: () => {
        setSelectedCourse(course);
        setShowPanel(true);
      }
    },
  }));

  const initialEdges: Edge[] = [];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = {
    custom: CourseNodeComponent,
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden">
      {/* Header con badge */}
      <div className="relative z-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-golden via-yellow-500 to-golden rounded-full text-black font-bold text-sm">
              📚 Plan de Estudios
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Malla Curricular
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Plan de estudios oficial de Ingeniería Metalúrgica - UNSAAC
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 relative">
        {/* Fondo con efectos */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-black to-black"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-golden/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lead/10 rounded-full blur-3xl"></div>
        </div>

        {/* ReactFlow Container */}
        <div className="relative z-10 h-screen">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-transparent"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="opacity-20" />
            <Controls className="bg-gray-800 border-gray-600 text-white" />
            <MiniMap className="bg-gray-800 border-gray-600" nodeColor="#374151" />
          </ReactFlow>
        </div>

        {/* Panel lateral deslizante */}
        {showPanel && selectedCourse && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClosePanel}
            ></div>
            
            {/* Panel */}
            <div className="absolute right-0 top-0 h-full w-96 bg-gradient-to-b from-gray-900 to-black border-l border-gray-700 overflow-y-auto animate-slideInRight">
              <div className="p-6 space-y-6">
                {/* Header del panel */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-golden">{selectedCourse.code}</h3>
                    <h2 className="text-2xl font-bold text-white mt-1">{selectedCourse.name}</h2>
                  </div>
                  <button
                    onClick={handleClosePanel}
                    className="text-gray-400 hover:text-white text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Información básica */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-golden text-sm">Créditos</div>
                    <div className="text-white font-bold">{selectedCourse.credits}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-golden text-sm">Ciclo</div>
                    <div className="text-white font-bold">{selectedCourse.cycle}</div>
                  </div>
                </div>

                {/* Tipo de formación */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-golden font-bold mb-2">Tipo de Formación</h4>
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-golden to-yellow-500 text-black text-sm font-bold rounded-full">
                    {selectedCourse.type}
                  </span>
                </div>

                {/* Descripción */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-golden font-bold mb-2">Descripción</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {getCourseDescription(selectedCourse)}
                  </p>
                </div>

                {/* Docentes */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-golden font-bold mb-2">Docentes</h4>
                  <div className="space-y-2">
                    {getCourseTeachers(selectedCourse).map((teacher, index) => (
                      <div key={index} className="text-gray-300 text-sm">
                        👨‍🏫 {teacher}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Horario */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-golden font-bold mb-2">Horario</h4>
                  <p className="text-gray-300 text-sm">
                    🕐 {getCourseSchedule(selectedCourse)}
                  </p>
                </div>

                {/* Competencias */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-golden font-bold mb-2">Competencias</h4>
                  <div className="space-y-2">
                    {getCourseCompetencies(selectedCourse).map((competency, index) => (
                      <div key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="text-golden mr-2">•</span>
                        <span>{competency}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prerrequisitos */}
                {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-golden font-bold mb-2">Prerrequisitos</h4>
                    <div className="space-y-1">
                      {selectedCourse.prerequisites.map((prereq, index) => (
                        <div key={index} className="text-gray-300 text-sm">
                          📋 {prereq}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-20 bg-gradient-to-r from-black via-gray-900 to-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-golden font-bold mb-4">Universidad</h3>
              <p className="text-gray-300 text-sm">Universidad Nacional de San Antonio Abad del Cusco</p>
            </div>
            <div>
              <h3 className="text-golden font-bold mb-4">Facultad</h3>
              <p className="text-gray-300 text-sm">Facultad de Ingeniería Geológica, Minas y Metalúrgica</p>
            </div>
            <div>
              <h3 className="text-golden font-bold mb-4">Escuela Profesional</h3>
              <p className="text-gray-300 text-sm">Ingeniería Metalúrgica</p>
            </div>
            <div>
              <h3 className="text-golden font-bold mb-4">Contacto</h3>
              <p className="text-gray-300 text-sm">Ciudad Universitaria de Perayoc</p>
              <p className="text-gray-300 text-sm">Cusco, Perú</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 UNSAAC - Ingeniería Metalúrgica. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cursos;
