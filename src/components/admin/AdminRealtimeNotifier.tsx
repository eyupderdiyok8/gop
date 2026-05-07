"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// Basit, şık bir bildirim sesi üreten fonksiyon
function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    // A5 = 880Hz, A6 = 1760Hz
    osc1.frequency.setValueAtTime(880.00, ctx.currentTime);
    osc2.frequency.setValueAtTime(1760.00, ctx.currentTime);

    // Kademeli ses yükselişi ve azalışı (Zarif bir ding)
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);

    osc1.stop(ctx.currentTime + 1);
    osc2.stop(ctx.currentTime + 1);
  } catch (e) {
    console.error("Audio play failed:", e);
  }
}

export function AdminRealtimeNotifier() {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-appointments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "appointments" },
        (payload) => {
          const newRow = payload.new;
          playNotificationSound();
          
          toast.success("Yeni Servis Talebi!", {
            description: `${newRow.musteri_adi} adlı kullanıcı yeni bir talep oluşturdu.`,
            duration: 8000,
            action: {
              label: "Görüntüle",
              onClick: () => window.location.href = "/admin/randevular",
            },
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
