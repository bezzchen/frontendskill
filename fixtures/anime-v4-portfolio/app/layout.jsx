import "./globals.css";

export const metadata = {
  title: "Jordan Lee",
  description: "Selected projects and experience of Jordan Lee, software engineer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
