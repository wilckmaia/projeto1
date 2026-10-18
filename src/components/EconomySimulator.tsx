'use client';
import { useState } from 'react';
import type { Lesson } from '@/lib/education';
const number = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const defaults = {
  'demanda-1': { labels: ['Choque de demanda (S)'], values: [0] },
  'demanda-2': { labels: ['Choque adverso de oferta (Z)'], values: [0] },
  'consumo-1': { labels: ['Renda disponível mensal (R$)', 'Consumo autônomo (R$)', 'Propensão marginal a consumir (0 a 1)'], values: [4000, 500, 0.75] },
  'consumo-2': { labels: ['Investimento inicial (R$)', 'Fluxo líquido em um ano (R$)', 'Taxa anual de desconto (%)'], values: [100000, 120000, 10] },
  'pib-1': { labels: ['Consumo (C)', 'Investimento (I)', 'Gastos governamentais (G)', 'Exportações (X)', 'Importações (M)', 'Aumento das importações'], values: [600, 250, 200, 150, 100, 200] },
  'pib-2': { labels: ['Quantidade produzida', 'Preço atual', 'Quantidade no ano-base', 'Preço no ano-base'], values: [120, 12, 100, 10] },
  'inflacao-1': { labels: ['Valor inicial (R$)', 'Inflação anual (%)', 'Anos'], values: [1000, 6, 5] },
  'inflacao-2': { labels: ['Quantidade de arroz (kg)', 'Preço-base do arroz', 'Preço atual do arroz', 'Quantidade de leite (L)', 'Preço-base do leite', 'Preço atual do leite', 'Quantidade de pão (kg)', 'Preço-base do pão', 'Preço atual do pão'], values: [10, 5, 7, 15, 4, 6, 5, 10, 12] },
  'desemprego-1': { labels: ['Pessoas ocupadas (O)', 'Pessoas desocupadas (D)', 'População em idade de trabalhar (PIA)', 'Pessoas que passam a procurar trabalho'], values: [650, 70, 1000, 50] },
  'desemprego-2': { labels: ['Produção total mensal', 'Produtividade inicial por trabalhador', 'Nova produtividade por trabalhador'], values: [10000, 100, 200] },
  'crescimento-1': { labels: ['PIB inicial do País A (R$ trilhões)', 'PIB inicial do País B (R$ trilhões)', 'Crescimento anual do País A (%)', 'Crescimento anual do País B (%)', 'Anos'], values: [1, 1, 2, 5, 20] },
  'crescimento-2': { labels: ['Capital físico (K)', 'Trabalho (L)', 'Produtividade tecnológica (A)'], values: [100, 100, 1] },
  'ciclos-1': { labels: ['PIB efetivo (R$ bilhões)', 'PIB potencial (R$ bilhões)'], values: [1900, 2000] },
  'ciclos-2': { labels: ['PIB inicial (R$ bilhões)', 'Contração no primeiro ano (%)', 'Crescimento no segundo ano (%)'], values: [1000, 10, 10] },
};
export function EconomySimulator({ kind, activity }: { kind: NonNullable<Lesson['documentId']>; activity: number }) {
  const key = `${kind}-${activity}` as keyof typeof defaults;
  const config = defaults[key];
  const [values, setValues] = useState<number[]>(config.values);
  const [show, setShow] = useState(false);
  const [a, b, c, d, e, f, g, h, j] = values;
  const valid = values.every(Number.isFinite) && values.every(value => value >= 0) && (key !== 'pib-2' || (c > 0 && d > 0)) && (key !== 'inflacao-2' || a * b + d * e + g * h > 0) && (key !== 'desemprego-1' || (a + b > 0 && c > 0 && a + b + d <= c)) && (key !== 'desemprego-2' || (b > 0 && c > 0)) && (key !== 'ciclos-1' || b > 0) && (key !== 'ciclos-2' || (a > 0 && b < 100)) && (key !== 'consumo-1' || (a > 0 && c <= 1)) && (key !== 'demanda-2' || a <= 2200);
  let results: [string, number][] = [];
  if (key === 'demanda-1') {
    const price = (1200 + a) / 9;
    results = [['Preço de equilíbrio', price], ['Produção de equilíbrio (bilhões)', 600 + 4 * price]];
  }
  if (key === 'demanda-2') {
    const price = (1400 + a) / 9;
    results = [['Nível de preços de equilíbrio', price], ['PIB real de equilíbrio (bilhões)', 2000 - 5 * price]];
  }
  if (key === 'consumo-1') {
    const consumption = b + c * a;
    results = [['Consumo mensal (R$)', consumption], ['Poupança mensal (R$)', a - consumption], ['Consumo como proporção da renda (%)', consumption / a * 100]];
  }
  if (key === 'consumo-2') {
    const presentValue = b / (1 + c / 100);
    results = [['Valor presente do retorno (R$)', presentValue], ['Valor presente líquido (R$)', presentValue - a]];
  }
  if (key === 'pib-1') results = [['PIB inicial (R$ bilhões)', a + b + c + d - e], ['Novas importações (R$ bilhões)', e + f], ['Novo PIB (R$ bilhões)', a + b + c + d - e - f]];
  if (key === 'pib-2') results = [['PIB nominal (R$)', a * b], ['PIB real (R$)', a * d], ['Crescimento nominal (%)', (a * b / (c * d) - 1) * 100], ['Crescimento real (%)', (a / c - 1) * 100]];
  if (key === 'inflacao-1') results = [['Preço futuro da cesta (R$)', a * (1 + b / 100) ** c], ['Poder de compra futuro em valores de hoje (R$)', a / (1 + b / 100) ** c]];
  if (key === 'inflacao-2') {
    const base = a * b + d * e + g * h, current = a * c + d * f + g * j;
    results = [['Custo inicial (R$)', base], ['Custo atual (R$)', current], ['Inflação da cesta (%)', (current / base - 1) * 100]];
  }
  if (key === 'desemprego-1') results = [['Taxa de desocupação inicial (%)', b / (a + b) * 100], ['Taxa de participação inicial (%)', (a + b) / c * 100], ['Nova taxa de desocupação (%)', (b + d) / (a + b + d) * 100], ['Nova taxa de participação (%)', (a + b + d) / c * 100]];
  if (key === 'desemprego-2') results = [['Trabalhadores necessários inicialmente', a / b], ['Trabalhadores com a nova produtividade', a / c]];
  if (key === 'crescimento-1') results = [['PIB final do País A (R$ trilhões)', a * (1 + c / 100) ** e], ['PIB final do País B (R$ trilhões)', b * (1 + d / 100) ** e]];
  if (key === 'crescimento-2') results = [['Produção inicial', c * a ** 0.35 * b ** 0.65], ['Produção com o dobro da tecnologia', 2 * c * a ** 0.35 * b ** 0.65]];
  if (key === 'ciclos-1') results = [['Hiato do produto (%)', (a - b) / b * 100]];
  if (key === 'ciclos-2') {
    const afterContraction = a * (1 - b / 100);
    results = [['PIB após a contração (R$ bilhões)', afterContraction], ['PIB após a recuperação (R$ bilhões)', afterContraction * (1 + c / 100)], ['Crescimento necessário após a contração para retornar ao PIB inicial (%)', (a / afterContraction - 1) * 100]];
  }
  return <div className="economy-simulator"><h3>Simular os valores</h3><div className="simulator-fields">{config.labels.map((label, index) => <label key={label}>{label}<input type="number" min="0" step="any" value={Number.isNaN(values[index]) ? '' : values[index]} onChange={event => { setValues(current => current.map((value, i) => i === index ? event.target.valueAsNumber : value)); setShow(false); }}/></label>)}</div><button className="secondary-button" disabled={!valid} onClick={() => setShow(true)}>Calcular simulação</button>{!valid && <p role="alert">Preencha valores válidos. Os valores de referência usados como divisores devem ser maiores que zero.</p>}{show && valid && <dl aria-live="polite">{results.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{Number.isFinite(value) ? number(value) : 'Valor fora do intervalo de cálculo'}</dd></div>)}</dl>}</div>;
}
