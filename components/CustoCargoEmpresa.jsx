import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

function money(x) {
  return Number(x || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const ENCARGOS = [
  { nome: 'INSS', pct: 0.20, cor: '#6366f1', icon: '🏥' },
  { nome: 'RAT', pct: 0.02, cor: '#3b82f6', icon: '⚠️' },
  { nome: 'S.Educacao', pct: 0.025, cor: '#0ea5e9', icon: '📚' },
  { nome: 'S.S', pct: 0.033, cor: '#06b6d4', icon: '🏢' },
  { nome: 'FGTS', pct: 0.08, cor: '#14b8a6', icon: '💰' },
  { nome: 'Multa', pct: 0.032, cor: '#10b981', icon: '📋' },
];

export default function CustoCargoEmpresa() {
  const [salario, setSalario] = useState(5000);
  const breakdown = useMemo(() => {
    const sal = Number(salario || 0);
    const enc = ENCARGOS.reduce((s,e) => s + sal*e.pct, 0);
    const dec13 = sal/12, ferias = sal*4/36;
    const total = sal + enc + dec13 + ferias;
    return {sal, enc, dec13, ferias, total, pct: ((total-sal)/sal)*100};
  }, [salario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-8">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">💼 Custo do Cargo</h1>
          <p className="text-gray-600 text-lg">Calculadora profissional de encargos trabalhistas brasileiros</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* INPUT */}
          <motion.div className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-lg border-l-4 border-indigo-500">
            <label className="block text-sm font-bold text-gray-700 mb-4">💰 Salario Base (R$)</label>
            <input type="number" value={salario} onChange={(e)=>setSalario(e.target.value)} className="w-full text-3xl font-bold text-indigo-600 border-2 border-indigo-200 rounded-lg p-3 focus:border-indigo-500 outline-none" />
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
              <p className="text-xs font-semibold text-indigo-900 uppercase">Arraste ou digite</p>
            </div>
          </motion.div>
          
          {/* RESULTADO PRINCIPAL */}
          <motion.div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm opacity-90 font-semibold">CUSTO TOTAL MENSAL</p>
                <h2 className="text-5xl font-black mt-2">{money(breakdown.total)}</h2>
              </div>
              <div className="text-right bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                <p className="text-xs opacity-90">Acrescimo</p>
                <p className="text-3xl font-bold">{breakdown.pct.toFixed(1)}%</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-white/10 p-2 rounded"><strong>{money(breakdown.sal)}</strong><br/>Salario</div>
              <div className="bg-white/10 p-2 rounded"><strong>{money(breakdown.enc)}</strong><br/>Encargos</div>
              <div className="bg-white/10 p-2 rounded"><strong>{money(breakdown.dec13+breakdown.ferias)}</strong><br/>13o+Ferias</div>
            </div>
          </motion.div>
        </div>
        
        {/* CARDS DOS ENCARGOS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {ENCARGOS.map((e,i) => (
            <motion.div key={i} initial={{y:20, opacity:0}} animate={{y:0,opacity:1}} transition={{delay:i*0.05}} className="bg-white rounded-lg p-4 shadow-md border-t-4" style={{borderColor:e.cor}}>
              <div className="text-2xl mb-2">{e.icon}</div>
              <p className="font-bold text-sm">{e.nome}</p>
              <p className="text-xs text-gray-600 mb-2">{(e.pct*100).toFixed(1)}%</p>
              <p className="text-lg font-black" style={{color:e.cor}}>{money(breakdown.sal * e.pct)}</p>
            </motion.div>
          ))}
        </div>
        
        {/* GRAFICO PIE */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Composicao do Custo</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={[{name:'Sal',val:breakdown.sal},{name:'Enc',val:breakdown.enc},{name:'13F',val:breakdown.dec13+breakdown.ferias}]} dataKey="val">
                  <Cell fill="#8b5cf6"/><Cell fill="#ec4899"/><Cell fill="#f59e0b"/>
                </Pie>
                <Tooltip formatter={v=>money(v)}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Info Legal</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Base Legal:</strong></p>
              <ul className="text-xs space-y-1">
                <li>✓ CLT - Consolidacao Leis Trabalho</li>
                <li>✓ Lei 8.212/91 - Contrib Previdenciaria</li>
                <li>✓ Lei 8.213/91 - Beneficios</li>
                <li>✓ Lei 8.036/90 - FGTS</li>
                <li>✓ EC 103/2019 - Reforma Previdencia</li>
              </ul>
            </div>
          </div>
        </motion.div>
        
        <div className="text-center text-xs text-gray-500 py-6">
          Calculadora desenvolvida para projeto academico | Valores para fins educacionais
        </div>
      </motion.div>
    </div>
  );
}
