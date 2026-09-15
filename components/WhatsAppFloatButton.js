import { getSettings } from "@/lib/db/settings.server";

export default async function WhatsAppFloatButton() {
  const { whatsapp, shop } = await getSettings();
  const text = encodeURIComponent(`Hi ${shop.shortName}, I'd like to know more about your peda.`);

  return (
    <a
      href={`https://wa.me/${whatsapp.number}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 sm:bottom-6"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff" aria-hidden="true">
        <path d="M16.02 3C9.4 3 4 8.35 4 14.94c0 2.2.6 4.26 1.65 6.04L3.4 29l8.24-2.16a12.9 12.9 0 0 0 4.38.77h.01c6.62 0 12.02-5.35 12.02-11.94C28.05 8.35 22.65 3 16.02 3zm0 21.77h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.89 1.02 1.04-3.8-.24-.39a9.83 9.83 0 0 1-1.5-5.06c0-5.44 4.45-9.87 9.92-9.87 2.65 0 5.13 1.03 7.01 2.9a9.79 9.79 0 0 1 2.9 6.97c0 5.44-4.45 9.83-9.82 9.83zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.24-.46-2.37-1.47-.87-.78-1.47-1.74-1.64-2.03-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.5-.17 0-.37-.02-.56-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.24-.68.24-1.27.17-1.4-.07-.13-.27-.2-.56-.35z" />
      </svg>
    </a>
  );
}
