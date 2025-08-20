
// Solo tipos y datos, sin componentes visuales
export interface CourseData {
	label: string;
	code: string;
	credits: number;
	cycle: string;
	type: 'generales' | 'especificos' | 'obligatorios' | 'electivo' | 'practicas' | 'extracurricular';
}
// Datos de nodos y edges para el roadmap de cursos
// Puedes editar este archivo para modificar el grafo

import type { Node, Edge } from '@xyflow/react';


export const nodes: Node[] = [
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

export const edges: Edge[] = [
		{ id: 'e-qui-min', source: 'c1-qui-gen', target: 'c3-min-gen', type: 'lateral', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 18, height: 18 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-qui-fqm1', source: 'c1-qui-gen', target: 'c3-fqm-i', type: 'lateral', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 18, height: 18 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-qui-metqui', source: 'c1-qui-gen', target: 'c3-met-qui', type: 'lateral', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 18, height: 18 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-qui-geo', source: 'c1-qui-gen', target: 'c3-geo-gen', type: 'lateral', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 18, height: 18 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-cal1-cal2', source: 'c1-cal-i', target: 'c2-cal-ii', type: 'straight', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 18, height: 18 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-fis1-fis2', source: 'c1-fis-i', target: 'c3-fis-ii', type: 'midcorridor', markerEnd: { type: 'arrowclosed', color: '#3b82f6', width: 18, height: 18 }, style: { stroke: '#3b82f6', strokeWidth: 2 } },
		{ id: 'e-min-prep', source: 'c3-min-gen', target: 'c4-prep-min', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-fqm1-fun-ing', source: 'c3-fqm-i', target: 'c4-fun-ing-met', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-fqm1-fqm2', source: 'c3-fqm-i', target: 'c4-fqm-ii', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-fis2-fis3', source: 'c3-fis-ii', target: 'c4-fis-iii', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-geo-min', source: 'c3-geo-gen', target: 'c4-min-gen', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-prep-conc1', source: 'c4-prep-min', target: 'c5-conc-min-i', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-fun-transflu', source: 'c4-fun-ing-met', target: 'c5-trans-flu', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-fqm2-termo', source: 'c4-fqm-ii', target: 'c5-termo-met', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-fqm2-ingamb', source: 'c4-fqm-ii', target: 'c5-ing-amb', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-fis3-mecmat', source: 'c4-fis-iii', target: 'c5-mec-mat', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-conc1-conc2', source: 'c5-conc-min-i', target: 'c6-conc-min-ii', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-transflu-transcal', source: 'c5-trans-flu', target: 'c6-trans-cal-mat', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-termo-model', source: 'c5-termo-met', target: 'c6-model-sim', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-mecmat-cienmat', source: 'c5-mec-mat', target: 'c6-cie-mat', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-conc2-piro', source: 'c6-conc-min-ii', target: 'c7-piro-met', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-transcal-sider', source: 'c6-trans-cal-mat', target: 'c7-sider', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-transcal-cinreact', source: 'c6-trans-cal-mat', target: 'c7-cin-react', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-model-control', source: 'c6-model-sim', target: 'c7-control-auto', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-piro-hidro', source: 'c7-piro-met', target: 'c8-hidro', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-seg-gest', source: 'c7-seg-salud', target: 'c8-gest-emp-met', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-hidro-electro', source: 'c8-hidro', target: 'c9-electro', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-hidro-oro', source: 'c8-hidro', target: 'c9-met-oro', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-metfis-trat', source: 'c8-met-fis', target: 'c9-trat-term', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#8b5cf6', width: 15, height: 15 }, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
		{ id: 'e-gest-formeval', source: 'c8-gest-emp-met', target: 'c9-form-eval-proy', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 15, height: 15 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-electro-corrosion', source: 'c9-electro', target: 'c10-corr-prot', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-fundicion-joyeria', source: 'c9-fund-mol', target: 'c10-joy-orf', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-trat-soldadura', source: 'c9-trat-term', target: 'c10-soldadura', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-oro-trabinv', source: 'c9-met-oro', target: 'c10-trab-inv', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		{ id: 'e-formeval-diseno', source: 'c9-form-eval-proy', target: 'c10-dis-plant', type: 'exitdown', markerEnd: { type: 'arrowclosed', color: '#f59e0b', width: 16, height: 16 }, style: { stroke: '#f59e0b', strokeWidth: 2 } },
		// Flecha especial Estadística General -> Metodología de la Investigación
		{ id: 'e-estad-metod', source: 'c2-estad-gen', target: 'c4-metod-inv', type: 'verticalcorridor', markerEnd: { type: 'arrowclosed', color: '#ec4899', width: 18, height: 18 }, style: { stroke: '#ec4899', strokeWidth: 2 } },
];
