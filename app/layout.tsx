import Header from "@/components/Header/Header";
import { AuthProvider } from "@/context/AuthContext"; // путь уточни свой!
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
