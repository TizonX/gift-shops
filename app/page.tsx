import Home from "@/components/Home";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { Suspense } from "react";

export default function ParentHome() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Home />
    </Suspense>
  );
}
