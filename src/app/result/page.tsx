"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import StarBackground from "@/components/StarBackground";
import FloatingParticles from "@/components/FloatingParticles";

interface KeywordData {
  keyword: string;
  emoji: string;
  description: string;
}

interface ResultData {
  name: string;
  birthDate: string;
  keywords: KeywordData[];
  summary: string;
  luckyColor: string;
  luckyNumber: number;
  luckyColorHex: string;
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [revealed, setRevealed] = useState([false, false, false]);
  const [showSummary, setShowSummary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("keywordResult");
    if (!stored) {
      router.replace("/check");
      return;
    }
    setResult(JSON.parse(stored));

    setTimeout(() => setRevealed([true, false, false]), 300);
    setTimeout(() => setRevealed([true, true, false]), 700);
    setTimeout(() => setRevealed([true, true, true]), 1100);
    setTimeout(() => setShowSummary(true), 1500);
  }, [router]);

  const shareText = result
    ? `🔮 2026 나의 키워드 3개\n\n${result.keywords.map((k) => `${k.emoji} ${k.keyword}`).join("\n")}\n\n✨ ${result.summary}\n\n나도 확인하기 👉`
    : "";

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShareKakao = () => {
    const url = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleSaveImage = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0a1a",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `2026-keywords-${result?.name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("이미지 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleShareInstagram = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0a1a",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.share && navigator.canShare) {
          const file = new File([blob], "2026-keywords.png", { type: "image/png" });
          const shareData = { files: [file] };
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            setSaving(false);
            return;
          }
        }
        // Fallback: download the image
        const link = document.createElement("a");
        link.download = `2026-keywords-${result?.name}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        setSaving(false);
      }, "image/png");
    } catch {
      setSaving(false);
    }
  };

  if (!result) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <StarBackground />
        <div className="relative z-10 text-center">
          <div className="crystal-ball mx-auto mb-4" />
          <p className="text-gray-400">결과를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  const cardGradients = [
    "from-amber-500/20 via-yellow-600/10 to-orange-500/20",
    "from-purple-500/20 via-violet-600/10 to-indigo-500/20",
    "from-cyan-500/20 via-blue-600/10 to-teal-500/20",
  ];

  const cardBorders = [
    "border-amber-400/20",
    "border-purple-400/20",
    "border-cyan-400/20",
  ];

  const numberEmojis = ["1️⃣", "2️⃣", "3️⃣"];

  return (
    <main className="relative min-h-screen pb-20 px-4">
      <StarBackground />
      <FloatingParticles />

      <div className="relative z-10 max-w-lg mx-auto pt-8 sm:pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm mb-1">
            {result.name}님의 2026년
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="text-gradient-gold">나의 키워드 3개</span>
          </h1>
        </div>

        {/* Capturable card area - Instagram story ratio */}
        <div
          ref={cardRef}
          className="result-card-capture rounded-3xl p-6 sm:p-8 overflow-hidden"
        >
          {/* Card header inside capture area */}
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🔮</div>
            <p className="text-gray-400 text-xs mb-1">{result.name}님의</p>
            <h2 className="text-xl font-bold text-gradient-gold">
              2026 키워드
            </h2>
          </div>

          {/* Keyword cards */}
          <div className="space-y-4 mb-6">
            {result.keywords.map((kw, index) => (
              <div
                key={index}
                className={`rounded-2xl p-5 bg-gradient-to-br ${cardGradients[index]} border ${cardBorders[index]} backdrop-blur-sm transition-all duration-700 ${
                  revealed[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0 mt-0.5">
                    {kw.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs opacity-50">{numberEmojis[index]}</span>
                      <h3 className="text-lg font-bold text-white">
                        #{kw.keyword}
                      </h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {kw.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary section */}
          <div
            className={`text-center transition-all duration-700 ${
              showSummary
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-300/30" />
              <span className="text-gold-300/50 text-xs">✦</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-300/30" />
            </div>

            {/* Overall summary */}
            <p className="text-gray-300 text-sm italic mb-5 leading-relaxed px-2">
              &ldquo;{result.summary}&rdquo;
            </p>

            {/* Lucky items */}
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <p className="text-gray-500 text-[10px] mb-1.5 tracking-wider">LUCKY COLOR</p>
                <div className="flex items-center gap-1.5 justify-center">
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-lg"
                    style={{
                      backgroundColor: result.luckyColorHex,
                      boxShadow: `0 0 12px ${result.luckyColorHex}40`,
                    }}
                  />
                  <span className="text-gray-300 text-xs font-medium">
                    {result.luckyColor}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-[10px] mb-1.5 tracking-wider">LUCKY NUMBER</p>
                <span className="text-gradient-gold text-xl font-bold">
                  {result.luckyNumber}
                </span>
              </div>
            </div>

            {/* Watermark */}
            <p className="text-gray-600 text-[10px] mt-6">
              2026 나의 키워드 3개 ✦ AI 운세
            </p>
          </div>
        </div>

        {/* Action buttons outside capture area */}
        <div
          className={`mt-8 transition-all duration-700 ${
            showSummary
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {/* Save & Share as image */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleSaveImage}
              disabled={saving}
              className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {saving ? "⏳ 저장 중..." : "📸 이미지 저장"}
            </button>
            <button
              onClick={handleShareInstagram}
              disabled={saving}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-500/20 border border-purple-400/20 text-purple-300 text-sm font-medium hover:from-purple-600/30 hover:to-pink-500/30 transition-all disabled:opacity-50"
            >
              📷 인스타 공유
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleShareKakao}
              className="share-btn flex-1 py-3 rounded-2xl bg-[#FEE500]/10 border border-[#FEE500]/20 text-[#FEE500] text-sm font-medium hover:bg-[#FEE500]/20"
            >
              💬 카카오톡
            </button>
            <button
              onClick={handleShareTwitter}
              className="share-btn flex-1 py-3 rounded-2xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] text-sm font-medium hover:bg-[#1DA1F2]/20"
            >
              🐦 트위터
            </button>
            <button
              onClick={handleCopyLink}
              className="share-btn flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10"
            >
              {copied ? "✅ 복사됨!" : "🔗 복사"}
            </button>
          </div>

          {/* CTA - try again / share */}
          <div className="text-center space-y-3 mt-6">
            <button
              onClick={() => {
                sessionStorage.removeItem("keywordResult");
                router.push("/check");
              }}
              className="btn-glow w-full py-4 rounded-full text-base tracking-wide"
            >
              👀 친구 키워드도 확인하기
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              처음으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
