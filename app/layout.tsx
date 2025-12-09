"use client";
import Header from "@/components/Header/Header";
import { AuthProvider } from "@/context/AuthContext";
import { Montserrat } from "next/font/google"; //💡
import "./globals.css";
// 💡 Подключение шрифта
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["200", "400", "500", "600", "700"], // 💡Укажи нужные начертания
  variable: "--font-montserrat", // 💡Можно использовать в CSS как var(--font-montserrat)
  display: "swap",
});
export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
