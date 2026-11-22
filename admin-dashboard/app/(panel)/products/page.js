import { listProducts } from "@/lib/data";
import { isDbConfigured } from "@/lib/mongodb";
import { importProducts } from "@/app/actions";
import { shopImage } from "@/lib/shop";
import { PageHeader, Empty, DbMissing } from "@/components/ui";
import ProductForm from "@/components/ProductForm";

export const metadata = { title: "Products" };

export default async function ProductsPage() {
  if (!isDbConfigured()) return <DbMissing />;
  const products = await listProducts();
  const shown = products.filter((p) => p.deliverable);
  const hidden = products.filter((p) => !p.deliverable);

  return (
    <>
      <PageHeader title="Products" subtitle="Price, MRP and stock update on the shop as soon as you save." />

      {products.length === 0 ? (
        <Empty title="No products in the database yet">
          <p>The shop is showing its built-in menu. Import it once to start editing prices and stock here.</p>
          <form action={importProducts} className="mt-4">
            <button className="btn bg-leaf-dark text-cream hover:bg-leaf">Import the shop's menu</button>
          </form>
        </Empty>
      ) : (
        <div className="space-y-6">
          {shown.map((p) => <ProductForm key={p._id} product={p} image={shopImage(p.image)} />)}
          {hidden.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer list-none text-sm font-bold text-ink/60 hover:text-leaf">
                <span className="mr-1 inline-block transition group-open:rotate-90">▸</span>
                {hidden.length} hidden product{hidden.length === 1 ? "" : "s"} (not on the shop)
              </summary>
              <div className="mt-4 space-y-6">
                {hidden.map((p) => <ProductForm key={p._id} product={p} image={shopImage(p.image)} />)}
              </div>
            </details>
          )}
        </div>
      )}
    </>
  );
}
