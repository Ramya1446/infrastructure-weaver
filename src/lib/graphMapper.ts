export interface GraphNode {
  id: string;
  label: string;
  type: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

export function buildGraph(apiData: any[]) {
  const nodeMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  apiData.forEach(item => {
    const from = item.from;
    const to = item.to;

    if (!nodeMap.has(from.id)) {
      nodeMap.set(from.id, {
        id: from.id,
        label: from.name,
        type: from.type
      });
    }

    if (!nodeMap.has(to.id)) {
      nodeMap.set(to.id, {
        id: to.id,
        label: to.name,
        type: to.type
      });
    }

    edges.push({
      source: from.id,
      target: to.id,
      label: item.relationship
    });
  });

  return {
    nodes: Array.from(nodeMap.values()),
    edges
  };
}
