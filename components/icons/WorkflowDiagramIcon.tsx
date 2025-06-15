
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { TranslationKey } from '../../types';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export const WorkflowDiagramIcon: React.FC<SVGProps> = (props) => {
  const { t } = useLanguage();

  const boxWidth = 115;
  const boxHeight = 70; 
  const horizontalSpacing = 25;
  const verticalSpacing = 30; 
  const numberCircleRadius = 9;
  const numberFontSize = 9;
  const labelFontSize = 10;
  const svgPadding = 20;


  // S-flow layout coordinates
  const nodes = [
    { id: 'step1', labelKey: 'diagramStep1' as TranslationKey, x: svgPadding, y: svgPadding, number: 1 },
    { id: 'step2', labelKey: 'diagramStep2' as TranslationKey, x: svgPadding + boxWidth + horizontalSpacing, y: svgPadding, number: 2 },
    { id: 'step3', labelKey: 'diagramStep3' as TranslationKey, x: svgPadding + 2 * (boxWidth + horizontalSpacing), y: svgPadding, number: 3 },
    
    { id: 'step4', labelKey: 'diagramStep4' as TranslationKey, x: svgPadding + 2 * (boxWidth + horizontalSpacing), y: svgPadding + boxHeight + verticalSpacing, number: 4 },
    { id: 'step5', labelKey: 'diagramStep5' as TranslationKey, x: svgPadding + boxWidth + horizontalSpacing, y: svgPadding + boxHeight + verticalSpacing, number: 5 },
    { id: 'step6', labelKey: 'diagramStep6' as TranslationKey, x: svgPadding, y: svgPadding + boxHeight + verticalSpacing, number: 6 },
  ];

  const edges = [
    // Top row: L-R
    { from: nodes[0], to: nodes[1] }, 
    { from: nodes[1], to: nodes[2] }, 
    // Connection 3 -> 4 (Vertical)
    { 
      from: nodes[2], 
      to: nodes[3], 
      path: `M${nodes[2].x + boxWidth / 2},${nodes[2].y + boxHeight} L${nodes[3].x + boxWidth / 2},${nodes[3].y}`
    },
    // Bottom row: R-L
    { from: nodes[3], to: nodes[4] }, 
    { from: nodes[4], to: nodes[5] }, 
  ];

  const viewBoxWidth = 3 * boxWidth + 2 * horizontalSpacing + 2 * svgPadding;
  const viewBoxHeight = 2 * boxHeight + verticalSpacing + 2 * svgPadding;

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="workflow-diagram-title"
      aria-describedby="workflow-diagram-desc"
      {...props}
    >
      <title id="workflow-diagram-title">{t('howToUseDiagramTitle')}</title>
      <desc id="workflow-diagram-desc">
        {`${t('diagramStep1')}, then ${t('diagramStep2')}, then ${t('diagramStep3')}, then ${t('diagramStep4')}, then ${t('diagramStep5')}, finally ${t('diagramStep6')}.`}
      </desc>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10" // Increased for visibility
          markerHeight="7"
          refX="9" // Adjusted for better tip alignment (was 0, now 9 based on markerWidth 10)
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-accent, #0F766E)" />
        </marker>
      </defs>

      {/* Edges (Arrows) */}
      {edges.map((edge, index) => {
        const fromNode = edge.from;
        const toNode = edge.to;
        if (!fromNode || !toNode) return null;

        let d;
        if (edge.path) {
            d = edge.path;
        } else {
            let x1, y1, x2, y2;
            // Horizontal connections
            y1 = fromNode.y + boxHeight / 2;
            y2 = toNode.y + boxHeight / 2;
            if (fromNode.x < toNode.x) { // Left to Right (Top Row)
                x1 = fromNode.x + boxWidth;
                x2 = toNode.x;
            } else { // Right to Left (Bottom Row)
                x1 = fromNode.x;
                x2 = toNode.x + boxWidth;
            }
            d = `M${x1},${y1} L${x2},${y2}`;
        }
        
        return (
          <path
            key={`edge-${index}`}
            d={d}
            stroke="var(--text-accent, #0F766E)"
            strokeWidth="1.8"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        );
      })}

      {/* Nodes (Boxes and Text) */}
      {nodes.map((node) => (
        <g key={node.id}>
          <rect
            x={node.x}
            y={node.y}
            width={boxWidth}
            height={boxHeight}
            rx="8" 
            ry="8"
            fill="var(--bg-tertiary, #334155)"
            stroke="var(--text-accent, #0F766E)"
            strokeWidth="1.5"
          />
          {/* Step Number Background Circle */}
          <circle 
            cx={node.x + numberCircleRadius + 6} 
            cy={node.y + numberCircleRadius + 6} 
            r={numberCircleRadius}
            fill="var(--text-accent-active, #134E4A)"
          />
          {/* Step Number Text */}
          <text
            x={node.x + numberCircleRadius + 6}
            y={node.y + numberCircleRadius + 6}
            textAnchor="middle"
            dominantBaseline="central" 
            fill="var(--text-primary, #f1f5f9)"
            fontSize={numberFontSize}
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            {node.number}
          </text>
          
          {/* Step Label */}
          {t(node.labelKey).split('\n').map((line: string, i: number, arr: string[]) => {
            const lineHeight = labelFontSize + 3; // Estimated line height including some spacing
            const totalTextBlockHeight = arr.length * lineHeight - (arr.length > 1 ? 3 : 0); // Reduce spacing for last line
            
            const spaceForNumber = numberCircleRadius * 2 + 8; // Diameter + top margin + bit of space below number
            const availableVerticalSpaceForText = boxHeight - spaceForNumber - 5; // 5 is bottom padding
            
            const textBlockStartY = node.y + spaceForNumber + (availableVerticalSpaceForText - totalTextBlockHeight) / 2;
            
            const lineY = textBlockStartY + (i * lineHeight) + (lineHeight / 2) - (labelFontSize / 2.5); // Adjust for dominant-baseline

            return (
              <text
                key={`${node.id}-line-${i}`}
                x={node.x + boxWidth / 2}
                y={lineY}
                textAnchor="middle"
                dominantBaseline="middle" // Better for vertical centering of each line
                fill="var(--text-primary, #f1f5f9)"
                fontSize={labelFontSize}
                fontFamily="sans-serif"
                fontWeight="medium"
              >
                {line}
              </text>
            );
          })}
        </g>
      ))}
    </svg>
  );
};
