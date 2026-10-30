/** Menü satırı: alt öğesi olan grup başlığı, normal bağlantı ya da "yakında" etiketi */
export type MenuItem = { label: string; href?: string; soon?: boolean; children?: MenuItem[] };
