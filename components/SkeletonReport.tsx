export function SkeletonReport() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      {/* Network Row Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="border-b border-[#2A2F3A] pb-1.5">
          <div className="h-3 w-20 bg-[#2A2F3A] rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg p-4 h-24" />
          <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg p-4 h-24" />
        </div>
      </div>

      {/* Page Structure Row Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="border-b border-[#2A2F3A] pb-1.5">
          <div className="h-3 w-16 bg-[#2A2F3A] rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg p-4 h-24 lg:col-span-4" />
          <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg p-4 h-24 lg:col-span-5" />
          <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg p-4 h-24 lg:col-span-3" />
        </div>
      </div>

      {/* Accessibility & Content Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <div className="border-b border-[#2A2F3A] pb-1.5">
            <div className="h-3 w-24 bg-[#2A2F3A] rounded" />
          </div>
          <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg p-4 h-24" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="border-b border-[#2A2F3A] pb-1.5">
            <div className="h-3 w-20 bg-[#2A2F3A] rounded" />
          </div>
          <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg p-4 h-24" />
        </div>
      </div>
    </div>
  );
}
