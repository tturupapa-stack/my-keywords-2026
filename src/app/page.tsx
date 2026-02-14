"use client";

import Link from "next/link";
import StarBackground from "@/components/StarBackground";
import FloatingParticles from "@/components/FloatingParticles";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <StarBackground />
      <FloatingParticles />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Mystical symbol */}
        <div className="mb-8 animate-float">
          <div className="text-7xl mb-2">🔮</div>
          <div className="flex justify-center gap-2 text-2xl opacity-60">
            <span>✦</span>
            <span className="animate-sparkle">✧</span>
            <span>✦</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in">
          <span className="text-gradient-gold">2026</span>
          <br />
          <span className="text-white/90">나의 키워드</span>
          <span className="text-gradient-purple"> 3개</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-gray-400 text-base sm:text-lg mb-3 animate-slide-up opacity-0"
          style={{ animationDelay: "0.2s" }}
        >
          AI가 분석한 당신의 2026년을 정의할
        </p>
        <p
          className="text-gray-300 text-lg sm:text-xl font-medium mb-10 animate-slide-up opacity-0"
          style={{ animationDelay: "0.4s" }}
        >
          세 가지 키워드를 확인하세요
        </p>

        {/* Decorative line */}
        <div
          className="flex items-center justify-center gap-3 mb-10 animate-fade-in opacity-0"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-300/50" />
          <span className="text-gold-300/60 text-sm">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-300/50" />
        </div>

        {/* CTA Button */}
        <div
          className="animate-slide-up opacity-0"
          style={{ animationDelay: "0.6s" }}
        >
          <Link
            href="/check"
            className="btn-glow inline-block px-10 py-4 rounded-full text-lg tracking-wide"
          >
            나의 키워드 확인하기 →
          </Link>
        </div>

        {/* Footer note */}
        <p
          className="mt-8 text-gray-500 text-xs animate-fade-in opacity-0"
          style={{ animationDelay: "0.8s" }}
        >
          이름과 생년월일만으로 AI가 분석해드려요
        </p>
      </div>

      {/* Bottom decorative orbs */}
      <div className="fixed bottom-0 left-0 w-full h-40 pointer-events-none z-[2]">
        <div className="absolute bottom-10 left-1/4 w-32 h-32 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-5 right-1/4 w-40 h-40 rounded-full bg-gold-300/5 blur-3xl" />
      </div>
    </main>
  );
}
