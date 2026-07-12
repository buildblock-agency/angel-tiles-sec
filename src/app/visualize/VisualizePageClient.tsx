'use client';

import dynamic from 'next/dynamic';

const VisualizerClient = dynamic(() => import("@/components/VisualizerClient"), {
  ssr: false,
});

export default function VisualizePageClient() {
  return <VisualizerClient />;
}
