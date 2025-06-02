export default function LoadingSkeleton() {
  // You can use a library like react-loading-skeleton or just make simple placeholders
  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-24 bg-gray-300 animate-pulse rounded mb-4"
          style={{ width: "100%" }}
        />
      ))}
    </div>
  );
}
