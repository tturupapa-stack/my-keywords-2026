"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarBackground from "@/components/StarBackground";
import FloatingParticles from "@/components/FloatingParticles";

export default function CheckPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("운명의 키워드를 탐색중...");

  const loadingMessages = [
    "운명의 키워드를 탐색중...",
    "별자리의 흐름을 읽는 중...",
    "2026년의 기운을 분석중...",
    "당신만의 키워드를 발견했어요!",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;

    setIsLoading(true);

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[msgIndex]);
    }, 2000);

    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), birthDate }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      sessionStorage.setItem(
        "keywordResult",
        JSON.stringify({ ...data, name: name.trim(), birthDate })
      );

      clearInterval(msgInterval);
      router.push("/result");
    } catch {
      clearInterval(msgInterval);
      setIsLoading(false);
      alert("키워드 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <StarBackground />
        <FloatingParticles />
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="result-card-capture rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="crystal-ball mx-auto" />
            <p className="text-purple-200 text-base sm:text-lg text-center animate-pulse">
              {loadingText}
            </p>
            <div className="space-y-3" aria-hidden="true">
              <div className="h-4 rounded-full shimmer" />
              <div className="h-16 rounded-2xl shimmer" />
              <div className="h-16 rounded-2xl shimmer" />
              <div className="h-10 rounded-full shimmer" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <StarBackground />
      <FloatingParticles />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Back link */}
        <button
          onClick={() => router.back()}
          aria-label="이전 페이지로 돌아가기"
          className="text-gray-500 hover:text-gray-300 text-sm mb-8 flex items-center gap-1 transition-colors"
        >
          ← 돌아가기
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">✨</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            당신에 대해 알려주세요
          </h1>
          <p className="text-gray-400 text-sm">
            이름과 생년월일로 2026년 키워드를 분석해드려요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm text-gray-400 mb-2 ml-1"
            >
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="이름 입력"
              placeholder="홍길동"
              maxLength={10}
              required
              autoComplete="name"
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-gold-300/50 focus:bg-white/[0.07] transition-all text-lg"
            />
          </div>

          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm text-gray-400 mb-2 ml-1"
            >
              생년월일
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              aria-label="생년월일 입력"
              required
              autoComplete="bday"
              max="2020-12-31"
              min="1940-01-01"
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-300/50 focus:bg-white/[0.07] transition-all text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !birthDate}
            aria-label="2026 키워드 결과 확인하기"
            className="w-full btn-glow py-4 rounded-full text-lg tracking-wide disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:transform-none mt-4"
          >
            🔮 키워드 확인하기
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          입력된 정보는 키워드 생성에만 사용되며 저장되지 않아요
        </p>
      </div>
    </main>
  );
}
