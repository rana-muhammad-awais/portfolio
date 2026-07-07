import type { Metadata } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muhammad Awais — AI/ML Engineer",
  description:
    "I build machine learning systems that see, predict, and ship. Portfolio of Muhammad Awais — AI/ML Engineer specializing in computer vision, predictive modeling, and full-stack deployment.",
  keywords: [
    "AI Engineer",
    "ML Engineer",
    "Machine Learning",
    "Computer Vision",
    "TensorFlow",
    "Python",
    "Portfolio",
    "Muhammad Awais",
  ],
  openGraph: {
    title: "Muhammad Awais — AI/ML Engineer",
    description:
      "I build machine learning systems that see, predict, and ship.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="antialiased"
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash: apply dark class before paint if stored in localStorage */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-base text-content font-body transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
