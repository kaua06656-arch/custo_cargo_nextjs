'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ENCARGOS = [
  { nome: 'INSS', pct: 0.20, icone: '🏥', cor: '#3b82f6' },
  { nome: 'RAT', pct: 0.02, icone: '⚠️', cor: '#8b5cf6' },
  { nome: 'S.Educ', pct: 0.025, icone: '📚', cor: '#6366f1' },
  { nome: 'S.S', pct: 0.033, icone: '🏢', cor: '#0ea5e9' },
  { nome: 'FGTS', pct: 0.08, icone: '💰', cor: '#06b6d4' },
  { nome: 'Multa', pct: 0.032, icone: '📋', cor: '#1e40af' },
];

const CustoCargoEmpresa = () => {
  const [salario, setSalario] = useState(5000);
  const [encargosData, setEncargosData] = useState([]);

  useEffect(() => {
    const calculados = ENCARGOS.map((enc) => ({
      name: enc.nome,
      value: parseFloat((salario * enc.pct).toFixed(2)),
      cor: enc.cor,
    }));
    setEncargosData(calculados);
  }, [salario]);

  const totalEncargos = encargosData.reduce((acc, enc) => acc + enc.value, 0);
  const custoTotal = salario + totalEncargos;
  const percentualTotal = ((totalEncargos / salario) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide {
          animation: slideInDown 0.6s ease-out;
        }
        .animate-fade {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-12 animate-slide">
        <h1 className="text-5xl font-bold text-slate-800 mb-2">Custo do Cargo</h1>
        <p className="text-lg text-slate-600">Análise de Encargos Trabalhistas</p>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-slate-400 mx-auto mt-4"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 animate-fade">
          <label className="block text-slate-700 font-semibold mb-3">Salário Base (R$)</label>
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-semibold text-slate-800"
            aria-label="Digite o salário"
          />
        </div>

        {/* Encargos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-fade" style={{ animationDelay: '0.1s' }}>
          {ENCARGOS.map((encargoInfo, idx) => {
            const encargo = encargosData[idx];
            return (
              <div
                key={encargoInfo.nome}
                className="bg-white rounded-lg shadow-md p-6 border-l-4"
                style={{ borderLeftColor: encargoInfo.cor }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{encargoInfo.icone}</span>
                  <span className="text-sm font-semibold text-slate-500 uppercase">{encargoInfo.nome}</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">R$ {encargo.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-500 mt-2">{(encargoInfo.pct * 100).toFixed(1)}%</p>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart Section */}
          <div className="bg-white rounded-lg shadow-md p-8 animate-fade" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Composição do Custo</h2>
            {encargosData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={encargosData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${((value / custoTotal) * 100).toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {encargosData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.cor} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Summary Section */}
          <div className="bg-gradient-to-br from-blue-500 to-slate-700 rounded-lg shadow-lg p-8 text-white animate-fade" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold mb-6">Resumo do Custo</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white border-opacity-20 pb-4">
                <span className="text-lg">Salário Base:</span>
                <span className="text-2xl font-bold">R$ {salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white border-opacity-20 pb-4">
                <span className="text-lg">Encargos Totais:</span>
                <span className="text-2xl font-bold">R$ {totalEncargos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center pb-4">
                <span className="text-lg">% de Encargos:</span>
                <span className="text-2xl font-bold">{percentualTotal}%</span>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-100 mb-2">CUSTO TOTAL DO CARGO</p>
                <p className="text-4xl font-bold">R$ {custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Group Members Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 animate-fade" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
            <span className="text-3xl mr-3">👥</span>
            Integrantes do Grupo
          </h2>

          {/* Members Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {[
              { nome: 'Ana Luiza', cor: '#e0e7ff' },
              { nome: 'Priscila', cor: '#dbeafe' },
              { nome: 'David Bringel', cor: '#e0f2fe' },
              { nome: 'Marvel', cor: '#f0f9ff' },
              { nome: 'Kauã Santos', cor: '#dbeafe' },
              { nome: 'Victor', cor: '#e0e7ff' },
              { nome: 'Pedro Sales', cor: '#f3e8ff' },
            ].map((membro, idx) => (
              <div
                key={idx}
                className="rounded-lg p-4 text-center font-semibold text-slate-700 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                style={{ backgroundColor: membro.cor }}
              >
                {membro.nome}
              </div>
            ))}
          </div>

          {/* Group Info */}
          <div className="border-t-2 border-slate-200 pt-6 space-y-3">
            <div className="flex items-start">
              <span className="font-semibold text-slate-700 mr-3">👨‍🏫 Professor Orientador:</span>
              <span className="text-slate-600">Rhubens Ewald Moura Ribeiro</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-slate-700 mr-3">📋 Grupo:</span>
              <span className="text-slate-600">Ostentação Prime</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-slate-700 mr-3">📍 Localização:</span>
              <span className="text-slate-600">Teresina - PI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 pb-8 text-slate-600 text-sm animate-fade" style={{ animationDelay: '0.5s' }}>
        <p className="mb-2">Projeto acadêmico | Análise de Custos do Cargo para fins educacionais</p>
        <p className="text-slate-500">Ostentação Prime - Teresina, PI</p>
      </div>
    </div>
  );
};

export default CustoCargoEmpresa;
