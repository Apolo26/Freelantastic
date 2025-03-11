"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCalculatorStore } from "@/store/calculator-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ResultsDisplay from "@/components/results-display";
import HistoryDisplay from "@/components/history-display";
import { motion, AnimatePresence } from "framer-motion";

// Modificar el formSchema para añadir los campos de proyecto
const formSchema = z.object({
  fixedCosts: z.coerce
    .number()
    .min(0, "Los costos fijos deben ser un número positivo"),
  weeklyHours: z.coerce
    .number()
    .min(1, "Las horas semanales deben ser al menos 1")
    .max(168, "No puede haber más de 168 horas en una semana"),
  experienceLevel: z.enum(["junior", "mid", "senior"]),
  profitMargin: z.coerce
    .number()
    .min(0, "El margen de ganancia debe ser positivo")
    .max(100, "El margen no puede exceder el 100%"),
  vacationWeeks: z.coerce
    .number()
    .min(0, "Las semanas de vacaciones deben ser positivas")
    .max(52, "No puede haber más de 52 semanas de vacaciones"),
  taxRate: z.coerce
    .number()
    .min(0, "La tasa de impuestos debe ser positiva")
    .max(100, "La tasa de impuestos no puede exceder el 100%"),
  currency: z.string().min(1, "Selecciona una moneda"),
  name: z.string().min(1, "El nombre del presupuesto es requerido"),
  // Nuevos campos para proyectos
  projectDuration: z.coerce
    .number()
    .min(1, "La duración debe ser al menos 1 día")
    .optional(),
  projectComplexity: z.enum(["low", "medium", "high"]).optional(),
  riskFactor: z.coerce
    .number()
    .min(0, "El factor de riesgo debe ser positivo")
    .max(100, "El factor de riesgo no puede exceder el 100%")
    .optional()
});

export default function Calculator() {
  const { addCalculation } = useCalculatorStore();
  const currencies = ["USD", "EUR", "GBP", "JPY"];
  const [activeTab, setActiveTab] = useState("calculator");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fixedCosts: 1000,
      weeklyHours: 40,
      experienceLevel: "mid",
      profitMargin: 30,
      vacationWeeks: 4,
      taxRate: 20,
      currency: "USD",
      name: "",
      projectDuration: 10,
      projectComplexity: "medium",
      riskFactor: 15
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Calculate rates
    const workingWeeks = 52 - values.vacationWeeks;
    const totalYearlyHours = values.weeklyHours * workingWeeks;

    // Experience multiplier
    const experienceMultiplier =
      values.experienceLevel === "junior"
        ? 1
        : values.experienceLevel === "mid"
        ? 1.5
        : 2;

    // Base hourly rate calculation
    const yearlyExpenses = values.fixedCosts * 12;
    const baseHourlyRate = yearlyExpenses / totalYearlyHours;

    // Add profit margin
    const profitMultiplier = 1 + values.profitMargin / 100;
    let hourlyRate = baseHourlyRate * profitMultiplier * experienceMultiplier;

    // Account for taxes
    hourlyRate = hourlyRate / (1 - values.taxRate / 100);

    // Calculate other rates
    const dailyRate = hourlyRate * 8;
    const weeklyRate = dailyRate * 5;
    const monthlyRate = weeklyRate * 4;

    // Project rate calculation
    let projectRate = 0;
    if (values.projectDuration) {
      // Complexity multiplier
      const complexityMultiplier =
        values.projectComplexity === "low"
          ? 1
          : values.projectComplexity === "medium"
          ? 1.2
          : 1.5;

      // Risk factor
      const riskMultiplier = 1 + (values.riskFactor || 0) / 100;

      // Calculate project rate
      projectRate =
        dailyRate *
        values.projectDuration *
        complexityMultiplier *
        riskMultiplier;
    }

    const result = {
      ...values,
      hourlyRate,
      dailyRate,
      weeklyRate,
      monthlyRate,
      projectRate,
      date: new Date().toISOString()
    };

    addCalculation(result);
  };

  useEffect(() => {
    const currency = form.getValues().currency;
    if (currency !== selectedCurrency) {
      setSelectedCurrency(currency);
    }
  }, [form.getValues, selectedCurrency]);

  // Modificar el return para añadir la pestaña de proyecto
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Calculadora de Tarifas para Freelancers</CardTitle>
                <CardDescription>
                  Calcula cuánto deberías cobrar por tus servicios
                </CardDescription>
              </div>
              <TabsList>
                <TabsTrigger value="calculator">Calculadora</TabsTrigger>
                <TabsTrigger value="project">Proyecto</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="calculator">
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del Presupuesto</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej: Proyecto Web para Cliente X"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Un nombre para identificar este presupuesto
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="fixedCosts"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Costos Fijos Mensuales</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="1000"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Incluye alquiler, servicios, software, etc.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="weeklyHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horas Semanales</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="40"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Horas que trabajas por semana
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="experienceLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nivel de Experiencia</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tu nivel" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="junior">Junior</SelectItem>
                                  <SelectItem value="mid">
                                    Intermedio
                                  </SelectItem>
                                  <SelectItem value="senior">Senior</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Tu nivel afecta la tarifa recomendada
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Moneda</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona moneda" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {currencies.map((currency) => (
                                    <SelectItem key={currency} value={currency}>
                                      {currency}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Moneda para tus cálculos
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="profitMargin"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Margen de Ganancia: {value}%</FormLabel>
                            <FormControl>
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                defaultValue={[value]}
                                onValueChange={(vals) => onChange(vals[0])}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Porcentaje de ganancia sobre tus costos
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="vacationWeeks"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Semanas de Vacaciones</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="4"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Semanas de descanso al año
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="taxRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tasa de Impuestos (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="20"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Porcentaje que pagas en impuestos
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Calcular Tarifas
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </TabsContent>

              <TabsContent value="project">
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="projectDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Duración del Proyecto (días)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="10"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Días laborables estimados para completar el
                                proyecto
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="projectComplexity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complejidad del Proyecto</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona complejidad" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Baja</SelectItem>
                                  <SelectItem value="medium">Media</SelectItem>
                                  <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                La complejidad afecta el precio final
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="riskFactor"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Factor de Riesgo: {value}%</FormLabel>
                            <FormControl>
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                defaultValue={[value ?? 0]}
                                onValueChange={(vals) => onChange(vals[0])}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Porcentaje adicional para cubrir imprevistos
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="bg-muted p-4 rounded-md">
                        <h3 className="font-medium mb-2">Configuración Base</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          El cálculo de proyecto usa tu tarifa diaria base, que
                          depende de estos valores:
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="text-sm">
                            <div className="font-medium">Tarifa Base</div>
                            <div className="flex justify-between mt-1">
                              <span>Costos Fijos:</span>
                              <span>
                                {form.getValues().fixedCosts}{" "}
                                {form.getValues().currency}/mes
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>Horas Semanales:</span>
                              <span>{form.getValues().weeklyHours}h</span>
                            </div>
                          </div>

                          <div className="text-sm">
                            <div className="font-medium">Factores</div>
                            <div className="flex justify-between mt-1">
                              <span>Experiencia:</span>
                              <span className="capitalize">
                                {form.getValues().experienceLevel}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>Margen:</span>
                              <span>{form.getValues().profitMargin}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab("calculator")}
                          >
                            Editar Configuración Base
                          </Button>
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Calcular Tarifa del Proyecto
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </TabsContent>

              <TabsContent value="history">
                <CardContent>
                  <HistoryDisplay />
                </CardContent>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </Card>

      <div>
        <ResultsDisplay />
      </div>
    </div>
  );
}
