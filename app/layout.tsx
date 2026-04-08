import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://puffico.ge";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Puffico — ბუნებრივი ხელნაკეთი პუფები",
    template: "%s | Puffico",
  },
  description:
    "Puffico — ქართული ბრენდი, რომელიც ამზადებს ნატურალური შიგთავსის ხელნაკეთ პუფებს. ბუნებრივი მასალები, ადგილობრივი წარმოება.",
  keywords: ["პუფი", "ხელნაკეთი", "ნატურალური", "ქართული", "Puffico", "pouf", "handmade"],
  authors: [{ name: "Puffico" }],
  creator: "Puffico",
  openGraph: {
    type: "website",
    locale: "ka_GE",
    url: BASE_URL,
    siteName: "Puffico",
    title: "Puffico — ბუნებრივი ხელნაკეთი პუფები",
    description:
      "ქართული ბრენდი, რომელიც ამზადებს ნატურალური შიგთავსის ხელნაკეთ პუფებს.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Puffico — ბუნებრივი ხელნაკეთი პუფები",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Puffico — ბუნებრივი ხელნაკეთი პუფები",
    description: "ქართული ბრენდი, რომელიც ამზადებს ნატურალური შიგთავსის ხელნაკეთ პუფებს.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Puffico",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "ქართული ბრენდი, რომელიც ამზადებს ნატურალური შიგთავსის ხელნაკეთ პუფებს.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "GE",
    addressLocality: "თბილისი",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+995-599-000-000",
    email: "hello@puffico.ge",
    contactType: "customer service",
    availableLanguage: "Georgian",
  },
  sameAs: [
    "https://www.instagram.com/puffico.ge",
    "https://www.facebook.com/puffico.ge",
  ],
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Puffico",
  url: BASE_URL,
  telephone: "+995-599-000-000",
  email: "hello@puffico.ge",
  priceRange: "₾₾",
  currenciesAccepted: "GEL",
  paymentAccepted: "Cash on delivery",
  address: {
    "@type": "PostalAddress",
    addressCountry: "GE",
    addressLocality: "თბილისი",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-puff-white text-puff-dark">
        {children}
      </body>
    </html>
  );
}
