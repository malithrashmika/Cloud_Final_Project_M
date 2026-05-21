import "./globals.css";

export const metadata = {
  title: "InventoryFlow | Enterprise Asset & Borrowing Management",
  description: "InventoryFlow - The ultimate enterprise-grade inventory management and borrowing tracking system for seamless asset administration.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
