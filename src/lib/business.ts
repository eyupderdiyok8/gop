// İşletmenin Google profili ve konumu: yorum sayısı değiştikçe yalnızca burayı güncelleyin.

export const GOOGLE_PROFILE = {
  rating: "5,0",
  reviewCount: 77,
  /** Google Haritalar'da işletme sayfası (yorumlar dahil) */
  url: "https://www.google.com/maps/place/Su+Ar%C4%B1tma+Teknik+Servis+34/@41.0918729,28.8640545,17z/data=!4m8!3m7!1s0x14cab17296a7aa09:0x12dbedf17c1c6457!8m2!3d41.0918729!4d28.8640545!9m1!1b1!16s%2Fg%2F11zdcn1j6j?hl=tr",
  /** Yol tarifi */
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=41.0918729,28.8640545",
} as const;

export const BUSINESS_LOCATION = {
  address: "Sultançiftliği Mah. Eski Edirne Asfaltı Cad. No:461, 34265 Sultangazi/İstanbul",
  lat: 41.0918729,
  lng: 28.8640545,
  /** Google Haritalar yerleştirme kodu (işletme kaydını gösterir) */
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d852.6937667328975!2d28.86007948942085!3d41.09282752699101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab17296a7aa09%3A0x12dbedf17c1c6457!2sSu%20Ar%C4%B1tma%20Teknik%20Servis%2034!5e0!3m2!1str!2str!4v1793321457942!5m2!1str!2str",
} as const;
