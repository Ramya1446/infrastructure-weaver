export type InfrastructureType = "power" | "water" | "telecom" | "transport";

export interface InfrastructureUnit {
  id: string;
  name: string;
  type: InfrastructureType;
  location: string;
  department: string;
  status: "operational" | "warning" | "critical";
  dependencyCount: number;
  dependentCount: number;
}

export interface Dependency {
  source: string;
  target: string;
  type: "power" | "data" | "physical";
}

export const infrastructureUnits: InfrastructureUnit[] = [
  {
    id: "ps-001",
    name: "Central Power Station",
    type: "power",
    location: "Zone 1 - Industrial",
    department: "Energy Department",
    status: "operational",
    dependencyCount: 0,
    dependentCount: 8,
  },
  {
    id: "ps-002",
    name: "Power Substation A",
    type: "power",
    location: "Zone 2 - Residential",
    department: "Energy Department",
    status: "warning",
    dependencyCount: 1,
    dependentCount: 5,
  },
  {
    id: "ps-003",
    name: "Power Substation B",
    type: "power",
    location: "Zone 3 - Commercial",
    department: "Energy Department",
    status: "operational",
    dependencyCount: 1,
    dependentCount: 4,
  },
  {
    id: "wp-001",
    name: "Main Water Treatment Plant",
    type: "water",
    location: "Zone 1 - Industrial",
    department: "Water Authority",
    status: "operational",
    dependencyCount: 1,
    dependentCount: 4,
  },
  {
    id: "wp-002",
    name: "Water Pump Station North",
    type: "water",
    location: "Zone 2 - Residential",
    department: "Water Authority",
    status: "operational",
    dependencyCount: 2,
    dependentCount: 2,
  },
  {
    id: "wp-003",
    name: "Water Pump Station South",
    type: "water",
    location: "Zone 3 - Commercial",
    department: "Water Authority",
    status: "operational",
    dependencyCount: 2,
    dependentCount: 1,
  },
  {
    id: "tt-001",
    name: "Central Telecom Hub",
    type: "telecom",
    location: "Zone 1 - Industrial",
    department: "Communications",
    status: "operational",
    dependencyCount: 1,
    dependentCount: 3,
  },
  {
    id: "tt-002",
    name: "Telecom Tower Zone 2",
    type: "telecom",
    location: "Zone 2 - Residential",
    department: "Communications",
    status: "operational",
    dependencyCount: 2,
    dependentCount: 1,
  },
  {
    id: "tt-003",
    name: "Telecom Tower Zone 3",
    type: "telecom",
    location: "Zone 3 - Commercial",
    department: "Communications",
    status: "critical",
    dependencyCount: 2,
    dependentCount: 1,
  },
  {
    id: "tr-001",
    name: "Traffic Control Center",
    type: "transport",
    location: "Zone 1 - Industrial",
    department: "Transport Authority",
    status: "operational",
    dependencyCount: 2,
    dependentCount: 0,
  },
];

export const dependencies: Dependency[] = [
  // Power dependencies
  { source: "ps-001", target: "ps-002", type: "power" },
  { source: "ps-001", target: "ps-003", type: "power" },
  
  // Water depends on Power
  { source: "ps-001", target: "wp-001", type: "power" },
  { source: "ps-002", target: "wp-002", type: "power" },
  { source: "ps-003", target: "wp-003", type: "power" },
  { source: "wp-001", target: "wp-002", type: "physical" },
  { source: "wp-001", target: "wp-003", type: "physical" },
  
  // Telecom depends on Power
  { source: "ps-001", target: "tt-001", type: "power" },
  { source: "ps-002", target: "tt-002", type: "power" },
  { source: "ps-003", target: "tt-003", type: "power" },
  { source: "tt-001", target: "tt-002", type: "data" },
  { source: "tt-001", target: "tt-003", type: "data" },
  
  // Transport depends on Power and Telecom
  { source: "ps-001", target: "tr-001", type: "power" },
  { source: "tt-001", target: "tr-001", type: "data" },
];

export const getNodeColor = (type: InfrastructureType): string => {
  const colors = {
    power: "#f59e0b",
    water: "#0ea5e9",
    telecom: "#22c55e",
    transport: "#a855f7",
  };
  return colors[type];
};

export const getTypeLabel = (type: InfrastructureType): string => {
  const labels = {
    power: "Power Grid",
    water: "Water System",
    telecom: "Telecommunications",
    transport: "Transportation",
  };
  return labels[type];
};
