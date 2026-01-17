import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Network, AlertTriangle, Shield, ArrowRight, Zap, Droplets, Radio, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";

const features = [
  {
    icon: Network,
    title: "Dependency Mapping",
    description: "Visualize how infrastructure units are interconnected",
    link: "/infrastructure",
  },
  {
    icon: AlertTriangle,
    title: "Failure Analysis",
    description: "Trace root causes and understand cascading effects",
    link: "/analysis",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Identify critical single points of failure",
    link: "/critical",
  },
];

const infrastructureTypes = [
  { icon: Zap, label: "Power Grid", color: "bg-warning/10 text-warning" },
  { icon: Droplets, label: "Water System", color: "bg-[hsl(199,89%,48%)]/10 text-[hsl(199,89%,48%)]" },
  { icon: Radio, label: "Telecom", color: "bg-success/10 text-success" },
  { icon: Car, label: "Transport", color: "bg-[hsl(262,83%,58%)]/10 text-[hsl(262,83%,58%)]" },
];

export default function Index() {
  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative">
          <div className="gradient-mesh absolute inset-0 -z-10" />
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                System Monitoring Active
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Infrastructure Failure{" "}
                <span className="text-primary">Analysis System</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Analyze how failures propagate across public infrastructure using 
                dependency graphs. Identify root causes, understand cascading effects, 
                and plan preventive maintenance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/infrastructure">
                  <Network className="h-4 w-4" />
                  View Infrastructure
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/analysis">
                  <AlertTriangle className="h-4 w-4" />
                  Analyze Failure
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Infrastructure Types */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {infrastructureTypes.map((type) => (
              <div
                key={type.label}
                className={`flex items-center gap-2 rounded-full px-4 py-2 ${type.color}`}
              >
                <type.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{type.label}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Features */}
        <section>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Link to={feature.link}>
                  <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                    <CardContent className="pt-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                        <feature.icon className="h-6 w-6 text-foreground" />
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary">
                        Explore
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mx-auto max-w-2xl">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
              <div>
                <h3 className="text-lg font-semibold">Ready to analyze?</h3>
                <p className="text-primary-foreground/80">
                  Explore the infrastructure network or run a failure analysis.
                </p>
              </div>
              <Button asChild variant="secondary" className="gap-2">
                <Link to="/critical">
                  View Critical Units
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
