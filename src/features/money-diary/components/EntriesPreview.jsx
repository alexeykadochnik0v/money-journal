import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, SlidersHorizontal, X } from "lucide-react";
import DateField from "./DateField";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { Sheet, SheetHeader as DrawerHeader, SheetTitle as DrawerTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EntriesPreview({ view, totals, MONEY_FMT, from, to, search, setFrom, setTo, setSearch, onRemove, limit, setLimit }) {
  const { toast } = useToast();
  const [confirmId, setConfirmId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const setToday = () => { const d = new Date(); d.setHours(0,0,0,0); setFrom(d); setTo(d); };
  const setThisWeek = () => { const d = new Date(); const day = d.getDay(); const diff = (day===0?6:day-1); const start = new Date(d); start.setDate(d.getDate()-diff); start.setHours(0,0,0,0); const end = new Date(start); end.setDate(start.getDate()+6); setFrom(start); setTo(end); };
  const setThisMonth = () => { const d = new Date(); const start = new Date(d.getFullYear(), d.getMonth(), 1); const end = new Date(d.getFullYear(), d.getMonth()+1, 0); setFrom(start); setTo(end); };
  const resetFilters = () => { setFrom(undefined); setTo(undefined); setSearch(""); toast({ title: "Фильтры сброшены" }); };
  const confirmDelete = (id) => setConfirmId(id);
  const performDelete = () => {
    if (confirmId) {
      onRemove(confirmId);
      toast({ title: "Удалено", description: "Запись удалена" });
      setConfirmId(null);
    }
  };
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setFiltersOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const filtersContent = (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={setToday}>Сегодня</Button>
        <Button size="sm" variant="secondary" onClick={setThisWeek}>Неделя</Button>
        <Button size="sm" variant="secondary" onClick={setThisMonth}>Месяц</Button>
        <Button size="sm" variant="ghost" onClick={resetFilters}>Сбросить фильтры</Button>
      </div>
      <div className="grid gap-2">
        <Label>С даты</Label>
        <DateField date={from} setDate={setFrom} />
      </div>
      <div className="grid gap-2">
        <Label>По дату</Label>
        <DateField date={to} setDate={setTo} />
      </div>
      <div className="grid gap-2">
        <Label>Поиск</Label>
        <Input placeholder="по описанию" value={search} onChange={(e)=>setSearch(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Показывать</Label>
        <Select value={String(limit)} onValueChange={(v)=>setLimit(v === 'all' ? Infinity : Number(v))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="all">Все</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  return (
    <div className="grid gap-4">
      <div className={`grid gap-4 transition-[margin] duration-200 ${filtersOpen ? 'md:ml-[300px]' : ''}`}>
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={()=>setFiltersOpen(true)}>
                <SlidersHorizontal className="h-4 w-4 mr-2"/> Фильтры
              </Button>
              <CardTitle className="text-base ml-auto">Записи ({view.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {view.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
                <div className="mb-3 text-2xl">¯\\_(ツ)_/¯</div>
                <p className="max-w-md">Нет записей по текущим фильтрам. Добавьте первую запись во вкладке «Добавить запись» или измените фильтры.</p>
              </div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="sm:hidden rounded-xl max-h-[60vh] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] space-y-2">
                  {view.map((e) => (
                    <div key={e.id} className="rounded-xl border p-3 bg-white dark:bg-zinc-900">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm text-zinc-500 whitespace-nowrap">{new Date(e.date).toLocaleDateString("ru-RU")}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant={e.kind === "income" ? "secondary" : "outline"}>{e.kind === "income" ? `${e.type}` : "Расход"}</Badge>
                          <span className="text-xs text-zinc-500 whitespace-nowrap">{e.category}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-[15px] leading-5 whitespace-pre-wrap break-words">
                        {e.description}{e.emotion ? `\n· ${e.emotion}` : null}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-zinc-500">Сумма</div>
                        <div className={`font-semibold ${e.kind === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>{e.kind === 'income' ? '+' : '-'}{MONEY_FMT(e.amount)} ₽</div>
                        <button className="ml-2 text-zinc-400 hover:text-zinc-600" title="Удалить" onClick={()=>setConfirmId(e.id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop/tablet table */}
                <div className="hidden sm:block rounded-xl overflow-x-auto md:overflow-x-hidden max-h-[60vh] md:h-auto md:max-h-none overflow-y-auto md:overflow-visible touch-pan-y touch-pan-x overscroll-contain [-webkit-overflow-scrolling:touch]">
                  <table className="w-full min-w-[720px] text-sm table-auto">
                    <thead className="bg-zinc-50 sticky top-0">
                      <tr className="text-left border-b">
                        <th className="py-2 px-3 w-[110px]">Дата</th>
                        <th className="py-2 px-3">Тип</th>
                        <th className="py-2 px-3">Категория</th>
                        <th className="py-2 px-3">Описание</th>
                        <th className="py-2 px-3 text-right w-[120px]">Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      {view.map((e) => (
                        <tr key={e.id} className="border-b last:border-0 align-top">
                          <td className="py-2 px-3 whitespace-nowrap">{new Date(e.date).toLocaleDateString("ru-RU")}</td>
                          <td className="py-2 px-3"><Badge variant={e.kind === "income" ? "secondary" : "outline"}>{e.kind === "income" ? `${e.type}` : "Расход"}</Badge></td>
                          <td className="py-2 px-3 whitespace-nowrap">{e.category}</td>
                          <td className="py-2 px-3 whitespace-pre-wrap break-words">{e.description}{e.emotion ? ` · ${e.emotion}` : null}</td>
                          <td className="py-2 px-3 text-right whitespace-nowrap">
                            {e.kind === "income" ? "+" : "-"}
                            {MONEY_FMT(e.amount)} ₽
                            <button className="inline-flex align-middle ml-2 text-zinc-400 hover:text-zinc-600" title="Удалить" onClick={()=>setConfirmId(e.id)}>
                              <Trash2 className="inline h-4 w-4"/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen} backdrop={false} widthClass="w-[300px]">
        <div>
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <DrawerTitle>Фильтры</DrawerTitle>
              <button className="rounded-md p-1.5 hover:bg-zinc-100" aria-label="Закрыть" onClick={()=>setFiltersOpen(false)}>
                <X className="h-4 w-4"/>
              </button>
            </div>
          </DrawerHeader>
          {filtersContent}
        </div>
      </Sheet>

      {filtersOpen && (
        <div className="md:hidden relative z-20">
          <div className="fixed inset-0" onClick={()=>setFiltersOpen(false)} />
          <Card className="rounded-2xl mb-2">
            <CardHeader>
              <CardTitle className="text-base">Фильтры</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filtersContent}
              <div className="pt-2 flex gap-2">
                <Button variant="ghost" onClick={()=>setFiltersOpen(false)}>Закрыть</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Dialog open={Boolean(confirmId)} onOpenChange={(v)=>{ if(!v) setConfirmId(null); }}>
        <div>
          <DialogHeader>
            <DialogTitle>Удалить запись?</DialogTitle>
            <DialogDescription>Это действие необратимо и удалит выбранную запись из списка.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={()=>setConfirmId(null)}>Отмена</Button>
            <Button variant="destructive" onClick={performDelete}>Удалить</Button>
          </DialogFooter>
        </div>
      </Dialog>
    </div>
  );
}
