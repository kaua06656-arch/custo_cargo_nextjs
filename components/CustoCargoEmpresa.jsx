'use client';
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

function money(x) {
  return Number(x || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const ENCARGOS = [
  { nome: 'INSS', pct: 0.20, cor: '#6366f1', icon: '🏥' },
  { nome: 'RAT', pct: 0.02, cor: '#3b82f6', icon: '⚠️' },
  { nome: 'S.Educacao', pct: 0.025, cor: '#06b6d4', icon: '📚' },
  { nome: 'S.S', pct: 0.033, cor: '#10b981', icon: '🏢' },
  { nome: 'FGTS', pct: 0.08, cor: '#f59e0b', icon: '💰' },
  { nome: 'Multa', pct: 0.032, cor: '#ef4444', icon: '📋' },
];

export default function CustoCargoEmpresa() {
  const [salario, setSalario] = useState(5000);

  const custos = useMemo(() => {
    const encargosTotal = ENCARGOS.reduce((acc, e) => acc + e.pct, 0);
    const custoEncargos = salario * encargosTotal;
    const custoFerias = (salario + custoEncargos) / 12;
    const custo13 = (salario + custoEncargos) / 12;
    const custoTotal = salario + custoEncargos + custoFerias + custo13;

    return {
      encargosTotal,
      custoEncargos,
      custoFerias,
      custo13,
      custoTotal,
      aumento: ((custoTotal - salario) / salario * 100).toFixed(1),
    };
  }, [salario]);

  const encargosDetalhados = ENCARGOS.map((e) => ({
    ...e,
    value: salario * e.pct,
  }));

  const chartData = [
    { name: 'Salário', value: salario, fill: '#a855f7' },
    { name: 'Encargos', value: custos.custoEncargos, fill: '#ec4899' },
    { name: '13º+Férias', value: custos.custoFerias + custos.custo13, fill: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-8">
      {/* UNIFSA Badge */}
      <div className="text-center py-6">
        <div className="inline-block bg-gradient-to-r from-green-500 to-blue-600 px-6 py-2 rounded-full text-white font-bold text-sm shadow-lg mb-4">
          🎓 UNIFSA
        </div>
        <p className="text-xs text-gray-500">Centro Universitário Santo Agostinho</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          💼 Custo do Cargo
        </h1>
        <p className="text-gray-600 text-lg">Calculadora profissional de encargos trabalhistas brasileiros</p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-xl border-l-4 border-blue-500"
        >
          <label className="block text-2xl font-bold text-gray-800 mb-6">💰 Salario Base (R$)</label>
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(Number(e.target.value))}
            className="w-full px-6 py-4 text-2xl font-bold text-blue-600 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500 transition"
          />
          <p className="text-center text-gray-500 mt-4 text-sm">ARRASTE OU DIGITE</p>
        </motion.div>

        {/* Total */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl p-8 shadow-2xl text-white"
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">CUSTO TOTAL MENSAL</h2>
            <div className="text-right">
              <p className="text-sm font-medium opacity-80">Acrescimo</p>
              <p className="text-4xl font-bold">{custos.aumento}%</p>
            </div>
          </div>
          <h3 className="text-5xl font-bold mb-6">{money(custos.custoTotal)}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-80">Salario</p>
              <p className="text-2xl font-bold">{money(salario)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-80">Encargos</p>
              <p className="text-2xl font-bold">{money(custos.custoEncargos)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-80">13o+Ferias</p>
              <p className="text-2xl font-bold">{money(custos.custoFerias + custos.custo13)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cards de Encargos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 max-w-6xl mx-auto"
      >
        {encargosDetalhados.map((encargo, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}
            className="rounded-xl p-6 text-center shadow-lg border border-opacity-30"
            style={{
              background: `linear-gradient(135deg, ${encargo.cor}22, ${encargo.cor})`,
              borderColor: encargo.cor,
            }}
          >
            <p className="text-4xl mb-3">{encargo.icon}</p>
            <p className="text-sm font-bold uppercase tracking-wide text-gray-700">{encargo.nome}</p>
            <p className="text-xs font-semibold mt-1 opacity-90 text-gray-600">{(encargo.pct * 100).toFixed(1)}%</p>
            <p className="text-xl font-bold mt-3" style={{ color: encargo.cor }}>
              {money(encargo.value)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts e Info */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Composicao do Custo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => money(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Info Legal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Info Legal</h3>
          <p className="text-gray-700 font-semibold mb-4">Base Legal:</p>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li>✓ CLT - Consolidacao Leis Trabalho</li>
            <li>✓ Lei 8.212/91 - Contrib Previdenciaria</li>
            <li>✓ Lei 8.213/91 - Beneficios</li>
            <li>✓ Lei 8.036/90 - FGTS</li>
            <li>✓ EC 103/2019 - Reforma Previdencia</li>
          </ul>
        </motion.div>
      </div>

      <p className="text-center text-gray-500 text-xs mt-12">Calculadora desenvolvida para projeto academico | Valores para fins educacionais</p>
    </div>
  );
}
