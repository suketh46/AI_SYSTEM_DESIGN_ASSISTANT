import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const COLORS = {
  client: '#e74c3c', service: '#4a90d9', database: '#27ae60',
  gateway: '#8e44ad', cache: '#e67e22', queue: '#f1c40f',
  infra: '#6c757d',
};
const R = 24;

export default function ArchitectureTemplateDiagram({ nodes = [], edges = [] }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;
    const el = svgRef.current;
    const w = el.clientWidth;
    const h = 320;
    const svg = d3.select(el);
    svg.selectAll('*').remove();
    svg.attr('viewBox', [0, 0, w, h]);

    const g = svg.append('g');
    svg.call(d3.zoom().scaleExtent([0.4, 2.5]).on('zoom', (e) => g.attr('transform', e.transform)));

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id((d) => d.id).distance(130))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide(R + 8));

    const link = g.append('g').selectAll('line').data(edges).join('line')
      .attr('stroke', '#555').attr('stroke-width', 2)
      .attr('stroke-dasharray', (d) => d.style === 'dashed' ? '6,4' : d.style === 'dotted' ? '2,3' : 'none');

    const linkLabel = g.append('g').selectAll('text').data(edges).join('text')
      .text((d) => d.label).attr('font-size', 9).attr('fill', '#888').attr('text-anchor', 'middle');

    const node = g.append('g').selectAll('g').data(nodes).join('g')
      .call(d3.drag()
        .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    node.append('circle').attr('r', R).attr('fill', (d) => COLORS[d.type] || '#666').attr('stroke', '#fff').attr('stroke-width', 2);
    node.append('text').text((d) => d.label.length > 10 ? d.label.slice(0, 9) + '…' : d.label)
      .attr('text-anchor', 'middle').attr('dy', '0.35em').attr('font-size', 9).attr('fill', '#fff').attr('font-weight', 'bold');

    g.append('defs').append('marker').attr('id', 'tm-arrow').attr('viewBox', '0 -5 10 10')
      .attr('refX', R + 5).attr('refY', 0).attr('markerWidth', 7).attr('markerHeight', 7)
      .attr('orient', 'auto').append('path').attr('d', 'M0,-4 L8,0 L0,4').attr('fill', '#555');

    link.attr('marker-end', 'url(#tm-arrow)');

    sim.on('tick', () => {
      link.attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y);
      linkLabel.attr('x', (d) => (d.source.x + d.target.x) / 2).attr('y', (d) => (d.source.y + d.target.y) / 2 - 8);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [nodes, edges]);

  return <svg ref={svgRef} width="100%" height={320} />;
}
