export const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 animate-pulse">
          <div className="aspect-[4/5] bg-gray-200" />
          <div className="p-6 space-y-3">
            <div className="h-3 w-1/3 bg-gray-200 rounded" />
            <div className="h-6 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};