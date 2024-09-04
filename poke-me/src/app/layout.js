
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
      <body>{children}
      <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}
