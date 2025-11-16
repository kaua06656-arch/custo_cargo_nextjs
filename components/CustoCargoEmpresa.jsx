'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ENCARGOS = [
  { nome: 'INSS', pct: 0.20, icone: '💼' },
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

  const COLORS = ['#1e293b', '#6366f1', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f3e8ff'];

  return (
    <div className="min-h-screen bg-gradient max-w-7xl mx-auto-to-b from-purple-50 to-white">
      {/* Header Sticky */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-3 py-2 sm:px-6 sm:py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-xl font-bold text-purple-600 truncate">💼 Custo</h1>
            <p className="text-xs text-gray-500">Encargos</p>
          </div>
          <div className="ml-3 flex-shrink-0 px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">UNIFSA</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-3 sm:px-6 py-2 border-b border-gray-200 flex gap-2 overflow-x-auto">
        {['resumo', 'detalhes', 'grafico'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-lg transition ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab === 'resumo' && 'Resumo'}
            {tab === 'detalhes' && 'Detalhes'}
            {tab === 'grafico' && 'Grafico'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="px-3 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-6 lg:py-8 pb-40 sm:pb-20 space-y-3 sm:space-y-6">
        {/* Tab: Resumo */}
        {activeTab === 'resumo' && (
          <div className="space-y-3 sm:space-y-4">
            {/* Input */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
              <label className="text-sm sm:text-base font-bold text-gray-700 block mb-2">Salario Base (R$)</label>
              <input
                type="number"
                value={salario}
                onChange={(e) => setSalario(Number(e.target.value))}
                className="w-full px-3 py-2 sm:py-3 text-base sm:text-lg font-bold text-purple-600 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 transition min-h-[44px]"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Toque para editar</p>
            </div>

            {/* Total Cost - Prominent */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 sm:p-6 shadow-lg text-white">
              <p className="text-xs sm:text-sm opacity-90 mb-1">CUSTO TOTAL MENSAL</p>
              <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">{formatarMoeda(custos.custoTotal)}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-2 sm:p-3">
                  <p className="text-xs opacity-80">Salario</p>
                  <p className="font-bold text-sm sm:text-base">{formatarMoeda(custos.salario)}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-2 sm:p-3">
                  <p className="text-xs opacity-80">Encargos</p>
                  <p className="font-bold text-sm sm:text-base">{formatarMoeda(custos.custoEncargos)}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-2 sm:p-3">
                  <p className="text-xs opacity-80">13+Ferias</p>
                  <p className="font-bold text-sm sm:text-base">{formatarMoeda(custos.custoFerias + custos.custo13)}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm mt-3 opacity-90">Aumento: {custos.aumento}%</p>
            </div>
          </div>
        )}

        {/* Tab: Detalhes */}
        {activeTab === 'detalhes' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
            {ENCARGOS.map((encargo) => {
              const valor = custos[`custo${encargo.nome.replace('.', '')}`];
              const percentualReal = (valor / custos.custoTotal) * 100;
              return (
                <div key={encargo.nome} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border-l-4 border-purple-400">
                  <div className="text-2xl sm:text-3xl mb-2">{encargo.icone}</div>
                  <p className="text-xs sm:text-sm font-bold text-gray-800">{encargo.nome}</p>
                  <p className="text-xs text-gray-600 mb-1">{percentualReal.toFixed(1)}%</p>
                  <p className="text-sm sm:text-base font-bold text-purple-600">{formatarMoeda(valor)}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab: Grafico */}
        {activeTab === 'grafico' && (
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <p className="text-sm sm:text-base font-bold text-gray-800 mb-4 text-center">Composicao do Custo</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatarMoeda(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>

          <div className="px-3 sm:px-6 lg:px-8 xl:px-10 py-8 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seção Grupo */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-purple-700">👥 Grupo Ostentação Prime</h3>
              <p className="text-sm text-gray-600"><strong>Instituição:</strong> Centro Universitário Santo Agostinho (UNIFSA)</p>
              <p className="text-sm text-gray-600"><strong>Localidade:</strong> Teresina - PI</p>
              <p className="text-sm text-gray-600"><strong>Professor Orientador:</strong> Rhubens Ewald Moura Ribeiro</p>
            </div>
            {/* Integrantes */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-purple-700">✨ Integrantes do Grupo</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>• Ana Luiza</div>
                <div>• Priscila</div>
                <div>• David Bringel</div>
                <div>• Marvel</div>
                <div>• Kauã Santos</div>
                <div>• Victor</div>
                <div className="col-span-2">• Pedro Sales</div>
              </div>
            </div>
          </div>
        </div>
      </div>

          {/* SEÇÃO TEÓRICA */}
      <div className="px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 bg-blue-50 border-l-4 border-blue-500">
        <h3 className="text-base sm:text-lg font-bold text-blue-800 mb-3">📚 Por que o Salário não Reflete o Custo Total?</h3>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2">
          O <strong>salário</strong> é apenas a remuneração direta ao funcionário. Mas a <strong>empresa assume custos adicionais</strong> obrigatórios (INSS, FGTS, impostos) e indiretos (13º salário, férias). Isso representa <strong>aumentos de 40% a 65%</strong> no custo total.
        </p>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          Um salário de R$ 5.000 que aparenta "gasto" de R$ 5.000/mês custa à empresa cerca de R$ 8.100/mês quando tudo é considerado.
        </p>
      </div>

      {/* ANÁLISE COMPARATIVA */}
      <div className="px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 bg-green-50 border-l-4 border-green-500">
        <h3 className="text-base sm:text-lg font-bold text-green-800 mb-4">📊 Análise Comparativa por Cargo</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-green-200 text-green-900 font-bold">
              <tr>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-left">Cargo</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-right">Salário</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-right">Encargos</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-right">Custo Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-green-200 hover:bg-green-100">
                <td className="px-2 py-1 sm:px-3 sm:py-2">Assistente</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 2.500</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 975</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold text-green-700">R$ 3.838</td>
              </tr>
              <tr className="border-b border-green-200 hover:bg-green-100">
                <td className="px-2 py-1 sm:px-3 sm:py-2">Analista</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 5.000</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 1.950</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold text-green-700">R$ 8.108</td>
              </tr>
              <tr className="border-b border-green-200 hover:bg-green-100">
                <td className="px-2 py-1 sm:px-3 sm:py-2">Gestor</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 8.000</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 3.120</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold text-green-700">R$ 12.973</td>
              </tr>
              <tr className="hover:bg-green-100">
                <td className="px-2 py-1 sm:px-3 sm:py-2">Diretor</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 12.000</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 4.680</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold text-green-700">R$ 19.460</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* IMPACTO NO CAIXA */}
      <div className="px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 bg-orange-50 border-l-4 border-orange-500">
        <h3 className="text-base sm:text-lg font-bold text-orange-800 mb-3">💰 Impacto dos Encargos no Caixa da Empresa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded border border-orange-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-1"><strong>10 Funcionários (Analistas)</strong></p>
            <p className="text-xs sm:text-sm text-orange-700">Salários: R$ 50.000</p>
            <p className="text-xs sm:text-sm text-orange-700">Encargos: R$ 19.500 (39%)</p>
            <p className="text-xs sm:text-sm font-bold text-orange-800">Custo Real: R$ 81.080/mês</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded border border-orange-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-1"><strong>50 Funcionários (Média)</strong></p>
            <p className="text-xs sm:text-sm text-orange-700">Salários: R$ 250.000</p>
            <p className="text-xs sm:text-sm text-orange-700">Encargos: R$ 97.500 (39%)</p>
            <p className="text-xs sm:text-sm font-bold text-orange-800">Custo Real: R$ 405.400/mês</p>
          </div>
        </div>
      </div>

      {/* TABELA ANUAL */}
      <div className="px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 bg-purple-50 border-l-4 border-purple-500">
        <h3 className="text-base sm:text-lg font-bold text-purple-800 mb-4">📈 Resumo Anual (Analystārio)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-purple-200 text-purple-900 font-bold">
              <tr>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-left">Período</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-right">Salários</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-right">Encargos</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-right">13º + Férias</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-purple-200 hover:bg-purple-100">
                <td className="px-2 py-1 sm:px-3 sm:py-2">Mês (Méd.)</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 5.000</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 1.950</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 809</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold text-purple-700">R$ 7.759</td>
              </tr>
              <tr className="border-b border-purple-200 hover:bg-purple-100">
                <td className="px-2 py-1 sm:px-3 sm:py-2">Trimestre</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 15.000</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 5.850</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 2.425</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold text-purple-700">R$ 23.275</td>
              </tr>
              <tr className="border-b border-purple-200 hover:bg-purple-100">
                <td className="px-2 py-1 sm:px-3 sm:py-2">Semestre</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 30.000</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 11.700</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">R$ 4.850</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold text-purple-700">R$ 46.550</td>
              </tr>
              <tr className="hover:bg-purple-100 bg-purple-100">
                <td className="px-2 py-1 sm:px-3 sm:py-2 font-bold">ANUAL</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold">R$ 60.000</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold">R$ 23.400</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold">R$ 9.700</td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-right font-bold text-lg text-purple-800">R$ 93.100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default CustoCargoEmpresa;
