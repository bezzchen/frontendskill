import "./globals.css";

export const metadata = {
  title: "Meridian",
  description: "Meridian is a timeline-based motion editor for the web. Design animation visually, ship production code.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
