"use client";

import { MotionConfig } from "framer-motion";

/** İşletim sisteminde "hareketi azalt" açıksa framer animasyonlarını sadeleştirir */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
