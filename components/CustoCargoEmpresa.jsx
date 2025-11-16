'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ENCARGOS = [
  { nome: 'INSS', pct: 0.20, icone: '🏥' },
  { nome: 'RAT', pct: 0.02, icone: '⚠️' },
  { nome: 'S.Educ', pct: 0.025, icone: '📚' },
  { nome: 'S.S', pct: 0.033, icone: '🏢' },
  { nome: 'FGTS', pct: 0.08, icone: '💰' },
  { nome: 'Multa', pct: 0.032, icone: '📋' },
];

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function CustoCargoEmpresa() {
  const [salario, setSalario] = useState(5000);
  const [activeTab, setActiveTab] = useState('resumo');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sal = params.get('sal');
    if (sal) setSalario(Number(sal));
  }, []);

  const custos = useMemo(() => {
    const encargosTotal = ENCARGOS.reduce((acc, e) => acc + e.pct, 0);
    const custoEncargos = salario * encargosTotal;
    const custoFerias = (salario + custoEncargos) / 12;
    const custo13 = (salario + custoEncargos) / 12;
    const custoTotal = salario + custoEncargos + custoFerias + custo13;
    
    return {
      salario: Number(salario.toFixed(2)),
      custoINSS: Number((salario * 0.2).toFixed(2)),
      custoRAT: Number((salario * 0.02).toFixed(2)),
      custoSalarioEduc: Number((salario * 0.025).toFixed(2)),
      custoSistemaS: Number((salario * 0.033).toFixed(2)),
      custoFGTS: Number((salario * 0.08).toFixed(2)),
      custoMulta: Number((salario * 0.032).toFixed(2)),
      custoEncargos: Number(custoEncargos.toFixed(2)),
      custoFerias: Number(custoFerias.toFixed(2)),
      custo13: Number(custo13.toFixed(2)),
      custoTotal: Number(custoTotal.toFixed(2)),
      aumento: Number(((custoTotal - salario) / salario * 100).toFixed(1)),
    };
  }, [salario]);

  const chartData = [
    { name: 'Salário', value: custos.salario, pct: custos.salario },
    { name: 'Encargos', value: custos.custoEncargos, pct: custos.custoEncargos },
    { name: '13º+Férias', value: custos.custoFerias + custos.custo13, pct: custos.custoFerias + custos.custo13 },
  ];

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-purple-600">💼 Custo do Cargo</h1>
            <p className="text-sm text-gray-500">Calculadora profissional de encargos trabalhistas</p>
          </div>
          <div className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-full">🎓 UNIFSA</div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Input */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <label className="text-base font-bold text-gray-700 block mb-2">Salário Base (R$)</label>
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(Number(e.target.value))}
            className="w-full px-4 py-3 text-lg font-bold text-purple-600 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Total Cost */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg text-white">
          <p className="text-sm opacity-90 mb-1">CUSTO TOTAL MENSAL</p>
          <h2 className="text-4xl font-bold mb-4">{formatarMoeda(custos.custoTotal)}</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-80">Salário</p>
              <p className="font-bold text-lg">{formatarMoeda(custos.salario)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-80">Encargos</p>
              <p className="font-bold text-lg">{formatarMoeda(custos.custoEncargos)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-80">13º+Férias</p>
              <p className="font-bold text-lg">{formatarMoeda(custos.custoFerias + custos.custo13)}</p>
            </div>
          </div>
          <p className="text-sm mt-3">Aumento: {custos.aumento}%</p>
        </div>

        {/* Encargos Grid */}
        <div className="grid grid-cols-6 gap-4">
          {ENCARGOS.map((encargo) => {
            const valor = custos[`custo${encargo.nome.replace('.', '')}`];
            return (
              <div key={encargo.nome} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-400 text-center">
                <div className="text-3xl mb-2">{encargo.icone}</div>
                <p className="font-bold text-gray-800 mb-1">{encargo.nome}</p>
                <p className="text-xs text-gray-600 mb-1">{encargo.pct * 100}%</p>
                <p className="text-sm font-bold text-purple-600">{formatarMoeda(valor)}</p>
              </div>
            );
          })}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-lg font-bold text-gray-800 mb-4 text-center">Composição do Custo</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, pct }) => `${name}: ${(pct / custos.custoTotal * 100).toFixed(1)}%`}
                outerRadius={80}
                dataKey="pct"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Footer com Integrantes */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-purple-800 mb-4">👥 Grupo Ostentacao Prime</h3>
          <p className="text-sm text-gray-700 mb-1"><strong>Instituicao:</strong> Centro Universitario Santo Agostinho (UNIFSA)</p>
          <p className="text-sm text-gray-700 mb-4"><strong>Localidade:</strong> Teresina - PI</p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm font-bold text-purple-700 mb-2">👨‍🏫 Professor Orientador:</p>
            <p className="text-sm text-gray-800 font-semibold">Rhubens Ewald Moura Ribeiro</p>
          </div>
          
<div className="bg-white rounded-lg p-4 mb-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-purple-700 mb-4">👥 Integrantes do Grupo</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div className="bg-purple-50 rounded p-2 text-sm font-medium">Ana Luiza</div>
                <div className="bg-purple-50 rounded p-2 text-sm font-medium">Priscila</div>
                <div className="bg-blue-50 rounded p-2 text-sm font-medium">David Bringel</div>
                <div className="bg-pink-50 rounded p-2 text-sm font-medium">Marvel</div>
                <div className="bg-green-50 rounded p-2 text-sm font-medium">Kauã Santos</div>
                <div className="bg-yellow-50 rounded p-2 text-sm font-medium">Victor</div>
                <div className="bg-red-50 rounded p-2 text-sm font-medium">Pedro Sales</div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-700"><strong>Professor Orientador:</strong> Rhubens Ewald Moura Ribeiro</p>
              <p className="text-sm text-gray-700 mt-2"><strong>Grupo:</strong> Ostentação Prime</p>
              <p className="text-sm text-gray-700 mt-2"><strong>Instituição:</strong> UNIFSA - Centro Universitário Santo Agostinho</p>
              <p className="text-sm text-gray-700 mt-2"><strong>Localização:</strong> Teresina - PI</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4">Calculadora desenvolvida para projeto academico | Valores para fins educacionais</p>
        </div>
    </div>
  );
}
