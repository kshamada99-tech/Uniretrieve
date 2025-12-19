
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FlowNode, FlowLink } from '../types';

const nodes: FlowNode[] = [
  { id: 'start', label: 'User Discovers Need', type: 'start' },
  { id: 'report', label: 'Select Report Type', type: 'process' },
  { id: 'lost_flow', label: 'Detail Lost Item', type: 'process' },
  { id: 'found_flow', label: 'Detail Found Item', type: 'process' },
  { id: 'ai_check', label: 'AI Optimization', type: 'process' },
  { id: 'match_engine', label: 'Scanning Matches', type: 'process' },
  { id: 'match_found', label: 'Potential Match?', type: 'decision' },
  { id: 'verify', label: 'Verify Identity', type: 'process' },
  { id: 'connect', label: 'Contact Securely', type: 'process' },
  { id: 'resolved', label: 'Issue Resolved', type: 'end' },
];

const links: FlowLink[] = [
  { source: 'start', target: 'report' },
  { source: 'report', target: 'lost_flow' },
  { source: 'report', target: 'found_flow' },
  { source: 'lost_flow', target: 'ai_check' },
  { source: 'found_flow', target: 'ai_check' },
  { source: 'ai_check', target: 'match_engine' },
  { source: 'match_engine', target: 'match_found' },
  { source: 'match_found', target: 'verify', label: 'Yes' },
  { source: 'match_found', target: 'resolved', label: 'No (Posted)' },
  { source: 'verify', target: 'connect' },
  { source: 'connect', target: 'resolved' },
];

export const UserFlowDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const g = svg.append("g");

    // Arrowhead definition
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 30)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#94a3b8");

    const link = g.append("g")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("marker-end", "url(#arrow)");

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append("rect")
      .attr("width", 140)
      .attr("height", 45)
      .attr("x", -70)
      .attr("y", -22.5)
      .attr("rx", (d: any) => d.type === 'decision' ? 0 : 8)
      .attr("transform", (d: any) => d.type === 'decision' ? "rotate(45)" : "")
      .attr("fill", (d: any) => {
        if (d.type === 'start') return "#f0f9ff";
        if (d.type === 'end') return "#f0fdf4";
        if (d.type === 'decision') return "#fffbeb";
        return "white";
      })
      .attr("stroke", (d: any) => {
        if (d.type === 'start') return "#0ea5e9";
        if (d.type === 'end') return "#22c55e";
        if (d.type === 'decision') return "#f59e0b";
        return "#6366f1";
      })
      .attr("stroke-width", 2);

    node.append("text")
      .text((d: any) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#1e293b")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">Interactive User Flow Journey</h3>
        <div className="flex gap-4 text-xs font-medium">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-50 border border-indigo-500 rounded"></div> Process</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-50 border border-amber-500"></div> Decision</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-sky-50 border border-sky-500 rounded"></div> Start</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-50 border border-emerald-500 rounded"></div> End</span>
        </div>
      </div>
      <div className="w-full h-[600px] cursor-move bg-slate-50">
        <svg 
          ref={svgRef} 
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
      <div className="p-4 bg-indigo-600 text-white text-sm text-center">
        <i className="fas fa-info-circle mr-2"></i> Drag nodes to reorganize the flow visualization.
      </div>
    </div>
  );
};
