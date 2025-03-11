"use client";

import { useState, useRef } from "react";
import { useCalculatorStore } from "@/store/calculator-store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Download, X, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { BudgetDetailsModal } from "./budget-details-modal";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
const domtoimage = require("dom-to-image-more");

import type { Calculation } from "../../types";

export default function HistoryDisplay() {
  const { calculations, clearCalculations, removeCalculation } =
    useCalculatorStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Calculation | null>(
    null
  );
  const tableRef = useRef<HTMLDivElement>(null);

  const exportAsImage = async (calc: Calculation) => {
    const element = document.getElementById(`budget-${calc.id}`);
    if (element) {
      const imageData = await domtoimage.toPng(element);
      const link = document.createElement("a");
      link.download = `${calc.name || "budget"}-${calc.id}.png`;
      link.href = imageData;
      link.click();
    }
  };

  const exportAsPDF = async (calc: Calculation) => {
    const element = document.getElementById(`budget-${calc.id}`);
    if (element) {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
      });

      domtoimage.toPng(element).then((dataUrl: string) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const width = pdf.internal.pageSize.getWidth();
          const height = (img.height * width) / img.width;
          pdf.addImage(img, "PNG", 0, 0, width, height);
          pdf.save(`${calc.name || "budget"}-${calc.id}.pdf`);
        };
      });
    }
  };

  if (calculations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay cálculos guardados en el historial.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Historial de Cálculos</h3>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2 text-white" />
              <p className="text-white">Limpiar Todo</p>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará todo tu historial de cálculos y no se
                puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  clearCalculations();
                  setIsDialogOpen(false);
                }}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="overflow-x-auto" ref={tableRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Experiencia</TableHead>
              <TableHead>Por Hora</TableHead>
              <TableHead>Por Día</TableHead>
              <TableHead className="hidden md:table-cell">Proyecto</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {calculations.map((calc) => (
                <motion.tr
                  key={calc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TableCell>{calc.name || "Sin nombre"}</TableCell>
                  <TableCell>{formatDate(calc.date)}</TableCell>
                  <TableCell className="capitalize">
                    {calc.experienceLevel}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(calc.hourlyRate, calc.currency)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(calc.dailyRate, calc.currency)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {calc.projectRate
                      ? formatCurrency(calc.projectRate, calc.currency)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBudget(calc)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => exportAsImage(calc)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => exportAsPDF(calc)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCalculation(calc.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      {selectedBudget && (
        <BudgetDetailsModal
          budget={selectedBudget}
          onClose={() => setSelectedBudget(null)}
        />
      )}
    </div>
  );
}
