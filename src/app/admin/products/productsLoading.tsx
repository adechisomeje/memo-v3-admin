import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsManagementSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-10 w-[400px]" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[280px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="overflow-hidden">
              <div className="border-b">
                <div className="grid grid-cols-12 gap-4 p-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-6" />
                  ))}
                </div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6 hidden md:block" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-[200px]" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
