'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const ENCARGOS = [
  { nome: 'INSS', pct: 0.20, cor: '#6366f1', icon: '\ud83c\udfe5', descricao: 'Lei 8.212/91' },
  { nome: 'RAT', pct: 0.02, cor: '#3b82f6', icon: '\u26a0\ufe0f', descricao: 'Risco Ambiental' },
  { nome: 'S.Educacao', pct: 0.025, cor: '#06b6d4', icon: '\ud83d\udcda', descricao: 'Lei 7.418/85' },
  { nome: 'S.S', pct: 0.033, cor: '#10b981', icon: '\ud83c\udfe2', descricao: 'Sistema S' },
  { nome: 'FGTS', pct: 0.08, cor: '#f59e0b', icon: '\ud83d\udcb0', descricao: 'Lei 8.036/90' },
  { nome: 'Multa', pct: 0.032, cor: '#ef4444', icon: '\ud83d\udccb', descricao: 'Multa rescis\u00f3ria' },
];

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CustoCargoEmpresa() {
  const [salario, setSalario] = useState(5000);
  const debouncedSalario = useDebounce(salario, 300);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sal = params.get('sal');
    if (sal) setSalario(Number(sal));
  }, []);

  const custos = useMemo(() => {
    const encargosTotal = ENCARGOS.reduce((acc, e) => acc + e.pct, 0);
    const custoEncargos = debouncedSalario * encargosTotal;
    const custoFerias = (debouncedSalario + custoEncargos) / 12;
    const custo13 = (debouncedSalario + custoEncargos) / 12;
    const custoTotal = debouncedSalario + custoEncargos + custoFerias + custo13;
    return {
      salario: Number((debouncedSalario).toFixed(2)),
      encargosTotal,
      custoEncargos: Number((custoEncargos).toFixed(2)),
      custoFerias: Number((custoFerias).toFixed(2)),
      custo13: Number((custo13).toFixed(2)),
      custoTotal: Number((custoTotal).toFixed(2)),
      aumento: Number(((custoTotal - debouncedSalario) / debouncedSalario * 100).toFixed(1)),
    };
  }, [debouncedSalario]);

  const encargosDetalhados = useMemo(() => 
    ENCARGOS.map((e) => ({ ...e, value: Number((debouncedSalario * e.pct).toFixed(2)) })), 
    [debouncedSalario]
  );

  const chartData = [
    { name: 'Sal\u00e1rio', value: custos.salario, fill: '#a855f7' },
    { name: 'Encargos', value: custos.custoEncargos, fill: '#ec4899' },
    { name: '13\u00ba+F\u00e9rias', value: custos.custoFerias + custos.custo13, fill: '#f59e0b' },
  ];

  const compartilharURL = useCallback(() => {
    const url = `${window.location.origin}?sal=${Math.round(debouncedSalario)}`;
    navigator.clipboard.writeText(url);
    alert('URL copiada!');
  }, [debouncedSalario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-4 md:p-8">
      {/* UNIFSA Badge */}
      <div className="text-center py-6 mb-8">
        <div className="inline-block bg-gradient-to-r from-green-500 to-blue-600 px-6 py-2 rounded-full text-white font-bold text-sm shadow-lg mb-4">
          \ud83c\udf93 UNIFSA
        </div>
        <p className="text-xs text-gray-600">Centro Universit\u00e1rio Santo Agostinho</p>
      </div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 mb-2">\ud83d\udcbc Custo do Cargo</h1>
        <p className="text-gray-600 text-lg">Calculadora profissional de encargos trabalhistas brasileiros</p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Input */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-xl border-l-4 border-blue-500">
          <label className="block text-2xl font-bold text-gray-800 mb-6">\ud83d\udcb0 Sal\u00e1rio Base (R$)</label>
          <input type="number" value={salario} onChange={(e) => setSalario(Number(e.target.value))} aria-label="Sal\u00e1rio base do cargo" className="w-full px-6 py-4 text-2xl font-bold text-blue-600 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500 transition min-h-[44px]" />
          <p className="text-center text-gray-500 mt-4 text-sm">ARRASTE OU DIGITE</p>
        </motion.div>

        {/* Total */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl text-white">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">CUSTO TOTAL MENSAL</h2>
            <div className="text-right">
              <p className="text-sm font-medium opacity-80">Acr\u00e9scimo</p>
              <p className="text-4xl font-bold" aria-live="polite">{custos.aumento}%</p>
            </div>
          </div>
          <h3 className="text-5xl font-bold mb-6" aria-live="polite">{formatarMoeda(custos.custoTotal)}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-sm opacity-80">Sal\u00e1rio</p>
              <p className="text-2xl font-bold">{formatarMoeda(custos.salario)}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-sm opacity-80">Encargos</p>
              <p className="text-2xl font-bold" aria-label={`Encargos: ${formatarMoeda(custos.custoEncargos)}`}>{formatarMoeda(custos.custoEncargos)}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-sm opacity-80">13\u00ba+F\u00e9rias</p>
              <p className="text-2xl font-bold">{formatarMoeda(custos.custoFerias + custos.custo13)}</p>
            </div>
          </div>
        </motion.div>
      </div>

  {/* Encargos Grid */}
  <div className="max-w-6xl mx-auto mb-12">
    <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Detalhamento dos Encargos</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ENCARGOS.map((encargo) => {
        const valor = custos[encargo.chave];
        const percentual = (valor / custos.custoTotal) * 100;
        return (
          <div key={encargo.chave} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{encargo.icone}</span>
                <h3 className="font-bold text-slate-800">{encargo.nome}</h3>
              </div>
              <span className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-1">{percentual.toFixed(1)}%</span>
            </div>
            <p className="text-xs text-gray-600 mb-2">{encargo.descricao}</p>
            <p className="text-xl font-bold text-indigo-600">{formatarMoeda(valor)}</p>
          </div>
        );
      })}
    </div>
  </div>

  {/* Gráfico de Pizza */}
  <div className="max-w-6xl mx-auto mb-12">
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Composição do Custo</h2>
      <div className="flex justify-center overflow-x-auto pb-4">
        <PieChart width={400} height={400}>
          <Pie
            data={[
              { name: 'Salário', value: custos.salario, fill: '#1e293b' },
              { name: 'INSS', value: custos.custoINSS, fill: '#6366f1' },
              { name: 'RAT', value: custos.custoRAT, fill: '#a78bfa' },
              { name: 'S. Educação', value: custos.custoSalarioEduc, fill: '#c4b5fd' },
              { name: 'Sistema S', value: custos.custoSistemaS, fill: '#ddd6fe' },
              { name: 'FGTS', value: custos.custoFGTS, fill: '#ede9fe' },
              { name: 'Multa', value: custos.custoMulta, fill: '#f3e8ff' }
            ]}
            cx={200}
            cy={200}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          />
        </PieChart>
      </div>
      <p className="text-xs text-gray-600 text-center mt-4">Os encargos podem variar conforme a CCT e legislação vigente</p>
    </div>
  </div>

  {/* Informações Legais */}
  <div className="max-w-6xl mx-auto mb-12">
    <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-8 border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">\ud83d\udccb Fundamentação Legal</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div><strong>INSS:</strong> Lei 8.212/91 - Contribuição do empregador</div>
        <div><strong>RAT:</strong> Lei 8.213/91 - Risco da atividade</div>
        <div><strong>S. Educação:</strong> Lei 9.424/96 - Salário-educação</div>
        <div><strong>Sistema S:</strong> Leis 8.149/90 e 8.706/93 - SESI, SENAI, SESC</div>
        <div><strong>FGTS:</strong> Lei 8.036/90 - Fundo de Garantia</div>
        <div><strong>Multa Resc</strong>: EC 103/2019 - Proventos resc</div>
      </div>
    </div>
  </div>

  {/* Botão Compartilhar */}
  <div className="max-w-6xl mx-auto text-center mb-12">
    <button
      onClick={handleCompartilharURL}
      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
    >
      🔗 Compartilhar Cenário via URL
    </button>
  </div>

  {/* Rodapé UNIFSA */}
  <div className="bg-slate-50 border-t border-slate-200 py-8 text-center text-gray-600 text-sm">
    <p>Desenvolvido para <strong>Centro Universitário Santo Agostinho (UNIFSA)</strong></p>
    <p className="mt-2">Esta calculadora é fornecida como ferramenta educacional e não substitui consulta profissional</p>
  </div>
</div>
);
}

export default CustoCargoEmpresa;
