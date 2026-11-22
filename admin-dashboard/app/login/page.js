import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-leaf-dark px-4">
      <span aria-hidden="true" className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-haldi/25 blur-3xl" />
      <span aria-hidden="true" className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-leaf/50 blur-3xl" />
      <div className="fade-in relative w-full max-w-sm rounded-3xl bg-cream p-8 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Tilangaji" className="mx-auto h-24 w-auto" />
        <h1 className="mt-4 text-center text-2xl font-black text-leaf-dark">Shop admin</h1>
        <p className="mt-1 text-center text-sm text-ink/60">Orders, products and settings for tilangaji.com</p>
        <LoginForm next={typeof next === "string" ? next : "/"} />
      </div>
    </main>
  );
}
