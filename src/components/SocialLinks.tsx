import { useState } from "react";
import { MessageCircle, Music, Send, Share2, X } from "lucide-react";

const SOCIAL_URLS = {
  discord: "https://discord.gg/efl",
  tiktok: "https://tiktok.com/@efl_esports",
  telegram: "https://t.me/efl_esports",
};

export function SocialLinks() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {expanded && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 items-end">
          <a
            href={SOCIAL_URLS.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5865F2] text-white shadow-lg hover:scale-110 transition-transform"
            title="Discord"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <a
            href={SOCIAL_URLS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white shadow-lg hover:scale-110 transition-transform"
            title="TikTok"
          >
            <Music className="w-5 h-5" />
          </a>
          <a
            href={SOCIAL_URLS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0088CC] text-white shadow-lg hover:scale-110 transition-transform"
            title="Telegram"
          >
            <Send className="w-5 h-5" />
          </a>
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#E8751A] text-white shadow-xl hover:bg-[#D46615] hover:scale-105 transition-all"
      >
        {expanded ? <X className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
      </button>
    </div>
  );
}
