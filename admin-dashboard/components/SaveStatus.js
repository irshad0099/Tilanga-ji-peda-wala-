// The line under a save button: error, or "Saved" (and whether the shop
// picked up the change immediately).
export default function SaveStatus({ state }) {
  if (!state) return null;
  if (state.error) return <p className="text-sm font-semibold text-rose-600">{state.error}</p>;
  if (state.ok)
    return (
      <p key={state.at} className="fade-in text-sm font-semibold text-emerald-700">
        ✓ Saved{state.live ? " — live on the shop now" : " — the shop will show it within 5 minutes"}
      </p>
    );
  return null;
}
