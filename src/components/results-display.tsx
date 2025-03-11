"use client";

import { useCalculatorStore } from "@/store/calculator-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Briefcase, CreditCard, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsDisplay() {
  const { calculations } = useCalculatorStore();
  const { selectedCurrency } = useCurrencyConverter();

  const latestCalculation = calculations[0];

  if (!latestCalculation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>
            Completa el formulario para ver tus tarifas recomendadas
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          No hay cálculos aún
        </CardContent>
      </Card>
    );
  }

  const experienceLabel =
    latestCalculation.experienceLevel === "junior"
      ? "Junior"
      : latestCalculation.experienceLevel === "mid"
      ? "Intermedio"
      : "Senior";

  const experienceColor =
    latestCalculation.experienceLevel === "junior"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      : latestCalculation.experienceLevel === "mid"
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";

  const complexityLabel =
    latestCalculation.projectComplexity === "low"
      ? "Baja"
      : latestCalculation.projectComplexity === "medium"
      ? "Media"
      : latestCalculation.projectComplexity === "high"
      ? "Alta"
      : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Tus Tarifas</CardTitle>
            <CardDescription>Basado en tus datos</CardDescription>
          </div>
          <Badge className={experienceColor}>{experienceLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Por Hora</span>
              </div>
              <span className="text-xl font-bold">
                {formatCurrency(
                  latestCalculation.hourlyRate,
                  latestCalculation.currency
                )}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Por Día (8h)</span>
              </div>
              <span className="text-xl font-bold">
                {formatCurrency(
                  latestCalculation.dailyRate,
                  latestCalculation.currency
                )}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Por Semana</span>
              </div>
              <span className="text-xl font-bold">
                {formatCurrency(
                  latestCalculation.weeklyRate,
                  latestCalculation.currency
                )}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Por Mes</span>
              </div>
              <span className="text-xl font-bold">
                {formatCurrency(
                  latestCalculation.monthlyRate,
                  latestCalculation.currency
                )}
              </span>
            </div>

            {latestCalculation.projectRate && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Proyecto Completo</span>
                  {complexityLabel && (
                    <Badge variant="outline" className="ml-1 text-xs">
                      Complejidad {complexityLabel}
                    </Badge>
                  )}
                </div>
                <span className="text-xl font-bold">
                  {formatCurrency(
                    latestCalculation.projectRate,
                    latestCalculation.currency
                  )}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pt-4 space-y-2 text-sm text-muted-foreground"
        >
          <div className="pt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Costos Fijos Mensuales:</span>
              <span>
                {formatCurrency(
                  latestCalculation.fixedCosts,
                  latestCalculation.currency
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Horas Semanales:</span>
              <span>{latestCalculation.weeklyHours}h</span>
            </div>
            <div className="flex justify-between">
              <span>Margen de Ganancia:</span>
              <span>{latestCalculation.profitMargin}%</span>
            </div>
            {latestCalculation.projectDuration && (
              <div className="flex justify-between">
                <span>Duración del Proyecto:</span>
                <span>{latestCalculation.projectDuration} días</span>
              </div>
            )}
            {latestCalculation.riskFactor && (
              <div className="flex justify-between">
                <span>Factor de Riesgo:</span>
                <span>{latestCalculation.riskFactor}%</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Vacaciones:</span>
              <span>{latestCalculation.vacationWeeks} semanas</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos:</span>
              <span>{latestCalculation.taxRate}%</span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
