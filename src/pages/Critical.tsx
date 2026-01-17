import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Zap,
  Droplets,
  Radio,
  Car,
  TrendingUp,
} from "lucide-react";

import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { getTypeLabel, getNodeColor, InfrastructureType } from "@/data/infrastructure";

interface CriticalUnit {
  name: string;
  dependencyCount: number;
}

const typeIcons: Record<InfrastructureType, typeof Zap> = {
  power: Zap,
  water: Droplets,
  telecom: Radio,
  transport: Car,
};

export default function Critical() {
  const [units, setUnits] = useState<CriticalUnit[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/critical")
      .then((res) => res.json())
      .then((data) => setUnits(data))
      .catch((err) => console.error("Critical fetch failed", err));
  }, []);

  const maxScore = units[0]?.dependencyCount || 1;

  const totalCritical = units.filter((u) => u.dependencyCount > maxScore * 0.6).length;
  const totalWarning = units.filter(
    (u) => u.dependencyCount > maxScore * 0.3 && u.dependencyCount <= maxScore * 0.6
  ).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Critical Infrastructure
          </h1>
          <p className="text-muted-foreground">
            Units ranked by potential cascading impact if they fail
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-critical/10">
                <AlertTriangle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCritical}</p>
                <p className="text-sm text-muted-foreground">High Risk Units</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalWarning}</p>
                <p className="text-sm text-muted-foreground">Medium Risk Units</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {units.length - totalCritical - totalWarning}
                </p>
                <p className="text-sm text-muted-foreground">Low Risk Units</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ranking */}
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Risk Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {units.map((unit, index) => {
                const progress = (unit.dependencyCount / maxScore) * 100;
                const riskLevel =
                  unit.dependencyCount > maxScore * 0.6
                    ? "critical"
                    : unit.dependencyCount > maxScore * 0.3
                    ? "warning"
                    : "operational";

                return (
                  <motion.div
                    key={unit.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {unit.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Dependency Count: {unit.dependencyCount}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={riskLevel} />
                    </div>

                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Impact Score</span>
                        <span className="font-medium">{unit.dependencyCount}</span>
                      </div>
                      <Progress
                        value={progress}
                        className={`h-2 ${
                          riskLevel === "critical"
                            ? "[&>div]:bg-critical"
                            : riskLevel === "warning"
                            ? "[&>div]:bg-warning"
                            : "[&>div]:bg-success"
                        }`}
                      />
                    </div>

                    {riskLevel === "critical" && (
                      <div className="mt-4 rounded-md bg-critical/5 border border-critical/20 p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-critical mt-0.5" />
                          <p className="text-sm text-critical">
                            <strong>High Priority:</strong> Failure of this unit
                            would affect many dependent services.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
