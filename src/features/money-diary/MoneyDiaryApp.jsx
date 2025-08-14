import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Download, Upload, Plus, Menu } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useToast } from "@/components/ui/toast";

import { EMOTIONS, CATEGORIES } from "./constants";
import { toISODate, fromISODate } from "./utils/date";
import EntryForm from "./components/EntryForm";
import EntriesPreview from "./components/EntriesPreview";
import Stats from "./components/Stats";

const LS_KEY = "money-diary-v1";
const MONEY_FMT = (n) => n.toLocaleString("ru-RU");

export default function MoneyDiaryApp() {
  const [entries, setEntries] = useState([]);
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const importInputRef = useRef(null);
  // Блокируем первое сохранение, пока не завершится начальная загрузка/сидинг
  const suppressSaveRef = useRef(true);
  // How many entries to show in preview
  const [limit, setLimit] = useState(10);

  // Form state
  const [date, setDate] = useState(new Date());
  const [kind, setKind] = useState("income");
  const [amount, setAmount] = useState("");
  const [flowType, setFlowType] = useState("Деньги");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [emotion, setEmotion] = useState(EMOTIONS[0]);
  const [notes, setNotes] = useState("");

  // Filters for preview
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [search, setSearch] = useState("");

  // Load / persist
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setEntries(parsed);
      } catch {}
    }
    // Разрешим сохранение на следующем тике, чтобы не перезаписать []
    setTimeout(() => { suppressSaveRef.current = false; }, 0);
  }, []);

  useEffect(() => {
    if (suppressSaveRef.current) return; // пропускаем первое сохранение
    if (Array.isArray(entries)) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(entries)); } catch {}
    }
  }, [entries]);

  const addEntry = () => {
    const amt = Number(String(amount).replace(",", "."));
    if (!date || !amt || !description.trim()) return;
    const e = {
      id: crypto.randomUUID(),
      date: toISODate(date),
      kind,
      amount: Math.abs(amt),
      type: kind === "income" ? flowType : "Деньги",
      description: description.trim(),
      category,
      emotion,
      notes: notes.trim() || undefined,
    };
    const next = [e, ...entries];
    setEntries(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
    clearForm();
    toast({ title: "Запись добавлена", description: `${description.trim()} · ${MONEY_FMT(Math.abs(amt))} ₽` });
  };

  const removeEntry = (id) => {
    const next = entries.filter((x) => x.id !== id);
    setEntries(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  };

  // Очистка только формы (не записей!).
  const clearForm = () => {
    setDate(new Date());
    setKind("income");
    setAmount("");
    setFlowType("Деньги");
    setDescription("");
    setCategory(CATEGORIES[0]);
    setEmotion(EMOTIONS[0]);
    setNotes("");
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `money-diary-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Экспортирован JSON", description: "Файл сохранён" });
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data)) {
          try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
          setEntries(data);
          toast({ title: "Импорт успешен", description: `Загружено записей: ${data.length}` });
        }
      } catch (e) { toast({ title: "Ошибка импорта", description: "Файл не распознан", variant: "destructive" }); }
    };
    reader.readAsText(file);
  };

  // Derived: filtered entries for preview
  const view = useMemo(() => {
    return entries.filter((e) => {
      const dISO = e.date;
      if (from && dISO < toISODate(from)) return false;
      if (to && dISO > toISODate(to)) return false;
      // Поиск только по описанию (подстрока, без учёта регистра)
      if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [entries, from, to, search]);

  // Apply view limit (10/20/All)
  const limitedView = useMemo(() => {
    const n = Number.isFinite(limit) ? limit : Infinity;
    return n === Infinity ? view : view.slice(0, n);
  }, [view, limit]);

  const totals = useMemo(() => {
    const income = view.filter((e) => e.kind === "income").reduce((s, x) => s + x.amount, 0);
    const expense = view.filter((e) => e.kind === "expense").reduce((s, x) => s + x.amount, 0);
    const net = income - expense;
    return { income, expense, net };
  }, [view]);

  const emotionData = useMemo(() => {
    const map = {};
    view.forEach((e) => (map[e.emotion] = (map[e.emotion] || 0) + 1));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [view]);

  const flowData = useMemo(() => {
    const incMoney = view.filter((e) => e.kind === "income" && e.type === "Деньги").reduce((s, x) => s + x.amount, 0);
    const incGift = view.filter((e) => e.kind === "income" && e.type === "Оплата/Подарок").reduce((s, x) => s + x.amount, 0);
    return [
      { name: "Деньги", value: incMoney },
      { name: "Оплата/Подарок", value: incGift },
      { name: "Расходы", value: totals.expense },
    ];
  }, [view, totals.expense]);

  // Seed only if localStorage is empty (first ever run)
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw && entries.length === 0) {
      const seed = [
        { id: crypto.randomUUID(), date: "2025-08-11", kind: "income", amount: 14220, type: "Деньги", description: "Муж оплатил врача-гинеколога", category: "Медицинское", emotion: "Благодарность" },
        { id: crypto.randomUUID(), date: "2025-08-11", kind: "income", amount: 3500, type: "Оплата/Подарок", description: "Муж купил лекарства", category: "Здоровье", emotion: "Неловкость" },
        { id: crypto.randomUUID(), date: "2025-08-11", kind: "expense", amount: 120, type: "Деньги", description: "Кофе с мужем", category: "Кафе/Еда", emotion: "Тепло" },
      ];
      setEntries(seed);
      try { localStorage.setItem(LS_KEY, JSON.stringify(seed)); } catch {}
      // На следующем тике снова разрешим сохранение
      setTimeout(() => { suppressSaveRef.current = false; }, 0);
    }
  }, []);

  return (
    <div className="container-page space-y-6">
      <div className="relative">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Денежный дневник</h1>
          {/* Desktop actions */}
          <div className="hidden sm:flex gap-2">
            <Button variant="secondary" onClick={exportJSON} title="Экспорт JSON">
              <Download className="h-4 w-4 mr-2" /> Экспорт
            </Button>
            <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files && importJSON(e.target.files[0])} />
            <Button variant="outline" onClick={() => importInputRef.current?.click()} title="Импорт JSON">
              <Upload className="h-4 w-4 mr-2"/> Импорт
            </Button>
            <Button variant="outline" onClick={clearForm} title="Очистить форму">
              <Trash2 className="h-4 w-4 mr-2" /> Очистить форму
            </Button>
          </div>
          {/* Mobile burger */}
          <div className="sm:hidden">
            <Button size="icon" variant="outline" aria-label="Открыть меню" onClick={()=>setMenuOpen((v)=>!v)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {/* Mobile dropdown sheet */}
        {menuOpen && (
          <div className="sm:hidden absolute right-0 mt-2 w-56 rounded-2xl border bg-white p-2 shadow-xl z-20">
            <button className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-zinc-50" onClick={()=>{ setMenuOpen(false); exportJSON(); }}>
              <Download className="h-4 w-4"/> Экспорт JSON
            </button>
            <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => { if(e.target.files){ importJSON(e.target.files[0]); setMenuOpen(false);} }} />
            <button className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-zinc-50" onClick={()=>{ importInputRef.current?.click(); }}>
              <Upload className="h-4 w-4"/> Импорт JSON
            </button>
            <button className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-zinc-50" onClick={()=>{ clearForm(); setMenuOpen(false); }}>
              <Trash2 className="h-4 w-4"/> Очистить форму
            </button>
          </div>
        )}
      </div>

      <Tabs defaultValue="add">
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="add">Добавить запись</TabsTrigger>
          <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
          <TabsTrigger value="stats">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Новая запись</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <EntryForm
                EMOTIONS={EMOTIONS}
                CATEGORIES={CATEGORIES}
                state={{ date, kind, amount, flowType, description, category, emotion, notes }}
                setters={{ setDate, setKind, setAmount, setFlowType, setDescription, setCategory, setEmotion, setNotes }}
                onAdd={addEntry}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <EntriesPreview
            view={limitedView}
            totals={totals}
            MONEY_FMT={MONEY_FMT}
            from={from}
            to={to}
            search={search}
            setFrom={setFrom}
            setTo={setTo}
            setSearch={setSearch}
            onRemove={removeEntry}
            limit={limit}
            setLimit={setLimit}
          />
        </TabsContent>

        <TabsContent value="stats">
          <Stats flowData={flowData} emotionData={emotionData} totals={totals} />
        </TabsContent>
      </Tabs>

      <p className="text-xs text-zinc-500 pt-2">Данные хранятся локально в браузере. Экспортируйте JSON для резервной копии.</p>
    </div>
  );
}
