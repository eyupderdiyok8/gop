import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  /** Tailwind height classes for the emblem, e.g. "h-12 lg:h-14" */
  emblemClassName?: string;
  /** Tailwind height classes for the wordmark, e.g. "h-7 lg:h-9" */
  wordmarkClassName?: string;
  preload?: boolean;
}

export function BrandLogo({
  className,
  emblemClassName = "h-12",
  wordmarkClassName = "h-7",
  preload = false,
}: BrandLogoProps) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        src="/images/logo/su-aritma-teknik-servis-amblem.webp"
        alt=""
        width={480}
        height={337}
        preload={preload}
        className={cn("w-auto", emblemClassName)}
      />
      <Image
        src="/images/logo/su-aritma-teknik-servis-yazi.webp"
        alt="Su Arıtma Teknik Servis"
        width={880}
        height={220}
        preload={preload}
        className={cn("w-auto", wordmarkClassName)}
      />
    </span>
  );
}
