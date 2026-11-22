import Sidebar from "@/components/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { OPEN_STATUSES } from "@/lib/orders";
import { SHOP_URL } from "@/lib/shop";

// Every page here needs live data and a signed-in admin.
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }) {
  const email = await requireAdmin();
  let openCount = 0;
  if (isDbConfigured()) {
    try {
      openCount = await (await getDb()).collection("orders").countDocuments({ status: { $in: OPEN_STATUSES } });
    } catch {
      // The page itself reports the database problem.
    }
  }

  return (
    <div className="min-h-screen">
      <Sidebar email={email} openCount={openCount} shopUrl={SHOP_URL} />
      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
