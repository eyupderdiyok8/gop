import { ShieldCheck, Truck, Wrench, Clock, Droplets } from "lucide-react";

interface Props {
  locationName: string;
  serviceName: string;
  tdsValue?: number;
  population?: number;
  customContent?: string;
  serviceType: "transactional" | "commercial" | "informational";
  featuredImage?: string;
  serviceArea?: string;
}

const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1559839734-2b71f1e3c770?q=80&w=1200&auto=format&fit=crop", // Clean kitchen faucet
  "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=1200&auto=format&fit=crop", // High-end glass of water
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop", // Modern home interior
  "https://images.unsplash.com/photo-1510505971234-2e21245648f8?q=80&w=1200&auto=format&fit=crop", // Pure water splash
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop", // Spa/Health vibe
  "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?q=80&w=1200&auto=format&fit=crop", // Nature/Spring water
];

function getHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function ServiceSection({ locationName, serviceName, customContent, tdsValue, serviceArea }: Props) {
  const baseTitle = `${locationName} Bölgesinde ${serviceName}`;
  const baseDesc = `${locationName} bölgesinde ${serviceName.toLowerCase()} hizmeti sunuyoruz. Sultançiftliği'ndeki merkezimizden Sultangazi ve İstanbul Avrupa Yakası'na ulaşan ekibimiz; cihazın durumu, su basıncı ve ölçüm sonuçlarına göre uygulanacak işlemi belirler. ${serviceArea || `${locationName} ve yakın çevresi`} düzenli servis güzergâhımızdadır.`;

  // Deterministik olarak o sayfaya özel hep aynı görseli atar
  const imageIndex = getHash(`${locationName}-${serviceName}`) % STOCK_IMAGES.length;
  const selectedImage = STOCK_IMAGES[imageIndex];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-aqua/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-navy mb-6 leading-tight capitalize">
            {baseTitle}
          </h2>
          
          {customContent ? (
            <div 
              className="prose prose-teal max-w-none text-muted-foreground mb-8"
              dangerouslySetInnerHTML={{ __html: customContent }}
            />
          ) : (
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {baseDesc}
            </p>
          )}

          <div className="space-y-4">
            {[
              { icon: Wrench, text: "Alanında uzman, sertifikalı teknik ekip" },
              { icon: Truck, text: `${locationName} için rota uygunluğuna göre aynı gün planlama` },
              { icon: ShieldCheck, text: "Cihaz modeline uygun filtre ve yedek parça seçenekleri" },
              { icon: Clock, text: "Pazartesi-Cumartesi 08:00-19:00 servis desteği" },
              { icon: Droplets, text: `TDS, su basıncı ve kullanım ihtiyacına göre filtrasyon seçimi${tdsValue ? ` (yaklaşık ${tdsValue} ppm TDS)` : ""}` },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <item.icon className="w-5 h-5 text-brand-aqua" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Görsel/Sağ Taraf */}
        <div className="relative">
          <div className="aspect-square sm:aspect-[4/3] lg:aspect-square rounded-[2.5rem] bg-gradient-to-br from-brand-aqua to-blue-600 p-1">
            <div className="w-full h-full rounded-[2.4rem] bg-brand-navy overflow-hidden relative group">
              {/* Fallback Image */}
              <div 
                className="absolute inset-0 opacity-40 bg-cover bg-center mix-blend-overlay group-hover:scale-110 transition-transform duration-1000" 
                style={{ backgroundImage: `url(${selectedImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-aqua/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <Droplets className="w-8 h-8 text-brand-aqua relative z-10" />
                </div>
                <div className="space-y-4">
                  <p className="font-heading font-bold text-2xl text-white">
                    {locationName} İçin Özel Çözümler
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    TDS toplam çözünmüş maddeyi gösterir; sertlik ise ayrı bir ölçümdür. Su basıncı, tüketim ve ölçüm sonuçlarını birlikte değerlendirerek eviniz veya işletmeniz için uygun sistemi belirliyoruz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
