
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { TranslationKey } from '../../types';

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  'data-apikeyavailable'?: string;
}

export const WorkflowDiagramIcon: React.FC<SVGProps> = (props) => {
  const { t } = useLanguage();
  const apiKeyAvailable = props['data-apikeyavailable'] === 'true';

  const boxWidth = 125; // Slightly increased width
  const boxHeight = 65; // Slightly decreased height
  const horizontalSpacing = 20; // Reduced spacing
  const verticalSpacing = 25;
  const numberCircleRadius = 8;
  const numberFontSize = 8;
  const labelFontSize = 8.5; // Reduced for better fit
  const svgPadding = 15; // Reduced padding

  const step2LabelKey = apiKeyAvailable ? 'diagramStep2Premium' : 'diagramStep2Free';
  const step5LabelKey = apiKeyAvailable ? 'diagramStep5Premium' : 'diagramStep5Free';
  const step3LabelKey = apiKeyAvailable ? 'diagramStep3Premium' : 'diagramStep3Free';


  const nodes = [
    { id: 'step1', labelKey: 'diagramStep1' as TranslationKey, tooltipKey: 'howToUseStep1' as TranslationKey, x: svgPadding, y: svgPadding, number: 1 },
    { id: 'step2', labelKey: step2LabelKey as TranslationKey, tooltipKey: (apiKeyAvailable ? 'howToUseStep2Premium' : 'howToUseStep2Free') as TranslationKey, x: svgPadding + boxWidth + horizontalSpacing, y: svgPadding, number: 2 },
    { id: 'step3', labelKey: step3LabelKey as TranslationKey, tooltipKey: (apiKeyAvailable ? 'howToUseStep3Premium' : 'howToUseStep3Free') as TranslationKey, x: svgPadding + 2 * (boxWidth + horizontalSpacing), y: svgPadding, number: 3 },
    
    { id: 'step4', labelKey: 'diagramStep4' as TranslationKey, tooltipKey: 'howToUseStep4' as TranslationKey, x: svgPadding + 2 * (boxWidth + horizontalSpacing), y: svgPadding + boxHeight + verticalSpacing, number: 4 },
    { id: 'step5', labelKey: step5LabelKey as TranslationKey, tooltipKey: (apiKeyAvailable ? 'howToUseStep5Premium' : 'howToUseStep5Free') as TranslationKey, x: svgPadding + boxWidth + horizontalSpacing, y: svgPadding + boxHeight + verticalSpacing, number: 5 },
    { id: 'step6', labelKey: 'diagramStep6' as TranslationKey, tooltipKey: 'howToUseStep6' as TranslationKey, x: svgPadding, y: svgPadding + boxHeight + verticalSpacing, number: 6 },
  ];

  const edges = [
    { from: nodes[0], to: nodes[1] },
    { from: nodes[1], to: nodes[2] },
    {
      from: nodes[2],
      to: nodes[3],
      path: `M${nodes[2].x + boxWidth / 2},${nodes[2].y + boxHeight} L${nodes[3].x + boxWidth / 2},${nodes[3].y}`
    },
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
        {`${t(nodes[0].tooltipKey).replace(/\n/g, ' ')}, then ${t(nodes[1].tooltipKey).replace(/\n/g, ' ')}, then ${t(nodes[2].tooltipKey).replace(/\n/g, ' ')}, then ${t(nodes[3].tooltipKey).replace(/\n/g, ' ')}, then ${t(nodes[4].tooltipKey).replace(/\n/g, ' ')}, finally ${t(nodes[5].tooltipKey).replace(/\n/g, ' ')}.`}
      </desc>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8" // Slightly smaller
          markerHeight="5.6" // Adjusted ratio
          refX="7"
          refY="2.8"
          orient="auto"
        >
          <polygon points="0 0, 8 2.8, 0 5.6" fill="var(--text-accent, #0F766E)" />
        </marker>
      </defs>

      {edges.map((edge, index) => {
        const fromNode = edge.from;
        const toNode = edge.to;
        if (!fromNode || !toNode) return null;

        let d;
        if (edge.path) {
            d = edge.path;
        } else {
            let x1, y1, x2, y2;
            y1 = fromNode.y + boxHeight / 2;
            y2 = toNode.y + boxHeight / 2;
            if (fromNode.x < toNode.x) {
                x1 = fromNode.x + boxWidth;
                x2 = toNode.x;
            } else {
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
            strokeWidth="1.5" // Slightly thinner
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        );
      })}

      {nodes.map((node) => (
        <g key={node.id} role="group" aria-labelledby={`${node.id}-title`}>
          <title id={`${node.id}-title`}>{t(node.tooltipKey).replace(/\n/g, ' ')}</title>
          <rect
            x={node.x}
            y={node.y}
            width={boxWidth}
            height={boxHeight}
            rx="6"
            ry="6" // Slightly smaller radius
            fill="var(--bg-tertiary, #334155)"
            stroke="var(--text-accent, #0F766E)"
            strokeWidth="1.2" // Slightly thinner
          />
          <circle
            cx={node.x + numberCircleRadius + 5} // Adjusted position
            cy={node.y + numberCircleRadius + 5} // Adjusted position
            r={numberCircleRadius}
            fill="var(--text-accent-active, #134E4A)"
          />
          <text
            x={node.x + numberCircleRadius + 5} // Adjusted position
            y={node.y + numberCircleRadius + 5} // Adjusted position
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--text-primary, #f1f5f9)"
            fontSize={numberFontSize}
            fontFamily="sans-serif"
            fontWeight="bold"
            aria-hidden="true"
          >
            {node.number}
          </text>
          
          {t(node.labelKey).split('\n').map((line: string, i: number, arr: string[]) => {
            const lineHeight = labelFontSize + 2; // Adjusted line height
            const totalTextBlockHeight = arr.length * lineHeight;
            
            const textBlockStartY = node.y + (boxHeight - totalTextBlockHeight) / 2 + (labelFontSize / 2); // Centering logic
            const lineY = textBlockStartY + (i * lineHeight);

            return (
              <text
                key={`${node.id}-line-${i}`}
                x={node.x + boxWidth / 2}
                y={lineY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--text-primary, #f1f5f9)"
                fontSize={labelFontSize}
                fontFamily="sans-serif"
                fontWeight="medium" // Corrected typo from "medium---"
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
