export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-garnet-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] text-stone-500 uppercase tracking-[0.3em] font-bold">Products</span>
      </div>
    </div>
  );
}
