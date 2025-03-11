"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowRight,
  Calculator,
  Clock,
  DollarSign,
  LineChart,
  Briefcase,
  Target,
  Info
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const formSchema = z.object({
  experienceLevel: z.string(),
  monthlyExpenses: z.coerce
    .number()
    .min(0, "Expenses must be a positive number"),
  hoursPerWeek: z.coerce
    .number()
    .min(1, "Must work at least 1 hour")
    .max(168, "There are only 168 hours in a week"),
  weeksPerYear: z.coerce
    .number()
    .min(1, "Must work at least 1 week")
    .max(52, "There are only 52 weeks in a year"),
  vacationWeeks: z.coerce
    .number()
    .min(0, "Vacation weeks cannot be negative")
    .max(52, "Vacation weeks cannot exceed 52"),
  profitMargin: z.coerce
    .number()
    .min(0, "Profit margin cannot be negative")
    .max(100, "Profit margin cannot exceed 100%"),
  projectComplexity: z.string()
});

export default function FreelancePricingCalculator() {
  const [calculatedRates, setCalculatedRates] = useState<{
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experienceLevel: "intermediate",
      monthlyExpenses: 2000,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      vacationWeeks: 4,
      profitMargin: 30,
      projectComplexity: "medium"
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Calculate available working hours per year
    const workingWeeks = values.weeksPerYear - values.vacationWeeks;
    const workingHoursPerYear = workingWeeks * values.hoursPerWeek;

    // Calculate annual expenses
    const annualExpenses = values.monthlyExpenses * 12;

    // Apply experience level multiplier
    let experienceMultiplier = 1;
    switch (values.experienceLevel) {
      case "beginner":
        experienceMultiplier = 0.8;
        break;
      case "intermediate":
        experienceMultiplier = 1;
        break;
      case "expert":
        experienceMultiplier = 1.5;
        break;
      case "specialist":
        experienceMultiplier = 2;
        break;
    }

    // Apply project complexity multiplier
    let complexityMultiplier = 1;
    switch (values.projectComplexity) {
      case "low":
        complexityMultiplier = 0.8;
        break;
      case "medium":
        complexityMultiplier = 1;
        break;
      case "high":
        complexityMultiplier = 1.3;
        break;
      case "very-high":
        complexityMultiplier = 1.6;
        break;
    }

    // Calculate base rate needed to cover expenses
    const baseRatePerHour = annualExpenses / workingHoursPerYear;

    // Apply profit margin
    const profitMultiplier = 1 + values.profitMargin / 100;

    // Calculate final hourly rate with all factors
    const hourlyRate =
      baseRatePerHour *
      profitMultiplier *
      experienceMultiplier *
      complexityMultiplier;

    // Calculate other time-based rates
    setCalculatedRates({
      hourly: Math.round(hourlyRate),
      daily: Math.round(hourlyRate * 8),
      weekly: Math.round(hourlyRate * values.hoursPerWeek),
      monthly: Math.round(hourlyRate * values.hoursPerWeek * 4.33),
      yearly: Math.round(hourlyRate * workingHoursPerYear)
    });
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Freelance Pricing Calculator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Determine your ideal freelance rates based on your experience,
          expenses, and desired profit margin.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your Rates</CardTitle>
              <CardDescription>
                Fill in the details below to get your recommended pricing
                structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">
                              Beginner (0-2 years)
                            </SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate (2-5 years)
                            </SelectItem>
                            <SelectItem value="expert">
                              Expert (5-10 years)
                            </SelectItem>
                            <SelectItem value="specialist">
                              Specialist (10+ years)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Your experience level affects your market value
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthlyExpenses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Monthly Expenses
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Include all business expenses, taxes,
                                  insurance, software subscriptions, etc.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="2000"
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your monthly business and living expenses
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hoursPerWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours Per Week</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="40" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weeksPerYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weeks Per Year</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="52" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="vacationWeeks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vacation Weeks Per Year</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="4" {...field} />
                        </FormControl>
                        <FormDescription>
                          Time off for holidays, sick days, and vacation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profitMargin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profit Margin ({field.value}%)</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription>
                          Your desired profit margin above expenses
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
                        <FormLabel>Project Complexity</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project complexity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">
                              Low (Simple tasks)
                            </SelectItem>
                            <SelectItem value="medium">
                              Medium (Standard projects)
                            </SelectItem>
                            <SelectItem value="high">
                              High (Complex projects)
                            </SelectItem>
                            <SelectItem value="very-high">
                              Very High (Specialized expertise)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          More complex projects justify higher rates
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Calculate Rates <Calculator className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          {calculatedRates ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Recommended Rates</CardTitle>
                <CardDescription>
                  Based on your inputs, here are your recommended freelance
                  rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="hourly" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="hourly">Hourly</TabsTrigger>
                    <TabsTrigger value="project">Project-Based</TabsTrigger>
                    <TabsTrigger value="retainer">Retainer</TabsTrigger>
                  </TabsList>
                  <TabsContent value="hourly" className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <RateCard
                        icon={<Clock />}
                        title="Hourly Rate"
                        rate={`$${calculatedRates.hourly}`}
                        description="Charge this amount for each hour of work"
                      />
                      <RateCard
                        icon={<Briefcase />}
                        title="Daily Rate (8 hours)"
                        rate={`$${calculatedRates.daily}`}
                        description="Charge this amount for a full day of work"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="project" className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <RateCard
                        icon={<Target />}
                        title="Project Minimum"
                        rate={`$${calculatedRates.daily * 3}`}
                        description="Minimum charge for small projects (3 days)"
                      />
                      <div className="p-6 border rounded-lg bg-muted/50">
                        <h3 className="font-medium mb-2">
                          Project Pricing Formula
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          For fixed-price projects, estimate the hours required
                          and multiply by your hourly rate, then add a 20%
                          buffer for unexpected work.
                        </p>
                        <div className="bg-background p-3 rounded text-sm font-mono">
                          Project Price = (Estimated Hours × $
                          {calculatedRates.hourly}) × 1.2
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="retainer" className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <RateCard
                        icon={<LineChart />}
                        title="Weekly Retainer"
                        rate={`$${calculatedRates.weekly}`}
                        description="For ongoing weekly commitment"
                      />
                      <RateCard
                        icon={<DollarSign />}
                        title="Monthly Retainer"
                        rate={`$${calculatedRates.monthly}`}
                        description="For ongoing monthly commitment"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground mb-4">
                  These rates are calculated based on your inputs and should be
                  adjusted according to your market, client type, and specific
                  project requirements.
                </p>
                <Button variant="outline" onClick={() => window.print()}>
                  Save or Print These Rates
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex flex-col justify-center items-center p-8 text-center">
              <div className="mb-6">
                <Calculator className="h-16 w-16 text-primary/20 mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  Your Rates Will Appear Here
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Fill out the form and click "Calculate Rates" to see your
                  recommended freelance pricing structure.
                </p>
              </div>
              <div className="grid gap-4 w-full max-w-md mt-8">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Time-Based Rates</h4>
                    <p className="text-sm text-muted-foreground">
                      Hourly, daily, and weekly rates
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Project-Based Pricing</h4>
                    <p className="text-sm text-muted-foreground">
                      Fixed prices for defined scope
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <LineChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Retainer Options</h4>
                    <p className="text-sm text-muted-foreground">
                      For ongoing client relationships
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <FeatureCard
          icon={<Calculator className="h-10 w-10 text-primary" />}
          title="Accurate Pricing"
          description="Our calculator considers all your expenses, experience level, and desired profit margin to ensure you're charging what you're worth."
        />
        <FeatureCard
          icon={<Target className="h-10 w-10 text-primary" />}
          title="Multiple Rate Options"
          description="Get recommendations for hourly, daily, project-based, and retainer pricing to suit different client engagements."
        />
        <FeatureCard
          icon={<ArrowRight className="h-10 w-10 text-primary" />}
          title="Take Action Today"
          description="Stop undercharging for your services. Use our calculator to set rates that reflect your true value and expertise."
        />
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to charge what you're worth?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Use our calculator to determine your ideal rates and start earning
          what you deserve as a freelancer.
        </p>
        <Button
          size="lg"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Calculate Your Rates Now
        </Button>
      </div>
    </div>
  );
}

function RateCard({
  icon,
  title,
  rate,
  description
}: {
  icon: React.ReactNode;
  title: string;
  rate: string;
  description: string;
}) {
  return (
    <div className="flex items-center p-4 border rounded-lg">
      <div className="bg-primary/10 p-3 rounded-full mr-4">{icon}</div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-2xl font-bold">{rate}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border rounded-lg p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
