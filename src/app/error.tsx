'use client';

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
        <span className="text-garnet-400 text-xs font-bold uppercase tracking-[0.3em]">Error</span>
        <h1 className="font-serif text-3xl text-silver-100 uppercase tracking-wide">Something went wrong</h1>
        <p className="text-xs text-stone-400 leading-relaxed">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-garnet-400 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-garnet-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
