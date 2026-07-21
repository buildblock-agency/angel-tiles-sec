export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-garnet-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] text-stone-500 uppercase tracking-[0.3em] font-bold">Loading</span>
      </div>
    </div>
  );
}
