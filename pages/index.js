import dynamic from 'next/dynamic'
import Head from 'next/head'
const CustoCargoEmpresa = dynamic(() => import('../components/CustoCargoEmpresa'), { ssr: false })
export default function Home() {
  return (
    <>
      <Head>
        <title>Cálculo do Custo do Cargo — Empresa do Trabalho</title>
        <meta name="description" content="Calculadora interativa de custo do cargo - projeto acadêmico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CustoCargoEmpresa />
    </>
  )
}
