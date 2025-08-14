import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DateField from "./DateField";

export default function EntryForm({ EMOTIONS, CATEGORIES, state, setters, onAdd }) {
  const { date, kind, amount, flowType, description, category, emotion, notes } = state;
  const { setDate, setKind, setAmount, setFlowType, setDescription, setCategory, setEmotion, setNotes } = setters;
  const amt = Number(String(amount).replace(',', '.'));
  const canSubmit = Boolean(date) && amt > 0 && description.trim().length > 0;
  return (
    <>
      <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Дата</Label>
          <DateField date={date} setDate={setDate} />
          {/* Заполнитель, чтобы выровнять высоту с правой колонкой на десктопе */}
          <p className="hidden md:block text-xs text-transparent select-none">placeholder</p>
        </div>

        <div className="grid gap-2">
          <Label>Сумма</Label>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0"
            value={amount}
            onChange={(e)=>{
              const v = e.target.value.replace(/,/g, '.');
              // Оставляем только цифры и одну точку
              const cleaned = v.replace(/[^0-9.]/g, '').replace(/\.(?=.*\.)/g, '');
              setAmount(cleaned);
            }}
          />
          {/* Хелпер именно под суммой */}
          <p className="text-xs text-zinc-500">Только цифры, разделитель — точка или запятая.</p>
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Доход или расход</Label>
        <Select value={kind} onValueChange={(v)=>setKind(v)}>
          <SelectTrigger><span>{kind === "income" ? "Доход" : "Расход"}</span></SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Доход</SelectItem>
            <SelectItem value="expense">Расход</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {kind === "income" && (
        <div className="grid gap-2">
          <Label>Тип дохода</Label>
          <Select value={flowType} onValueChange={(v)=>setFlowType(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Деньги">Деньги</SelectItem>
              <SelectItem value="Оплата/Подарок">Оплата/Подарок</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-2 md:col-span-2">
        <Label>Описание</Label>
        <Input placeholder="Коротко: на что / от кого" value={description} onChange={(e)=>setDescription(e.target.value)} />
        <p className="text-xs text-zinc-500">Обязательное поле для ясности записей.</p>
      </div>

      <div className="grid gap-2">
        <Label>Категория</Label>
        <Select value={category} onValueChange={(v)=>setCategory(v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Эмоция</Label>
        <Select value={emotion} onValueChange={(v)=>setEmotion(v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {EMOTIONS.map(e=> <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2 md:col-span-2">
        <Label>Мысли / выводы</Label>
        <Textarea rows={3} placeholder="Что ты почувствовала? Какие мысли пришли?" value={notes} onChange={(e)=>setNotes(e.target.value)} />
      </div>

      <div className="md:col-span-2">
        <Button onClick={onAdd} className="w-full md:w-auto" disabled={!canSubmit} title={!canSubmit?"Заполните дату, сумму и описание":"Добавить запись"}>
          <Plus className="h-4 w-4 mr-2"/>Добавить
        </Button>
      </div>
    </>
  );
}
