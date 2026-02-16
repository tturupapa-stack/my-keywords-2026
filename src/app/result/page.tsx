"use client";

import { useEffect, useRef, useState } from "react";
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
  const [shared, setShared] = useState(false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("keywordResult");
    if (!stored) {
      router.replace("/check");
      return;
    }

    setResult(JSON.parse(stored));

    const timers = [
      setTimeout(() => setRevealed([true, false, false]), 200),
      setTimeout(() => setRevealed([true, true, false]), 500),
      setTimeout(() => setRevealed([true, true, true]), 800),
      setTimeout(() => setShowSummary(true), 1100),
    ];

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [router]);

  const shareText = result
    ? `🔮 2026 나의 키워드 3개\n\n${result.keywords
        .map((k) => `${k.emoji} ${k.keyword}`)
        .join("\n")}\n\n✨ ${result.summary}\n\n나도 확인하기 👉`
    : "";

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op
    }
  };

  const handleShareResult = async () => {
    if (!result) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "2026 나의 키워드 3개",
          text: shareText,
          url: shareUrl,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // user cancelled or unsupported payload
      }
    }

    await handleCopyLink();
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

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setSaving(false);
          return;
        }

        try {
          if (navigator.share && navigator.canShare) {
            const file = new File([blob], "2026-keywords.png", {
              type: "image/png",
            });
            const shareData = { files: [file] };

            if (navigator.canShare(shareData)) {
              await navigator.share(shareData);
              setSaving(false);
              return;
            }
          }

          const link = document.createElement("a");
          link.download = `2026-keywords-${result?.name}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        } finally {
          setSaving(false);
        }
      }, "image/png");
    } catch {
      setSaving(false);
    }
  };

  if (!result) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-4">
        <StarBackground />
        <FloatingParticles />

        <div className="relative z-10 w-full max-w-md">
          <div className="result-card-capture rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="h-6 w-28 mx-auto rounded-full shimmer" />
            <div className="h-20 rounded-2xl shimmer" />
            <div className="h-20 rounded-2xl shimmer" />
            <div className="h-20 rounded-2xl shimmer" />
            <div className="h-16 rounded-2xl shimmer" />
          </div>
          <p className="text-center text-gray-300 text-sm mt-4" aria-live="polite">
            결과를 불러오는 중...
          </p>
        </div>
      </main>
    );
  }

  const cardGradients = [
    "from-[#FFD700]/20 via-[#FFD700]/8 to-[#A855F7]/14",
    "from-[#A855F7]/22 via-[#6366F1]/12 to-[#A855F7]/8",
    "from-[#6366F1]/22 via-[#A855F7]/10 to-[#FFD700]/10",
  ];

  const cardBorders = [
    "border-[#FFD700]/25",
    "border-[#A855F7]/25",
    "border-[#6366F1]/25",
  ];

  return (
    <main className="relative min-h-screen pb-20 px-4 sm:px-5">
      <StarBackground />
      <FloatingParticles />

      <div className="relative z-10 max-w-xl mx-auto pt-7 sm:pt-12">
        <div className="text-center mb-5">
          <p className="text-gray-300 text-sm mb-1">{result.name}님의 2026년</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-gradient-gold">핵심 키워드 3개</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            아래 카드 전체가 이미지로 저장돼요
          </p>
        </div>

        <div
          ref={cardRef}
          className="result-card-capture rounded-3xl p-5 sm:p-8 overflow-hidden"
          aria-label="2026 키워드 결과 카드"
        >
          <div className="text-center mb-6 sm:mb-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 px-3 py-1 mb-3">
              <span className="text-xs tracking-wide text-[#FFD700]">MYSTIC FORECAST 2026</span>
            </div>
            <p className="text-gray-300 text-xs mb-1">{result.name}님의 운세 키워드</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">당신의 흐름</h2>
          </div>

          <div className="space-y-3.5 sm:space-y-4 mb-6">
            {result.keywords.map((kw, index) => (
              <article
                key={index}
                className={`keyword-result-card rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${cardGradients[index]} ${cardBorders[index]} backdrop-blur-sm transition-all duration-500 ${
                  revealed[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                aria-label={`${index + 1}번째 키워드 ${kw.keyword}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/30 border border-white/15 text-lg sm:text-xl">
                    {kw.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFD700]/20 text-[#FFD700] text-[11px] px-1.5 font-semibold">
                        {index + 1}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">#{kw.keyword}</h3>
                    </div>
                    <p className="text-gray-200 text-sm sm:text-[15px] leading-relaxed">{kw.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div
            className={`text-center transition-all duration-500 ${
              showSummary ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#FFD700]/40" />
              <span className="text-[#FFD700]/60 text-xs">✦</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#A855F7]/50" />
            </div>

            <p className="text-gray-100 text-sm sm:text-base italic mb-5 leading-relaxed px-1 sm:px-4">
              &ldquo;{result.summary}&rdquo;
            </p>

            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              <div className="text-center rounded-xl bg-white/5 border border-white/10 py-3 px-2">
                <p className="text-gray-400 text-[10px] mb-2 tracking-wider">LUCKY COLOR</p>
                <div className="flex items-center gap-2 justify-center">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white/40"
                    style={{
                      backgroundColor: result.luckyColorHex,
                      boxShadow: `0 0 12px ${result.luckyColorHex}45, inset 0 0 0 1px rgba(255,255,255,0.2)`,
                    }}
                    aria-label={`행운의 색상 ${result.luckyColor}`}
                  />
                  <span className="text-gray-100 text-xs sm:text-sm font-semibold">{result.luckyColor}</span>
                </div>
                <p className="text-gray-400 text-[10px] mt-1">{result.luckyColorHex}</p>
              </div>

              <div className="text-center rounded-xl bg-white/5 border border-white/10 py-3 px-2">
                <p className="text-gray-400 text-[10px] mb-2 tracking-wider">LUCKY NUMBER</p>
                <span className="text-gradient-gold text-2xl sm:text-3xl font-bold leading-none">
                  {result.luckyNumber}
                </span>
              </div>
            </div>

            <p className="text-gray-500 text-[10px] mt-5">2026 나의 키워드 3개 ✦ AI 운세</p>
          </div>
        </div>

        <div
          className={`mt-6 sm:mt-8 transition-all duration-500 ${
            showSummary ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <button
              onClick={handleSaveImage}
              disabled={saving}
              aria-label="결과 카드를 이미지로 저장"
              className="py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {saving ? "⏳ 저장 중..." : "📸 이미지 저장"}
            </button>
            <button
              onClick={handleShareInstagram}
              disabled={saving}
              aria-label="인스타그램 공유용 이미지 만들기"
              className="py-3.5 rounded-2xl bg-gradient-to-r from-[#A855F7]/20 to-[#6366F1]/20 border border-[#A855F7]/35 text-purple-200 text-sm font-medium hover:from-[#A855F7]/30 hover:to-[#6366F1]/30 transition-all disabled:opacity-50"
            >
              📷 인스타 공유
            </button>
          </div>

          <p className="text-center text-gray-500 text-xs mb-4">
            일부 기기에서는 인스타 공유 대신 이미지 다운로드가 실행됩니다.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={handleShareResult}
              aria-label="결과 링크 공유하기"
              className="share-btn py-3 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/25 text-[#FFD700] text-sm font-medium hover:bg-[#FFD700]/18"
            >
              {shared ? "✅ 공유 완료" : "📤 공유하기"}
            </button>
            <button
              onClick={handleCopyLink}
              aria-label="결과 링크 복사하기"
              className="share-btn py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10"
            >
              {copied ? "✅ 복사됨" : "🔗 링크 복사"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={handleShareKakao}
              aria-label="카카오톡으로 공유"
              className="share-btn py-3 rounded-2xl bg-[#FEE500]/10 border border-[#FEE500]/20 text-[#FEE500] text-sm font-medium hover:bg-[#FEE500]/20"
            >
              💬 카카오톡
            </button>
            <button
              onClick={handleShareTwitter}
              aria-label="트위터로 공유"
              className="share-btn py-3 rounded-2xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] text-sm font-medium hover:bg-[#1DA1F2]/20"
            >
              🐦 트위터
            </button>
          </div>

          <div className="text-center space-y-3 mt-6">
            <button
              onClick={() => {
                sessionStorage.removeItem("keywordResult");
                router.push("/check");
              }}
              aria-label="다른 사람 키워드 다시 확인하기"
              className="btn-glow w-full py-4 rounded-full text-base tracking-wide"
            >
              👀 친구 키워드도 확인하기
            </button>
            <button
              onClick={() => router.push("/")}
              aria-label="처음 화면으로 돌아가기"
              className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
            >
              처음으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
