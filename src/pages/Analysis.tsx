import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Search,
  ArrowRight,
  Zap,
  Droplets,
  Radio,
  CheckCircle2,
} from "lucide-react";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { getTypeLabel, getNodeColor, InfrastructureType } from "@/data/infrastructure";

interface AffectedUnit {
  id: string;
  name: string;
  type: InfrastructureType;
  location: string;
  department: string;
}

interface AnalysisResult {
  rootCause: string[];
  cascade: AffectedUnit[];
}

const failureTypes = [
  { value: "power", label: "Power Outage", icon: Zap },
  { value: "water", label: "Water Supply Disruption", icon: Droplets },
  { value: "telecom", label: "Network Failure", icon: Radio },
];

export default function Analysis() {
  const [failureType, setFailureType] = useState("");
  const [failedUnit, setFailedUnit] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeFailure = async () => {
    if (!failedUnit) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch(
        `http://localhost:4000/api/analyze?failedUnit=${encodeURIComponent(
          failedUnit
        )}`
      );
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setResult(null);
    setFailureType("");
    setFailedUnit("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Failure Analysis</h1>
          <p className="text-muted-foreground">
            Analyze root causes and cascading impacts using dependency graphs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Analysis Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Failure Type</Label>
                <Select value={failureType} onValueChange={setFailureType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select failure type" />
                  </SelectTrigger>
                  <SelectContent>
                    {failureTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Failed Infrastructure (name)</Label>
                <input
                  value={failedUnit}
                  onChange={(e) => setFailedUnit(e.target.value)}
                  placeholder="e.g., Basin Bridge Substation"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={analyzeFailure}
                  disabled={!failedUnit || isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {result && (
                  <Button variant="outline" onClick={clearAnalysis}>
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

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
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      Analysis Results
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Root Cause */}
                    <div className="rounded-lg border border-critical/20 bg-critical/5 p-4">
                      <p className="mb-2 text-sm font-medium text-critical">
                        Root Cause Chain
                      </p>
                      {result.rootCause.flat().map((step, i) => (
                        <p key={i} className="text-sm">
                          {i + 1}. {step.from} → {step.to}
                        </p>
                      ))}
                    </div>

                    {/* Affected Units */}
                    <div>
                      <p className="mb-3 text-sm font-medium text-foreground">
                        Affected Services
                      </p>
                      <div className="space-y-2">
                        {result.cascade.map((unit) => (
                          <div
                            key={unit.id}
                            className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2"
                          >
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: getNodeColor(unit.type),
                              }}
                            />
                            <span className="text-sm">{unit.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {getTypeLabel(unit.type)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
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
                <Card className="flex h-full min-h-[400px] items-center justify-center">
                  <CardContent className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Enter a failed infrastructure to analyze impact
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
