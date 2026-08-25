import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppNavbar from '@/components/layout/AppNavbar';
import EmergencyCalm from '@/components/early-childhood/EmergencyCalm';
import ServiceWorkerRegister from '@/components/layout/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'SpectrumOS - Modular Neurodiversity & Autism Assistive Platform',
  description:
    'An adaptive, offline-first assistive platform supporting autistic children, adolescents, adults, and caregivers across communication, sensory regulation, and executive functioning.',
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
  themeColor: '#0f88eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="calm-blue" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased transition-colors selection:bg-blue-500/20">
        <ServiceWorkerRegister />
        <AppNavbar />
        <main className="flex-1 w-full pb-12">
          {children}
        </main>
        <EmergencyCalm />
      </body>
    </html>
  );
}
