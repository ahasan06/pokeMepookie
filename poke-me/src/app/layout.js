
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
      <body>
      <Navbar/>
      {children}
      <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}
