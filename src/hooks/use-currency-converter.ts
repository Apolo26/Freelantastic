import { useState, useEffect } from "react";
const API_URL = "https://v6.exchangerate-api.com/v6";
const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY; // Debe estar en .env.local

export function useCurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`${API_URL}/${API_KEY}/latest/USD`);
        const data = await response.json();

        if (data.result === "success") {
          setRates(data.conversion_rates);
        } else {
          console.error("Error en la respuesta de la API", data);
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    if (API_KEY) {
      fetchRates();
    } else {
      console.error("API Key no definida. Verifica .env.local");
    }
  }, []);

  const convertCurrency = (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    if (fromCurrency === toCurrency) return amount;
    const amountInUSD =
      fromCurrency === "USD" ? amount : amount / (rates[fromCurrency] || 1);
    return toCurrency === "USD"
      ? amountInUSD
      : amountInUSD * (rates[toCurrency] || 1);
  };

  return {
    currencies: Object.keys(rates),
    rates,
    selectedCurrency,
    setSelectedCurrency,
    convertCurrency
  };
}
