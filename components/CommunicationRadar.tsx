import {
  communicationDimensionIds,
  type CommunicationDimension,
  type CommunicationScores
} from "@/types/lab";

type CommunicationRadarProps = {
  scores: CommunicationScores;
  labels: Record<CommunicationDimension, string>;
};

const size = 320;
const center = size / 2;
const radius = 96;

function pointAt(index: number, value: number, distance = radius) {
  const angle = (-90 + index * (360 / communicationDimensionIds.length)) * (Math.PI / 180);
  const scaledDistance = distance * value;
  return {
    x: center + Math.cos(angle) * scaledDistance,
    y: center + Math.sin(angle) * scaledDistance
  };
}

function pointsFor(value: number) {
  return communicationDimensionIds
    .map((_, index) => {
      const point = pointAt(index, value);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

export default function CommunicationRadar({ scores, labels }: CommunicationRadarProps) {
  const scorePoints = communicationDimensionIds
    .map((dimension, index) => {
      const point = pointAt(index, scores[dimension] / 100);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="本轮互动六维雷达图"
      className="h-auto w-full max-w-[320px]"
    >
      {[0.2, 0.4, 0.6, 0.8, 1].map((level) => (
        <polygon
          key={level}
          points={pointsFor(level)}
          fill={level === 1 ? "rgba(255,255,255,0.025)" : "none"}
          stroke="rgba(238,240,255,0.14)"
          strokeWidth="1"
        />
      ))}

      {communicationDimensionIds.map((dimension, index) => {
        const endpoint = pointAt(index, 1);
        const labelPoint = pointAt(index, 1, radius + 33);
        const textAnchor = labelPoint.x < center - 10 ? "end" : labelPoint.x > center + 10 ? "start" : "middle";

        return (
          <g key={dimension}>
            <line
              x1={center}
              y1={center}
              x2={endpoint.x}
              y2={endpoint.y}
              stroke="rgba(238,240,255,0.14)"
              strokeWidth="1"
            />
            <text
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fill="var(--ink-soft)"
              fontSize="12"
              fontWeight="650"
            >
              {labels[dimension]}
            </text>
          </g>
        );
      })}

      <polygon
        points={scorePoints}
        fill="var(--persona-glow)"
        stroke="var(--persona-accent)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {communicationDimensionIds.map((dimension, index) => {
        const point = pointAt(index, scores[dimension] / 100);
        return (
          <circle
            key={dimension}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="var(--surface-solid)"
            stroke="var(--persona-accent)"
            strokeWidth="3"
          />
        );
      })}
    </svg>
  );
}
