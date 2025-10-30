import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Le Roi de la Sapologie - Concours de Style et d'Élégance",
  description: "Participez au plus prestigieux concours de sapologie ! Inscrivez-vous, montrez votre style unique et votez pour vos participants préférés. Une célébration de l'élégance et du raffinement.",
  keywords: ["sapologie", "fashion", "style", "concours", "élégance", "mode"],
  openGraph: {
    title: "Le Roi de la Sapologie",
    description: "Le concours de style et d'élégance par excellence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
