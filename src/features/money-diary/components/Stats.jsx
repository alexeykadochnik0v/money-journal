import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

export default function Stats({ flowData, emotionData, totals }) {
  const COLORS = [
    "#22c55e", // emerald
    "#ef4444", // rose
    "#3b82f6", // blue
    "#a855f7", // purple
    "#f59e0b", // amber
    "#10b981", // green
    "#64748b", // slate
  ];

  const formatValue = (v) => new Intl.NumberFormat("ru-RU").format(v);
  const showPieLabels = typeof window !== "undefined" ? window.innerWidth >= 640 : true;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="text-base">Структура потока</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v)=>[formatValue(v), "Сумма"]} />
                <Bar dataKey="value" radius={[6,6,0,0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="text-base">Эмоции</CardTitle></CardHeader>
          <CardContent className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={emotionData} dataKey="value" nameKey="name" outerRadius={90} label={showPieLabels ? ({ name, value }) => `${name}: ${value}` : false}>
                    {emotionData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n)=>[formatValue(v), n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {emotionData.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-600 px-1">
                {emotionData.map((e, idx)=> (
                  <div key={e.name} className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span>{e.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
