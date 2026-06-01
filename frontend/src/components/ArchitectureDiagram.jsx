import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NODE_COLORS = {
  service: '#4a90d9',
  database: '#27ae60',
  gateway: '#8e44ad',
  cache: '#e67e22',
  queue: '#f1c40f',
  client: '#e74c3c',
  external: '#95a5a6',
};

const NODE_RADIUS = 28;

export default function ArchitectureDiagram({ nodes = [], edges = [] }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g');

    // Zoom behavior
    svg.call(
      d3.zoom().scaleExtent([0.3, 3]).on('zoom', (event) => {
        g.attr('transform', event.transform);
      })
    );

    // Simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(edges)
          .id((d) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(NODE_RADIUS + 10));

    // Draw edges
    const link = g
      .append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', (d) => (d.style === 'dashed' ? '5,5' : d.style === 'dotted' ? '2,2' : 'none'))
      .attr('marker-end', 'url(#arrowhead)');

    // Edge labels
    const linkLabel = g
      .append('g')
      .selectAll('text')
      .data(edges)
      .join('text')
      .text((d) => d.label)
      .attr('font-size', 10)
      .attr('fill', '#666')
      .attr('text-anchor', 'middle');

    // Draw nodes
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'grab')
      .call(
        d3
          .drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node circles
    node
      .append('circle')
      .attr('r', NODE_RADIUS)
      .attr('fill', (d) => NODE_COLORS[d.type] || '#95a5a6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Node labels
    node
      .append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', 10)
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .each(function (d) {
        const text = d3.select(this);
        const label = d.label;
        if (label.length > 12) {
          const words = label.split(/\s+/);
          const lines = [];
          let line = '';
          for (const word of words) {
            if ((line + ' ' + word).length > 12) {
              lines.push(line);
              line = word;
            } else {
              line = (line ? line + ' ' : '') + word;
            }
          }
          lines.push(line);
          text.text(null);
          lines.forEach((l, i) => {
            text
              .append('tspan')
              .text(l)
              .attr('x', 0)
              .attr('dy', i === 0 ? '-0.3em' : '1.1em');
          });
        }
      });

    // Tooltip
    node.append('title').text((d) => `${d.label}\nType: ${d.type}\nGroup: ${d.group || '-'}`);

    // Arrow marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', NODE_RADIUS + 6)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4 L8,0 L0,4')
      .attr('fill', '#999');

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      linkLabel
        .attr('x', (d) => (d.source.x + d.target.x) / 2)
        .attr('y', (d) => (d.source.y + d.target.y) / 2 - 8);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges]);

  if (nodes.length === 0) return null;

  return (
    <div className="diagram-section">
      <h3>Architecture Diagram</h3>
      <div className="legend">
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <span key={type} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: color }} />
            {type}
          </span>
        ))}
      </div>
      <div className="diagram-container">
        <svg ref={svgRef} width="100%" height={500} />
      </div>
    </div>
  );
}
