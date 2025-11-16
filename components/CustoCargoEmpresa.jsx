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
      custoFerias,
      custo13,
      custoTotal,
      chartData: ENCARGOS.map(e => ({ nome: e.nome, value: e.pct * 100, fill: ['#8b5cf6', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][ENCARGOS.indexOf(e)] })),
    };
  }, [salario]);

  return (
    <div className="bg-white p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-6 mb-8">
        <h1 className="text-2xl lg:text-4xl font-bold text-center text-purple-700 mb-4">Custo do Cargo</h1>
        <p className="text-center text-gray-600 mb-6">Calculadora profissional de encargos trabalhistas</p>
      </div>
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-8">
        <input type="number" value={salario} onChange={(e) => setSalario(Number(e.target.value))} placeholder="Digite o salário" className="w-full p-3 border-2 border-purple-300 rounded-lg text-lg font-bold text-purple-700" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {ENCARGOS.map((enc) => (
          <div key={enc.nome} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 shadow-sm">
            <p className="text-2xl mb-2">{enc.icone}</p>
            <p className="text-sm font-bold text-gray-700">{enc.nome}</p>
            <p className="text-lg font-bold text-purple-600">{formatarMoeda(custos['custo' + enc.nome.replace('.', '')] || 0)}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-center mb-6">Composição do Custo</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={custos.chartData} cx="50%" cy="50%" labelLine={false} label={({ nome, value }) => `${nome}: ${value.toFixed(1)}%`} outerRadius={80} dataKey="value" fill="#8b5cf6">
              {custos.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-purple-700 mb-4">👥 Integrantes do Grupo</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-purple-100 rounded p-2 text-sm font-medium">Ana Luiza</div>
          <div className="bg-purple-100 rounded p-2 text-sm font-medium">Priscila</div>
          <div className="bg-blue-100 rounded p-2 text-sm font-medium">David Bringel</div>
          <div className="bg-pink-100 rounded p-2 text-sm font-medium">Marvel</div>
          <div className="bg-green-100 rounded p-2 text-sm font-medium">Kauã Santos</div>
          <div className="bg-yellow-100 rounded p-2 text-sm font-medium">Victor</div>
          <div className="bg-red-100 rounded p-2 text-sm font-medium">Pedro Sales</div>
        </div>
        <div className="border-t pt-4 space-y-2">
          <p className="text-sm text-gray-700"><strong>Professor Orientador:</strong> Rhubens Ewald Moura Ribeiro</p>
          <p className="text-sm text-gray-700"><strong>Grupo:</strong> Ostentação Prime</p>
          <p className="text-sm text-gray-700"><strong>Instituição:</strong> UNIFSA - Centro Universitário Santo Agostinho</p>
          <p className="text-sm text-gray-700"><strong>Localização:</strong> Teresina - PI</p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-600">Calculadora desenvolvida para projeto acadêmico | Valores para fins educacionais</p>
        <p className="text-xs text-gray-600 mt-2">Grupo Ostentação Prime - UNIFSA - Teresina, PI</p>
      </div>
    </div>
  );
}
