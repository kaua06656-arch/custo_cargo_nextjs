import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ENCARGOS = [
  { nome: 'INSS', pct: 0.20, cor: '#3b82f6' },
  { nome: 'RAT', pct: 0.02, cor: '#8b5cf6' },
  { nome: 'S.Educ', pct: 0.025, cor: '#6366f1' },
  { nome: 'S.S', pct: 0.033, cor: '#0ea5e9' },
  { nome: 'FGTS', pct: 0.08, cor: '#06b6d4' },
  { nome: 'Multa', pct: 0.032, cor: '#1e40af' },
];

export default function CustoCargoEmpresa() {
  const [salario, setSalario] = useState(5000);
  
  const calculados = ENCARGOS.map((enc) => ({
    name: enc.nome,
    value: Math.round(salario * enc.pct * 100) / 100,
    cor: enc.cor
  }));
  
  const totalEncargos = calculados.reduce((acc, enc) => acc + enc.value, 0);
  const custoTotal = salario + totalEncargos;
  const percentualTotal = ((totalEncargos / salario) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-slate-800">Custo do Cargo</h1>
        <p className="text-slate-600 mt-2">Analise de Encargos</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-slate-700 font-semibold mb-2">Salario Base</label>
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {calculados.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded shadow p-4"
              style={{ borderLeft: `4px solid ${item.cor}` }}
            >
              <p className="text-sm text-slate-500 uppercase">{item.name}</p>
              <p className="text-lg font-bold text-slate-800">R$ {item.value.toLocaleString('pt-BR')}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Composicao</h2>
            {calculados.length > 0 && (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={calculados}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {calculados.map((entry, idx) => (
                      <Cell key={idx} fill={entry.cor} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-slate-700 rounded-lg shadow p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Resumo</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Salario:</span>
                <span className="font-bold">R$ {salario.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Encargos:</span>
                <span className="font-bold">R$ {totalEncargos.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span>%:</span>
                <span className="font-bold">{percentualTotal}%</span>
              </div>
              <div className="bg-white bg-opacity-10 rounded p-3 mt-4">
                <p className="text-xs text-blue-100 mb-1">TOTAL</p>
                <p className="text-3xl font-bold">R$ {custoTotal.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Integrantes do Grupo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { nome: 'Ana Luiza' },
              { nome: 'Priscila' },
              { nome: 'David Bringel' },
              { nome: 'Marvel' },
              { nome: 'Kaue Santos' },
              { nome: 'Victor' },
              { nome: 'Pedro Sales' }
            ].map((m, i) => (
              <div
                key={i}
                className="bg-blue-100 rounded p-3 text-center text-sm font-semibold text-slate-700"
              >
                {m.nome}
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2 text-sm">
            <p>
              <strong>Professor:</strong> Rhubens Ewald Moura Ribeiro
            </p>
            <p>
              <strong>Grupo:</strong> Ostentacao Prime
            </p>
            <p>
              <strong>Local:</strong> Teresina - PI
            </p>
          </div>
        </div>

        <div className="text-center text-slate-600 text-xs">
          <p>Projeto academico | Analise de Custos do Cargo</p>
          <p className="text-slate-500">Ostentacao Prime - Teresina, PI</p>
        </div>
      </div>
    </div>
  );
}
