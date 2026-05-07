"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function FinansGrafik({ data }: { data: any[] }) {
  return (
    <Card className="bg-white border-slate-200 mb-8 col-span-1 md:col-span-4 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-aqua" />
          <CardTitle className="text-lg font-semibold text-slate-900">Aylık Nakit Akışı</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorGelir" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGider" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="rgba(0,0,0,0.4)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              minTickGap={20}
            />
            <YAxis 
              stroke="rgba(0,0,0,0.4)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `₺${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderColor: 'rgba(0,0,0,0.1)', color: '#000', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#000' }}
              formatter={(value: any) => [new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(value || 0)), '']}
            />
            <Area 
              type="monotone" 
              dataKey="Gelir" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorGelir)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
            />
            <Area 
              type="monotone" 
              dataKey="Gider" 
              stroke="#f43f5e" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorGider)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#f43f5e' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
