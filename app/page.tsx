import Home from "@/components/Home";
import FullPageLoader from "@/components/ui/FullPageLoader";
import { Suspense } from "react";

export default function ParentHome() {
  return (
    <Suspense fallback={<FullPageLoader/>}>
      <Home />
    </Suspense>
  );
}
