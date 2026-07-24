export function SkeletonReport() {
  const sections = [
    { title: "Network", count: 2 },
    { title: "SEO", count: 3 },
    { title: "Accessibility", count: 1 },
    { title: "Content", count: 1 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      {sections.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-[#2A2F3A] pb-1.5">
            <div className="h-3 w-20 bg-[#2A2F3A] rounded" />
          </div>
          <div
            className={`grid grid-cols-1 ${
              section.count > 1 ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            } gap-4`}
          >
            {Array.from({ length: section.count }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="bg-[#161B22] border border-[#2A2F3A] rounded-lg p-5 flex flex-col justify-between h-28"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="h-3 w-24 bg-[#1B2028] rounded" />
                  <div className="h-2 w-2 rounded-full bg-[#2A2F3A]" />
                </div>
                <div className="h-6 w-36 bg-[#1B2028] rounded" />
                <div className="h-3 w-28 bg-[#1B2028] rounded mt-2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
