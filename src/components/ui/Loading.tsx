import { AlertCircle, Search } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div role="status" aria-label="Loading" className="flex items-center justify-center p-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent 
                      border-t-purple-500 animate-spin"></div>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-card/50 rounded-2xl mb-3"></div>
          <div className="h-4 bg-card/50 rounded mb-2"></div>
          <div className="h-3 bg-card/50 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <span className="text-4xl"><AlertCircle size={36} className="text-yellow-500"></AlertCircle></span>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">Oops!</h3>
      <p className="text-muted max-w-md">{message}</p>
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
      <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mb-4">
        <span className="text-4xl"><Search size={36}></Search></span>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted max-w-md">{description}</p>
    </div>
  );
}
