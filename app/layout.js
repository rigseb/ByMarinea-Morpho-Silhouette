import "../styles/globals.css";

export const metadata = {
  title: "By Marinea - Morphologie",
  description: "Diagnostic morphologique premium",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}