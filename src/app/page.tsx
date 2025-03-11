"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startTransition } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    startTransition(() => {
      window.location.href = "/calculator";
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center overflow-hidden">
      <div className="relative px-2 sm:px-4">
        <div className="w-full">
          <h1 className="text-white font-bold leading-[0.85] tracking-[-0.02em] font-poppins w-full">
            <div className="w-full text-[16vw] sm:text-[18vw] md:text-[20vw] lg:text-[23vw] xl:text-[21vw]">
              FREELAN
            </div>
            <div className="w-full ml-3 relative text-[10vw] sm:text-[12vw] md:text-[14vw] lg:text-[16vw] xl:text-[19vw]">
              TASTIC
              <span
                className="absolute animate-cursor"
                style={{
                  marginLeft: "0.1em",
                  bottom: "0",
                  transform: "translateY(-10%)"
                }}
              >
                _
              </span>
            </div>
          </h1>
        </div>

        {/* Descripción */}
        <div className="relative pl-6 border-l-4 border-white mt-4 md:mt-8 mb-8 max-w-3xl ml-8">
          <p className="text-white text-xl md:text-2xl lg:text-3xl italic">
            Calcula y exporta tu tarifa como desarrollador de manera rápida y
            sencilla.
          </p>
        </div>

        <Link href="/calculator">
          <Button
            size="lg"
            className="text-black bg-white hover:bg-blue-50 text-lg px-8 py-6 pointer-events-auto ml-8"
          >
            Calcular ahora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
