import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppNavbar from '@/components/layout/AppNavbar';
import AppFooter from '@/components/layout/AppFooter';
import EmergencyCalm from '@/components/early-childhood/EmergencyCalm';
import ServiceWorkerRegister from '@/components/layout/ServiceWorkerRegister';
import { SensorySoundscapeDrawer } from '@/components/layout/SensorySoundscapeDrawer';

export const metadata: Metadata = {
  title: 'SpectrumOS — Modular Neurodiversity & Assistive Platform',
  description:
    'An adaptive, offline-first assistive operating environment crafted for autistic children, adolescents, adults, and caregivers. Organic high-tech interface with neurodiversity-affirming sensory ergonomics.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0284c7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="calm-blue" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-500/20 font-body relative overflow-x-hidden">
        {/* Subtle Ambient Mesh Gradient Glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-60 dark:opacity-30">
          <div className="ambient-orb ambient-orb-1" />
          <div className="ambient-orb ambient-orb-2" />
          <div className="ambient-orb ambient-orb-3" />
        </div>

        <ServiceWorkerRegister />
        <AppNavbar />
        <main className="flex-1 w-full pb-12">
          {children}
        </main>
        <AppFooter />
        <SensorySoundscapeDrawer />
        <EmergencyCalm />
      </body>
    </html>
  );
}
