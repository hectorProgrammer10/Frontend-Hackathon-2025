// Loading Component

import { AlertCircle, Ban, Search } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent 
                      border-t-purple-500 animate-spin"></div>
      </div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-white/10 rounded-2xl mb-3"></div>
          <div className="h-4 bg-white/10 rounded mb-2"></div>
          <div className="h-3 bg-white/10 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <span className="text-4xl"><AlertCircle size={36} className="text-yellow-500"></AlertCircle></span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Oops!</h3>
      <p className="text-white/60 max-w-md">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = 'No Results Found',
  description = 'Try adjusting your search or filters'
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <span className="text-4xl"><Search size={36}></Search></span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/60 max-w-md">{description}</p>
    </div>
  );
}
