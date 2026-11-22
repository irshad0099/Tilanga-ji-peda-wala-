import Link from "next/link";
import { Empty } from "@/components/ui";

export default function NotFound() {
  return (
    <Empty title="Not found">
      That order or page doesn't exist. <Link href="/orders" className="font-bold text-leaf underline">Back to orders</Link>
    </Empty>
  );
}
