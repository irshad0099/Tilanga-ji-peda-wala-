// Invoices are private to each customer — keep them out of search.
export const metadata = {
  title: "Invoice",
  robots: { index: false, follow: false },
};

export default function Layout({ children }) {
  return children;
}
