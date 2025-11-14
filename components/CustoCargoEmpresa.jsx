import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';

function money(x) {
  return Number(x || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CustoCargoEmpresa() {
  const [companyName, setCompanyName] = useState('Empresa do Trabalho');
  const [salario, setSalario] = useState(5000);
  const [inss, setInss] = useState(0.20);
  const [rat, setRat] = useState(0.02);
  const [salEdu, setSalEdu] = useState(0.025);
  const [sistemaS, setSistemaS] = useState(0.033);
  const [fgts, setFgts] = useState(0.08);
  const [provMulta, setProvMulta] = useState(0.032);

  const breakdown = useMemo(() => {
    const sal = Number(salario || 0);
    const total = sal * 1.8736;
    return { total, percentOver: sal ? ((total - sal) / sal) * 100 : 0 };
  }, [salario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">{companyName}</h1>
        <p className="text-sm text-slate-600 mb-6">Calculadora de Custo do Cargo</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-4">Configuracao</h2>
            <label className="block text-sm mb-1">Salario Base</label>
            <input type="number" value={salario} onChange={(e) => setSalario(Number(e.target.value))} className="w-full border rounded p-2" />
          </div>
          <div className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-4">Resultado</h2>
            <div className="flex justify-between mb-2"><span>Custo Total:</span><span className="font-bold">{money(breakdown.total)}</span></div>
            <div className="flex justify-between"><span>Acrescimo:</span><span className="font-bold">{breakdown.percentOver.toFixed(2)}%</span></div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-yellow-50 border rounded text-xs">
          <strong>Base Legal:</strong> CLT, Leis 8.212/91, 8.213/91, Lei 8.036/90, EC 103/2019
        </div>
      </div>
    </div>
  );
}
