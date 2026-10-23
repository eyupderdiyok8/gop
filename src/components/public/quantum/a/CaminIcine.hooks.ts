"use client";

import { useSyncExternalStore } from "react";
import { useTransform, type MotionValue } from "framer-motion";

/* Camın içine, Panel ve Altı kapı bölümlerinin ortak küçük yardımcıları */

const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * "Hareketi azalt" tercihi. Sunucuda ve hidrasyonda false döner, sonra gerçek değere geçer;
 * böylece yapıyı değiştiren dallar hidrasyon uyuşmazlığı üretmez.
 */
export function useReducedPref() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCE).matches,
    () => false
  );
}

export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/** 0–1 aralığını [a, b] dilimine göre yeniden ölçekler */
export const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * useTransform(p, times, values) ama aralık her zaman 0 ile 1'i kapsar.
 * framer 12, hazır offset'li useScroll ilerlemesini opacity'de WAAPI ViewTimeline ile hızlandırıyor;
 * aralık 0'da başlamaz ya da 1'de bitmezse uçlarda alttaki değere geri sıçrıyor. Bu sarmalayıcı uçları sabitler.
 */
export function useFullRange(p: MotionValue<number>, times: number[], values: number[]) {
  const t = [...times];
  const v = [...values];
  if (t[0] > 0) {
    t.unshift(0);
    v.unshift(v[0]);
  }
  if (t[t.length - 1] < 1) {
    t.push(1);
    v.push(v[v.length - 1]);
  }
  return useTransform(p, t, v);
}

/** #RRGGBB → rgba() */
export function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
