// Componentes visuales y tipos para el roadmap de cursos
import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { BaseEdge } from '@xyflow/react';
// Wrapper para edges tipo 'straight'
import type { EdgeProps } from '@xyflow/react';
const StraightEdge: React.FC<EdgeProps> = (props) => {
  const { id, sourceX, sourceY, targetX, targetY, markerEnd, style } = props;
  const path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ ...style, fill: 'none' }} />;
};
import type { CourseData } from './graphData';

export const courseTypeColors: Record<CourseData['type'], string> = {
  'generales': 'from-yellow-400 to-yellow-500',
  'especificos': 'from-indigo-400 to-indigo-600',
  'obligatorios': 'from-emerald-500 to-emerald-600',
  'electivo': 'from-cyan-400 to-cyan-500',
  'practicas': 'from-red-400 to-red-500',
  'extracurricular': 'from-purple-500 to-fuchsia-600'
};

export const courseTypeLabels: Record<CourseData['type'], string> = {
  'generales': 'Estudios Generales',
  'especificos': 'Estudios Específicos',
  'obligatorios': 'Estudios de Especialidad Obligatorios',
  'electivo': 'Estudios de Especialidad Electivos',
  'practicas': 'Prácticas',
  'extracurricular': 'Actividades Extracurriculares'
};

import { Handle, Position } from '@xyflow/react';
export function CourseNode({ data, selected }: NodeProps) {
  const courseData = data as unknown as CourseData;
  const colorClass = courseTypeColors[courseData.type] || 'from-gray-400 to-gray-500';
  return (
    <div className={`relative rounded-xl w-36 sm:w-40 md:w-44 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-white shadow-xl border-2 ${selected ? 'border-[#FFD700]' : 'border-white/20'} bg-gradient-to-br ${colorClass} backdrop-blur-sm transition-transform duration-200 hover:scale-[1.03]`}>
      {/* Sin handles visuales */}
      <div className="text-center space-y-1">
        <div className="font-bold text-[10px] bg-black/20 px-2 py-0.5 rounded-full">{courseData.code}</div>
        <div className="font-semibold leading-tight text-[11px] text-center">{courseData.label}</div>
        <div className="text-[10px] opacity-90">{courseData.credits} créditos • Ciclo {courseData.cycle}</div>
      </div>
    </div>
  );
}

export function CycleHeaderNode({ data }: NodeProps) {
  const d = data as any as CourseData;
  return (
    <div className="w-36 sm:w-40 md:w-44 px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-wide text-center text-[#FFD700] uppercase shadow-inner backdrop-blur-sm">
      Ciclo {d.cycle}
    </div>
  );
}

export const nodeTypes = { courseNode: CourseNode, cycleHeader: CycleHeaderNode };

export const LateralEdge: React.FC<EdgeProps> = (props) => {
  const { id, sourceX, sourceY, targetX, targetY, markerEnd, style } = props;
  const corridorY = 225;
  const initialOffset = 25;
  const approachOffset = 28;
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

export const MidCorridorEdge: React.FC<EdgeProps> = (props) => {
  const { id, sourceX, sourceY, targetX, targetY, markerEnd, style } = props;
  const corridorY = 425;
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

export const VerticalCorridorEdge: React.FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, markerEnd, style }) => {
  const initialOffset = 20;
  const approachOffset = 14;
  const dir = sourceX < targetX ? 1 : -1;
  const corridorY = sourceY + (targetY - sourceY) / 2;
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

export const ExitDownEdge: React.FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, markerEnd, style }) => {
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


export const edgeTypes = {
  lateral: LateralEdge,
  midcorridor: MidCorridorEdge,
  verticalcorridor: VerticalCorridorEdge,
  exitdown: ExitDownEdge,
  straight: StraightEdge // Soporte para edges tipo 'straight'
};
