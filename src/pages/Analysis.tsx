import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Search,
  ArrowRight,
  Zap,
  Droplets,
  Radio,
  CheckCircle2,
  MapPin,
  Car,
} from "lucide-react";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTypeLabel, getNodeColor, InfrastructureType } from "@/data/infrastructure";
import { fetchInfrastructure } from "@/lib/api";
import { buildGraph } from "@/lib/graphMapper";

interface AffectedUnit {
  id: string;
  name: string;
  type: InfrastructureType;
  location: string;
  department: string;
}

interface ThreatAnalysis {
  region: string;
  criticalUnits: Array<{
    name: string;
    type: string;
    location: string;
    dependentCount: number;
  }>;
  vulnerabilities: string[];
  totalUnits: number;
}

interface Region {
  id: string;
  name: string;
  icon: string;
  locations: string[];
  description: string;
}

export default function Analysis() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ThreatAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-generate regions from infrastructure data
  useEffect(() => {
    fetchInfrastructure().then((data) => {
      const graph = buildGraph(data);
      
      // Get all unique locations
      const allLocations = [...new Set(graph.nodes.map((n: any) => n.location))];
      
      // Group locations into regions (you can customize this logic)
      const locationGroups = groupLocationsByRegion(allLocations);
      
      setRegions(locationGroups);
      setLoading(false);
    });
  }, []);

  // Smart grouping of locations into regions
  const groupLocationsByRegion = (locations: string[]): Region[] => {
    const northKeywords = ['ennore', 'basin bridge', 'red hills', 'minjur', 'north'];
    const centralKeywords = ['anna nagar', 'kilpauk', 'mount road', 't nagar', 'central'];
    const southKeywords = ['adyar', 'taramani', 'velachery', 'neelankarai', 'beach'];
    const itKeywords = ['omr', 'old mahabalipuram', 'guindy', 'tambaram', 'koyambedu'];
    
    const north: string[] = [];
    const central: string[] = [];
    const south: string[] = [];
    const itCorridor: string[] = [];
    const other: string[] = [];

    locations.forEach(loc => {
      const lowerLoc = loc.toLowerCase();
      if (northKeywords.some(kw => lowerLoc.includes(kw))) {
        north.push(loc);
      } else if (centralKeywords.some(kw => lowerLoc.includes(kw))) {
        central.push(loc);
      } else if (southKeywords.some(kw => lowerLoc.includes(kw))) {
        south.push(loc);
      } else if (itKeywords.some(kw => lowerLoc.includes(kw))) {
        itCorridor.push(loc);
      } else {
        other.push(loc);
      }
    });

    const generatedRegions: Region[] = [];

    if (north.length > 0) {
      generatedRegions.push({
        id: 'north',
        name: 'North Chennai',
        icon: '🏭',
        locations: north,
        description: 'Industrial & Port Area'
      });
    }

    if (central.length > 0) {
      generatedRegions.push({
        id: 'central',
        name: 'Central Chennai',
        icon: '🏛️',
        locations: central,
        description: 'Administrative & Commercial Hub'
      });
    }

    if (south.length > 0) {
      generatedRegions.push({
        id: 'south',
        name: 'South Chennai',
        icon: '🏖️',
        locations: south,
        description: 'Residential & Coastal Area'
      });
    }

    if (itCorridor.length > 0) {
      generatedRegions.push({
        id: 'it-corridor',
        name: 'IT Corridor',
        icon: '💻',
        locations: itCorridor,
        description: 'Tech & Business District'
      });
    }

    if (other.length > 0) {
      generatedRegions.push({
        id: 'other',
        name: 'Other Areas',
        icon: '📍',
        locations: other,
        description: 'Surrounding Districts'
      });
    }

    return generatedRegions;
  };

  const analyzeRegion = async (regionId: string) => {
    const region = regions.find(r => r.id === regionId);
    if (!region) return;

    setSelectedRegion(regionId);
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Call backend to analyze all units in this region's locations
      const url = `http://localhost:4000/api/analyze-region?region=${encodeURIComponent(regionId)}&locations=${encodeURIComponent(region.locations.join(','))}`;
      
      console.log('Requesting:', url);
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }
      
      const data = await res.json();
      console.log('API Response:', data);
      
      setResult({
        region: region.name,
        criticalUnits: data.criticalUnits || [],
        vulnerabilities: data.vulnerabilities || [],
        totalUnits: data.totalUnits || 0
      });
    } catch (err) {
      console.error("Analysis failed:", err);
      
      // Fallback mock data for demonstration
      setResult({
        region: region.name,
        criticalUnits: [
          {
            name: "Sample Infrastructure",
            type: "power",
            location: region.locations[0],
            dependentCount: 5
          }
        ],
        vulnerabilities: [
          `${region.locations.length} locations monitored`,
          "Analysis endpoint not implemented yet"
        ],
        totalUnits: region.locations.length
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setResult(null);
    setSelectedRegion(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Regional Threat Analysis</h1>
          <p className="text-muted-foreground">
            Select a region to analyze potential infrastructure vulnerabilities
          </p>
        </div>

        {loading ? (
          <div className="flex h-[500px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
          {/* Region Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Select Region
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => analyzeRegion(region.id)}
                    disabled={isAnalyzing}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                      selectedRegion === region.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{region.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{region.name}</h3>
                        <p className="text-sm text-muted-foreground">{region.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {region.locations.map((loc) => (
                            <span
                              key={loc}
                              className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedRegion === region.id && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                          <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        {result.region} Analysis
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={clearAnalysis}>
                        Clear
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Summary */}
                    <div className="rounded-lg bg-secondary p-4">
                      <p className="mb-2 text-sm font-medium">Region Summary</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            {result.criticalUnits.length}
                          </p>
                          <p className="text-xs text-muted-foreground">Critical Units</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            {result.totalUnits}
                          </p>
                          <p className="text-xs text-muted-foreground">Total Infrastructure</p>
                        </div>
                      </div>
                    </div>

                    {/* Critical Units */}
                    {result.criticalUnits.length > 0 && (
                      <div>
                        <p className="mb-3 text-sm font-medium text-foreground">
                          High-Risk Infrastructure
                        </p>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {result.criticalUnits.map((unit, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 rounded-lg bg-critical/10 border border-critical/20 px-3 py-2"
                            >
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor: getNodeColor(unit.type as InfrastructureType),
                                }}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{unit.name}</p>
                                <p className="text-xs text-muted-foreground">{unit.location}</p>
                              </div>
                              <span className="text-xs font-semibold text-critical">
                                {unit.dependentCount} deps
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vulnerabilities */}
                    {result.vulnerabilities.length > 0 && (
                      <div>
                        <p className="mb-3 text-sm font-medium text-foreground">
                          Key Vulnerabilities
                        </p>
                        <div className="space-y-2">
                          {result.vulnerabilities.map((vuln, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 rounded-lg bg-warning/10 border border-warning/20 px-3 py-2"
                            >
                              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{vuln}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="flex h-full min-h-[500px] items-center justify-center">
                  <CardContent className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                      {isAnalyzing ? (
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      ) : (
                        <Search className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {isAnalyzing ? 'Analyzing region...' : 'Select a region to analyze threats'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        )}
      </div>
    </Layout>
  );
}