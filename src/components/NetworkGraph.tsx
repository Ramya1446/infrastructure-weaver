import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { getNodeColor } from "@/data/infrastructure";

interface GraphNode {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface GraphEdge {
  source: string;
  target: string;
}

interface NetworkGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick?: (node: GraphNode) => void;
  
  selectedNodeId?: string | null;
}

export function NetworkGraph({
  nodes,
  edges,
  onNodeClick,
  selectedNodeId,
}: NetworkGraphProps) {
  const graphRef = useRef<ForceGraphMethods>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const container = document.getElementById("graph-container");
    if (!container) return;

    const resize = () =>
      setDimensions({
        width: container.clientWidth,
        height: Math.max(450, container.clientHeight),
      });

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const graphData = useMemo(() => {
    return {
      nodes: nodes.map((n) => ({
        ...n,
        color: getNodeColor(n.type),
        val: 6,
      })),
      links: edges,
    };
  }, [nodes, edges]);

  const handleNodeClick = useCallback(
  (node: any) => {
    const fullNode = nodes.find(n => n.id === node.id);
    if (!fullNode) return;

    // 🔥 force React state update
    onNodeClick?.({ ...fullNode });

    graphRef.current?.centerAt(node.x, node.y, 500);
    graphRef.current?.zoom(2, 500);
  },
  [nodes, onNodeClick]
);



  const drawNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, scale: number) => {
      const size = 6;
      const fontSize = 10 / scale;
      const selected = node.id === selectedNodeId;

      if (selected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2 / scale;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();

      ctx.font = `${fontSize}px Inter`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#1e293b";
      ctx.fillText(node.label, node.x, node.y + size + 4);
    },
    [selectedNodeId]
  );

  return (
    <div
      id="graph-container"
      className="w-full h-[500px] rounded-xl border border-border bg-card overflow-hidden"
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={drawNode}
        linkColor={() => "#cbd5e1"}
        linkWidth={1.5}
        linkDirectionalArrowLength={4}
        onNodeClick={handleNodeClick}
        cooldownTicks={80}
      />
    </div>
  );
}
