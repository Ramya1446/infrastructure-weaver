import { motion } from "framer-motion";
import { MapPin, Building2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { InfrastructureUnit, getNodeColor, getTypeLabel } from "@/data/infrastructure";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface InfrastructureCardProps {
  unit: InfrastructureUnit;
  onClick?: () => void;
  isSelected?: boolean;
}

export function InfrastructureCard({ unit, onClick, isSelected }: InfrastructureCardProps) {
  const typeColor = getNodeColor(unit.type);

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer transition-all duration-200 ${
          isSelected
            ? "ring-2 ring-primary shadow-lg"
            : "hover:shadow-md"
        }`}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${typeColor}20` }}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: typeColor }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{unit.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {getTypeLabel(unit.type)}
                </p>
              </div>
            </div>
            <StatusBadge status={unit.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{unit.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{unit.department}</span>
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm">
              <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{unit.dependencyCount}</span>
              <span className="text-muted-foreground">deps</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{unit.dependentCount}</span>
              <span className="text-muted-foreground">dependents</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
