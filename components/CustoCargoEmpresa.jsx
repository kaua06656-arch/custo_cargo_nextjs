'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ENCARGOS = [
  { nome: 'INSS', pct: 0.20, icone: '🏥', cor: '#6366f1' },
  { nome: 'RAT', pct: 0.02, icone: '⚠️', cor: '#ef4444' },
  { nome: 'S.Educ', pct: 0.025, icone: '📚', cor: '#3b82f6' },
  { nome: 'S.S', pct: 0.033, icone: '🏢', cor: '#10b981' },
  { nome: 'FGTS', pct: 0.08, icone: '💰', cor: '#f59e0b' },
  { nome: 'Multa', pct: 0.032, icone: '📋', cor: '#8b5cf6' },
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
      chartData: ENCARGOS.map(e => ({ nome: e.nome, value: e.pct * 100, fill: e.cor })),
    };
  }, [salario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 lg:p-8">
      <style>{`
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-slide-in-down { animation: slideInDown 0.6s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="animate-slide-in-down mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-3">Custo do Cargo</h1>
          <p className="text-gray-300 text-lg">Calculadora profissional de encargos trabalhistas</p>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Salary Input */}
        <div className="animate-fade-in-up mb-12 delay-100">
          <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 card-hover">
            <label className="block text-sm font-semibold text-gray-300 mb-3">Salário Base (R$)</label>
            <input 
              type="number" 
              value={salario} 
              onChange={(e) => setSalario(Number(e.target.value))} 
              placeholder="Digite o salário" 
              className="w-full bg-white/10 border border-purple-400/30 rounded-xl p-4 text-xl font-bold text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all" 
            />
          </div>
        </div>

        {/* Encargos Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {ENCARGOS.map((enc, idx) => (
            <div key={enc.nome} className="animate-fade-in-up card-hover" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
              <div className={`bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 h-full`}>
                <p className="text-3xl mb-2">{enc.icone}</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{enc.nome}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">{formatarMoeda(custos['custo' + enc.nome.replace('.', '')] || 0)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Cost Composition */}
          <div className="animate-fade-in-up card-hover">
            <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Composição do Custo</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={custos.chartData} cx="50%" cy="50%" labelLine={false} label={({ nome, value }) => `${value.toFixed(1)}%`} outerRadius={80} dataKey="value" fill="#8b5cf6">
                    {custos.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="animate-fade-in-up card-hover" style={{ animationDelay: '200ms' }}>
            <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Resumo do Custo</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
                  <span className="text-gray-300">Salário</span>
                  <span className="text-lg font-bold text-purple-300">{formatarMoeda(custos.salario)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
                  <span className="text-gray-300">Encargos Totais</span>
                  <span className="text-lg font-bold text-blue-300">{formatarMoeda(custos.custoINSS + custos.custoRAT + custos.custoSalarioEduc + custos.custoSistemaS + custos.custoFGTS + custos.custoMulta)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
                  <span className="text-gray-300">13º + Férias</span>
                  <span className="text-lg font-bold text-green-300">{formatarMoeda(custos.custo13 + custos.custoFerias)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-3">
                  <span className="text-white font-bold">TOTAL MENSAL</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">{formatarMoeda(custos.custoTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Group Information */}
        <div className="animate-fade-in-up card-hover" style={{ animationDelay: '400ms' }}>
          <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">👥 Integrantes do Grupo</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {['Ana Luiza', 'Priscila', 'David Bringel', 'Marvel', 'Kauã Santos', 'Victor', 'Pedro Sales'].map((name, idx) => (
                <div key={name} className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg p-3 text-center hover:from-purple-500/30 hover:to-blue-500/30 transition-all" style={{ animationDelay: `${(idx + 5) * 50}ms` }}>
                  <p className="text-sm font-semibold text-white">{name}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-purple-500/20 pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-purple-400 font-bold">👨‍🎓</span>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Professor Orientador</p>
                  <p className="text-white font-semibold">Rhubens Ewald Moura Ribeiro</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">🎯</span>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Grupo / Instituição</p>
                  <p className="text-white font-semibold">Ostentação Prime / UNIFSA</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-bold">📍</span>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Localização</p>
                  <p className="text-white font-semibold">Teresina, Piauí - Brasil</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-8">
          <p className="text-sm text-gray-400">Calculadora desenvolvida para projeto acadêmico</p>
          <p className="text-xs text-gray-500 mt-1">Valores para fins educacionais • © 2025 Grupo Ostentação Prime</p>
        </div>
      </div>
    </div>
  );
}
