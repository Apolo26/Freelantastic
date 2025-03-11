"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Calculation = {
  id: string
  name: string
  fixedCosts: number
  weeklyHours: number
  experienceLevel: "junior" | "mid" | "senior"
  profitMargin: number
  vacationWeeks: number
  taxRate: number
  currency: string
  hourlyRate: number
  dailyRate: number
  weeklyRate: number
  monthlyRate: number
  projectDuration?: number
  projectComplexity?: "low" | "medium" | "high"
  riskFactor?: number
  projectRate?: number
  date: string
}

interface CalculatorState {
  calculations: Calculation[]
  addCalculation: (calculation: Omit<Calculation, "id">) => void
  removeCalculation: (id: string) => void
  clearCalculations: () => void
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      calculations: [],
      addCalculation: (calculation) =>
        set((state) => ({
          calculations: [{ ...calculation, id: Date.now().toString() }, ...state.calculations].slice(0, 10),
        })),
      removeCalculation: (id) =>
        set((state) => ({
          calculations: state.calculations.filter((calc) => calc.id !== id),
        })),
      clearCalculations: () => set({ calculations: [] }),
    }),
    {
      name: "freelance-calculator-storage",
    },
  ),
)

