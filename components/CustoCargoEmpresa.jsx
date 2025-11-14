import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer } from "recharts";

function money(x) {
  return Number(x || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CustoCargoEmpresa() {
  const [companyName, setCompanyName] = useState("Empresa do Trabalho");
  const [companyColor] = useState("#0f172a");

  const [salario, setSalario] = useState(5000);
  const [inss, setInss] = useState(0.20);
  const [rat, setRat] = useState(0.02);
  const [salEdu, setSalEdu] = useState(0.025);
  const [sistemaS, setSistemaS] = useState(0.033);
  const [fgts, setFgts] = useState(0.08);
  const [provMulta, setProvMulta] = useState(0.032);
  const [incidenciasSobreProvisoes, setIncidenciasSobreProvisoes] = useState(true);

  const [benefits, setBenefits] = useState([
    { id: 1, name: "Plano de Saúde (patrocinado)", value: 300 },
    { id: 2, name: "Vale-Refeição (empresa)", value: 250 }
  ]);
  const [newBenefitName, setNewBenefitName] = useState("");
  const [newBenefitValue, setNewBenefitValue] = useState(0);

  function applyCompanyPreset() {
    setCompanyName("Empresa do Trabalho");
    setSalario(5000);
    setInss(0.20);
    setRat(0.02);
    setSalEdu(0.025);
    setSistemaS(0.033);
    setFgts(0.08);
    setProvMulta(0.032);
    setBenefits([
      { id: 1, name: "Plano de Saúde (patrocinado)", value: 300 },
      { id: 2, name: "Vale-Refeição (empresa)", value: 250 }
    ]);
    setIncidenciasSobreProvisoes(true);
  }

  function applyScenario(scenario) {
    if (scenario === "administrativo") setRat(0.01);
    if (scenario === "industria") setRat(0.02);
    if (scenario === "construcao") setRat(0.03);
  }

  function addBenefit() {
    if (!newBenefitName) return;
    const id = benefits.length ? Math.max(...benefits.map(b => b.id)) + 1 : 1;
    setBenefits([...benefits, { id, name: newBenefitName, value: Number(newBenefitValue || 0) }]);
    setNewBenefitName("");
    setNewBenefitValue(0);
  }
  function removeBenefit(id) {
    setBenefits(benefits.filter(b => b.id !== id));
  }
  function updateBenefit(id, key, val) {
    setBenefits(benefits.map(b => (b.id === id ? { ...b, [key]: key === 'value' ? Number(val) : val } : b)));
  }

  const breakdown = useMemo(() => {
    const sal = Number(salario || 0);
    const inssVal = sal * Number(inss || 0);
    const ratVal = sal * Number(rat || 0);
    const salEduVal = sal * Number(salEdu || 0);
    const sistemaSVal = sal * Number(sistemaS || 0);
    const fgtsVal = sal * Number(fgts || 0);
    const provMultaVal = sal * Number(provMulta || 0);

    const dec13 = sal / 12.0;
    const ferias = (sal * (4 / 3)) / 12.0;
    const benefitsTotal = benefits.reduce((s, b) => s + Number(b.value || 0), 0);

    const incidenceBaseExtra = incidenciasSobreProvisoes ? (dec13 + ferias) : 0;
    const inssSobreProvisoes = incidenceBaseExtra * Number(inss || 0);
    const ratSobreProvisoes = incidenceBaseExtra * Number(rat || 0);
    const salEduSobreProvisoes = incidenceBaseExtra * Number(salEdu || 0);
    const sistemaSSobreProvisoes = incidenceBaseExtra * Number(sistemaS || 0);

    const total = sal + inssVal + ratVal + salEduVal + sistemaSVal + fgtsVal + provMultaVal + dec13 + ferias + benefitsTotal + inssSobreProvisoes + ratSobreProvisoes + salEduSobreProvisoes + sistemaSSobreProvisoes;

    const items = [
      { name: "Salário (mensal)", value: sal },
      { name: "INSS Patronal", value: inssVal },
      { name: "RAT/SAT", value: ratVal },
      { name: "Salário-Educação", value: salEduVal },
      { name: "Sistema S", value: sistemaSVal },
      { name: "FGTS", value: fgtsVal },
      { name: "Provision Multa FGTS", value: provMultaVal },
      { name: "13º (mensalizado)", value: dec13 },
      { name: "Férias +1/3 (mensal)", value: ferias },
      { name: "Benefícios (total)", value: benefitsTotal },
      { name: "Incidências sobre 13º/ferias (INSS+RAT+S.Edu+S)", value: (inssSobreProvisoes + ratSobreProvisoes + salEduSobreProvisoes + sistemaSSobreProvisoes) },
      { name: "CUSTO TOTAL MENSAL", value: total }
    ];

    return { items, total, percentOver: sal ? ((total - sal) / sal) * 100 : 0 };
  }, [salario, inss, rat, salEdu, sistemaS, fgts, provMulta, benefits, incidenciasSobreProvisoes]);

  function downloadCSV() {
    const rows = breakdown.items.map((i) => `${i.name},${i.value}`);
    const csv = ["Item,Valor", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '_').toLowerCase()}_custo_cargo_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printView() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: companyColor }}>{companyName}</h1>
            <p className="text-xs sm:text-sm text-slate-600">Calculadora interativa de custo do cargo — personalize para a sua empresa</p>
          </div>

          <div className="flex gap-2 items-center">
            <input aria-label="Nome da empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="border rounded p-1 w-40 sm:w-64" />
            <button onClick={applyCompanyPreset} className="bg-indigo-600 text-white px-3 py-1 rounded">Valores Padrão</button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="lg:col-span-5">
            <div className="p-3 border rounded">
              <h2 className="text-lg font-semibold">Parâmetros</h2>
              <p className="text-xs text-slate-500">Toque nos campos para ajustar valores</p>
              <div className="space-y-3 mt-3">
                <label className="text-sm text-slate-700">Salário Base (R$)</label>
                <input type="number" value={salario} onChange={(e) => setSalario(Number(e.target.value))} className="w-full border rounded p-1" />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-slate-700">INSS Patronal (ex: 0.20 = 20%)</label>
                    <input type="number" step="0.01" value={inss} onChange={(e) => setInss(Number(e.target.value))} className="w-full border rounded p-1" />
...
