import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title')?.slice(0, 100) || 'SuArıtmaServis34 Su Arıtma Sistemleri';
    const subtitle = searchParams.get('subtitle') || 'Gaziosmanpaşa & İstanbul Profesyonel Çözüm Merkezi';

    // Font fetch inside handler
    const fontRes = await fetch(
      'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KUnNSg.ttf',
      { cache: 'force-cache' }
    );
    
    if (!fontRes.ok) {
      throw new Error(`Failed to fetch font: ${fontRes.status}`);
    }
    
    const fontData = await fontRes.arrayBuffer();

    const fonts = [{ 
      name: 'Plus Jakarta Sans', 
      data: fontData, 
      style: 'normal' as const, 
      weight: 800 as const 
    }];

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a141c',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #1a9488 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a9488 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily: fontData ? 'Plus Jakarta Sans' : 'sans-serif',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(10, 20, 28, 0.95)',
              border: '4px solid #1a9488',
              borderRadius: '40px',
              padding: '60px 80px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              textAlign: 'center',
              width: '90%',
            }}
          >
            {/* Logo + Marka */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '20px',
                  backgroundColor: '#1a9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '25px',
                  boxShadow: '0 0 20px rgba(26, 148, 136, 0.4)',
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                </svg>
              </div>
              <h2
                style={{
                  fontSize: '56px',
                  color: 'white',
                  fontWeight: '800',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                SuArıtma<span style={{ color: '#1a9488' }}>GOP</span>
              </h2>
            </div>

            {/* Başlık */}
            <h1
              style={{
                fontSize: title.length > 50 ? '56px' : '72px',
                color: 'white',
                fontWeight: '800',
                lineHeight: 1.1,
                marginBottom: '24px',
                maxWidth: '900px',
                letterSpacing: '-0.03em',
                margin: '0 0 24px 0',
              }}
            >
              {title}
            </h1>

            {/* Alt başlık */}
            <p
              style={{
                fontSize: '34px',
                color: '#94a3b8',
                margin: 0,
                maxWidth: '850px',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>

            {/* Rozetler */}
            <div style={{ display: 'flex', marginTop: '50px', gap: '24px' }}>
              <div
                style={{
                  backgroundColor: '#1a9488',
                  color: 'white',
                  padding: '12px 28px',
                  borderRadius: '16px',
                  fontSize: '28px',
                  fontWeight: 'bold',
                }}
              >
                7/24 Mobil Servis
              </div>
              <div
                style={{
                  border: '2px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  padding: '12px 28px',
                  borderRadius: '16px',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#fbbf24', marginRight: '12px' }}>★</span>
                100% Müşteri Memnuniyeti
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts,
      }
    );
  } catch (e: any) {
    console.error('[OG Route Error]', e?.message ?? e);
    return new Response('OG görseli oluşturulamadı', { status: 500 });
  }
}
