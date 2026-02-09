"use client";

import { useState } from "react";
import Image from "next/image";
import type { HomeInterior } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media";

type Props = {
  interior: HomeInterior;
};

export function InteriorSection({ interior }: Props) {
  const images = interior.images ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images.length && !interior.text) return null;

  const generatedText =
    "Интерьер OCTAVA создан для мягкого погружения в состояние спокойствия: тёплый свет, тактильные материалы и отсутствие визуального шума помогают расслабиться и переключиться на себя.";

  const currentImage = images[currentIndex];

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section id="interior" className="mb-16">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        {/* Левая колонка — текст из API + короткий текст про комфорт */}
        <div className="space-y-4">
          <div>
            <p className="inline-flex rounded-full py-1 text-2xl font-normal text-slate-700">
              Атмосфера и пространство
            </p>
          </div>
          {interior.text && (
            <p className="text-sm leading-relaxed text-slate-700">
              {interior.text}
            </p>
          )}
          <p className="text-sm leading-relaxed text-slate-700">
            {generatedText}
          </p>
        </div>

        {/* Правая колонка — слайдер */}
        <div className="relative h-[260px] w-full overflow-hidden rounded-3xl bg-[#0D1321] shadow-[0_18px_45px_rgba(13,19,33,0.25)] sm:h-[320px]">
          {currentImage && (
            <Image
              key={currentImage.id}
              src={resolveMediaUrl(currentImage.url)}
              alt=""
              fill
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out"
              sizes="100vw"
              priority
            />
          )}

          {/* градиент поверх фото */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1321]/80 via-[#0D1321]/40 to-transparent" />

          {/* декоративные пятна */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 top-[-24px] h-32 w-32 rounded-full bg-[#F3F7FA]/10 blur-3xl" />
            <div className="absolute -right-20 bottom-[-32px] h-40 w-40 rounded-full bg-[#F3F7FA]/8 blur-3xl" />
          </div>

          {/* стрелки навигации */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Предыдущее фото"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#0D1321]/70 p-2 text-[#F3F7FA] shadow-lg transition hover:bg-[#0D1321]"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M12.5 4.75L7.25 10L12.5 15.25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Следующее фото"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#0D1321]/70 p-2 text-[#F3F7FA] shadow-lg transition hover:bg-[#0D1321]"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M7.5 4.75L12.75 10L7.5 15.25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          {/* индикаторы снизу — без названия картинки */}
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-0 z-10 p-4">
              <div className="flex items-center justify-between rounded-2xl bg-[#0D1321]/80 px-4 py-3 text-xs text-[#F3F7FA]/85 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  {images.map((img, idx) => (
                    <button
                      key={img.id + "-" + idx}
                      type="button"
                      aria-label={`Показать слайд ${idx + 1}`}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentIndex
                          ? "w-5 bg-[#F3F7FA]"
                          : "w-2 bg-[#F3F7FA]/40"
                      }`}
                    />
                  ))}
                </div>
                <span className="whitespace-nowrap text-[11px] text-[#F3F7FA]/65">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
