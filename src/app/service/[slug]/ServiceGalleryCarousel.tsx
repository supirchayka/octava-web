"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { resolveMediaUrl } from "@/lib/media";
import type { ApiImage } from "@/types/api";

type ServiceGalleryCarouselProps = {
  images: ApiImage[];
};

export function ServiceGalleryCarousel({ images }: ServiceGalleryCarouselProps) {
  const gallery = useMemo(
    () =>
      images
        .filter((image) => Boolean(image.url))
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : gallery[activeIndex] ?? null;

  useEffect(() => {
    if (activeIndex === null || gallery.length === 0) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + gallery.length) % gallery.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % gallery.length,
        );
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, gallery.length]);

  if (gallery.length === 0) return null;

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + gallery.length) % gallery.length,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % gallery.length,
    );
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
          Галерея
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((image, index) => (
          <button
            key={`${image.id}-${index}`}
            type="button"
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0D1321]/10 text-left shadow-[0_10px_28px_rgba(13,19,33,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(13,19,33,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D2D44]"
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={resolveMediaUrl(image.url)}
              alt={image.alt ?? image.caption ?? "Фото процедуры"}
              fill
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {image.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-[#0D1321]/70 px-3 py-2 text-sm text-[#F3F7FA]">
                {image.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeImage && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(13,19,33,0.92)] px-4 py-5"
          role="dialog"
          aria-modal="true"
          aria-label="Галерея процедуры"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative flex h-full w-full max-w-6xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3 text-[#F3F7FA]">
              <span className="text-sm text-[#F3F7FA]/75">
                {activeIndex + 1} / {gallery.length}
              </span>
              <button
                type="button"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-[#0D1321] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                onClick={() => setActiveIndex(null)}
              >
                Закрыть
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black/30">
              <Image
                src={resolveMediaUrl(activeImage.url)}
                alt={activeImage.alt ?? activeImage.caption ?? "Фото процедуры"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-medium text-[#F3F7FA] transition hover:bg-white hover:text-[#0D1321] disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#F3F7FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                onClick={showPrevious}
                disabled={gallery.length < 2}
              >
                Назад
              </button>
              {activeImage.caption && (
                <p className="min-w-0 flex-1 text-center text-sm leading-relaxed text-[#F3F7FA]/85">
                  {activeImage.caption}
                </p>
              )}
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-medium text-[#F3F7FA] transition hover:bg-white hover:text-[#0D1321] disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#F3F7FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                onClick={showNext}
                disabled={gallery.length < 2}
              >
                Вперёд
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
