"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Calculation } from "@/store/calculator-store";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BudgetDetailsModalProps {
  budget: Calculation;
  onClose: () => void;
}

export function BudgetDetailsModal({
  budget,
  onClose
}: BudgetDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          id={`budget-${budget.id}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {budget.name || "Detalles del Presupuesto"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Creado el {formatDate(budget.date)}
          </p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Experiencia:</span>
              <span className="capitalize">{budget.experienceLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tarifa por Hora:</span>
              <span>{formatCurrency(budget.hourlyRate, budget.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tarifa por Día:</span>
              <span>{formatCurrency(budget.dailyRate, budget.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tarifa Semanal:</span>
              <span>{formatCurrency(budget.weeklyRate, budget.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tarifa Mensual:</span>
              <span>{formatCurrency(budget.monthlyRate, budget.currency)}</span>
            </div>
            {budget.projectRate && (
              <div className="flex justify-between">
                <span className="font-medium">Tarifa del Proyecto:</span>
                <span>
                  {formatCurrency(budget.projectRate, budget.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Costos Fijos:</span>
              <span>
                {formatCurrency(budget.fixedCosts, budget.currency)}/mes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Horas Semanales:</span>
              <span>{budget.weeklyHours}h</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Margen de Ganancia:</span>
              <span>{budget.profitMargin}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Vacaciones:</span>
              <span>{budget.vacationWeeks} semanas</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tasa de Impuestos:</span>
              <span>{budget.taxRate}%</span>
            </div>
            {budget.projectDuration && (
              <div className="flex justify-between">
                <span className="font-medium">Duración del Proyecto:</span>
                <span>{budget.projectDuration} días</span>
              </div>
            )}
            {budget.projectComplexity && (
              <div className="flex justify-between">
                <span className="font-medium">Complejidad del Proyecto:</span>
                <span className="capitalize">{budget.projectComplexity}</span>
              </div>
            )}
            {budget.riskFactor && (
              <div className="flex justify-between">
                <span className="font-medium">Factor de Riesgo:</span>
                <span>{budget.riskFactor}%</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
