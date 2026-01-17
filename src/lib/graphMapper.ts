export interface GraphNode {
  id: string;
  name: string;
  type: string;
  location: string;
  department: string;
  status: string;
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

    // Add 'from' node with all properties
    if (!nodeMap.has(from.id)) {
      nodeMap.set(from.id, {
        id: from.id,
        name: from.name || 'Unknown',
        type: from.type || 'unknown',
        location: from.location || 'Unknown',
        department: from.department || 'Unknown',
        status: from.status || 'operational'
      });
    }

    // Add 'to' node with all properties
    if (!nodeMap.has(to.id)) {
      nodeMap.set(to.id, {
        id: to.id,
        name: to.name || 'Unknown',
        type: to.type || 'unknown',
        location: to.location || 'Unknown',
        department: to.department || 'Unknown',
        status: to.status || 'operational'
      });
    }

    // Create edge
    edges.push({
      source: from.id,
      target: to.id,
      label: item.relationship
    });
  });

  console.log('Built nodes:', Array.from(nodeMap.values()));
  console.log('Built edges:', edges);

  return {
    nodes: Array.from(nodeMap.values()),
    edges
  };
}