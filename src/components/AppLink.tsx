import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * Sitedeki bağlantılar için next/link; ön yükleme (prefetch) varsayılan olarak kapalı.
 * Açıkken her ziyaret, ekrana giren her bağlantı için Vercel'de bir ISR okuması üretiyordu
 * (bir bölge sayfasında ~40). Sayfa yalnızca tıklanınca yüklenir. Gerekirse prefetch açıkça verilebilir.
 */
export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
