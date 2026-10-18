// Use stable, globally unique IDs. Legacy IDs must never be reused.
export type Lesson = {
  documentId?: 'pib' | 'inflacao' | 'desemprego' | 'crescimento' | 'ciclos' | 'demanda' | 'consumo';
  sequential?: boolean;
  id: string; title: string; summary: string; explanation: string;
  deepContent: string; keyConcepts: string[]; examples: string[];
  questions: { prompt: string; options: string[]; correctIndex: number; explanation: string }[];
};
export type Track = { id: string; title: string; description: string; overview?: string; internalTopics?: string; reference?: { label: string; url: string }; lessons: Lesson[] };

const economyTracks: Track[] = [
  {
    "id": "economia-macroeconomia",
    "title": "1. Macroeconomia",
    "overview": "Estuda o funcionamento da economia de um país como um todo.",
    "description": "Estuda o funcionamento da economia nacional e suas principais variáveis.",
    "reference": {
      "label": "O desafio do carrinho: estratégias para enfrentar a alta de preços sem perder a qualidade na mesa | Jornal Correio",
      "url": "https://images.openai.com/static-rsc-4/XiC8NU9BaiNYrLQKr6wYzxbFeuFMoLmrUAuTN6jFm85c765Ng4QrXundSSAk15nno3GrmyrlO-mQyGGOq3pGyJzkx6XsugdUTuQR1YNkTQfr1l9JJfaRABOOjAMUVNwWMDB4ZwFPNvUXgg8SNv-HPyCoOX8hpjRC6SnvYMhiUiM?purpose=inline"
    },
    "lessons": [
      {
        "id": "economia-macro-topico-1",
        "title": "1. Produto Interno Bruto (PIB) — cálculo, composição e interpretação.",
        "summary": "",
        "explanation": "",
        "deepContent": "",
        "keyConcepts": [],
        "examples": [],
        "questions": [],
        "documentId": "pib"
      },
      {
        "id": "economia-micro-inflacao-topico-1",
        "title": "Tópico 2 — Inflação e Deflação",
        "summary": "",
        "explanation": "",
        "deepContent": "",
        "keyConcepts": [],
        "examples": [],
        "questions": [],
        "documentId": "inflacao"
      },
      {
        "id": "economia-macro-topico-3",
        "title": "3. Desemprego e mercado de trabalho — taxas, tipos e dinâmica do emprego.",
        "summary": "",
        "explanation": "",
        "deepContent": "",
        "keyConcepts": [],
        "examples": [],
        "questions": [],
        "documentId": "desemprego"
      },
      {
        "id": "economia-macro-topico-4",
        "title": "Tópico 4 — Crescimento Econômico",
        "summary": "", "explanation": "", "deepContent": "",
        "keyConcepts": [], "examples": [], "questions": [],
        "documentId": "crescimento"
      },
      {
        "id": "economia-macro-topico-5",
        "title": "Tópico 5 — Ciclos Econômicos",
        "summary": "", "explanation": "", "deepContent": "",
        "keyConcepts": [], "examples": [], "questions": [],
        "documentId": "ciclos"
      },
      {
        "id": "economia-macro-topico-6",
        "title": "Tópico 6 — Demanda e Oferta Agregadas",
        "summary": "", "explanation": "", "deepContent": "",
        "keyConcepts": [], "examples": [], "questions": [],
        "documentId": "demanda"
      },
      {
        "id": "economia-macro-topico-7",
        "title": "Tópico 7 — Consumo, Poupança e Investimento",
        "summary": "", "explanation": "", "deepContent": "",
        "keyConcepts": [], "examples": [], "questions": [],
        "documentId": "consumo"
      }
    ]
  },
  {
    "id": "economia-microeconomia",
    "title": "2. Microeconomia",
    "overview": "Estuda as decisões de consumidores, empresas e mercados.",
    "description": "Estuda como indivíduos, consumidores e empresas tomam decisões econômicas.",
    "reference": {
      "label": "Gamma",
      "url": "https://images.openai.com/static-rsc-4/d_gW2Y2-mGGLOBSFxr9X1E2Sf7N6GFd7tJCbLc-lp1V1UhX3sfty1pg7zEIj3rHmOcMHAit9WXzXOAColMfUtffOAfqLzdz6a3MNSP3LXsLCPlcwSoJ0ueD-U5rOvC9UHsbx78FUiWlqXh5BaC2HgKaBR4V9HCJXkX611VsJ3zY?purpose=inline"
    },
    "lessons": []
  },
  {
    "id": "economia-setor-publico",
    "title": "3. Economia do Setor Público",
    "overview": "Analisa a participação do Estado na economia.",
    "description": "Estuda impostos, gastos governamentais e a atuação econômica do Estado.",
    "reference": {
      "label": "Port Congestion: Everything You Should Know for 2025",
      "url": "https://images.openai.com/static-rsc-4/8lx7VHWWtRiH2ix9Sv6kaJNoSk2ikk14Zcl3LyqgqWB_inoccMgXnfqJ1yhsKptDGVK8QSt7Vt7ZmxnnIY85HG4DjRJHmZFQJPVN69q-oe4NP7eHUd1hNDKoVivAelN6JpMWzLTzSW9rLAwSYNWHk3TUM_xaMqCFsiN1XOchpMM?purpose=inline"
    },
    "lessons": []
  },
  {
    "id": "economia-internacional",
    "title": "4. Economia Internacional",
    "overview": "Estuda as relações econômicas entre países.",
    "description": "Estuda comércio, investimentos e relações econômicas entre países.",
    "reference": {
      "label": "Bolsamania - La web de la bolsa y los mercados de valores  - Bolsamania.com",
      "url": "https://images.openai.com/static-rsc-4/3oClj5PevTIH4Y53kdqhjtIfumpfyzN-R6aIaXBZorNW22Arcjtrg2Nr7iBr3DrnOT3Wc2eSjLvsV0wRIwGhMqZNop_VCs0_NBgilg9kFxveHMsTF4m_SruddcRhPztBchxedYWqBbo4wiOLDwvFtZMIiMuzU0xNEgpVzkKCE70?purpose=inline"
    },
    "lessons": []
  },
  {
    "id": "economia-monetaria-financeira",
    "title": "5. Economia Monetária e Financeira",
    "overview": "Investiga o funcionamento do dinheiro, do crédito e do sistema financeiro.",
    "description": "Estuda moeda, bancos, crédito, juros e mercados financeiros.",
    "reference": {
      "label": "Leadership Blueprint in Manufacturing Organizations | TQR",
      "url": "https://images.openai.com/static-rsc-4/XBLx7yFTdoUk-BXp9J9wyJyf4LzOj8A8jWJTT7ikunuW42DCm0-GrtbZ-NWUG6CN6w_W6x_I19SUSQQDYN3sY9OzCuS-g3zVxCZAHb8sLtZpVHHFKV1uvz8u1hIX3Ax3jncAOV16HuYiUl06FSFcG3_li4H8s2x-3d_3lWbS6AQ?purpose=inline"
    },
    "lessons": []
  },
  {
    "id": "economia-desenvolvimento",
    "title": "6. Desenvolvimento Econômico",
    "overview": "Investiga por que alguns países enriquecem e outros permanecem pobres.",
    "description": "Estuda como as sociedades aumentam sua produtividade, renda e qualidade de vida.",
    "reference": {
      "label": "Relationship of Political Science with Other Social Sciences",
      "url": "https://images.openai.com/static-rsc-4/YsDmz36vH4A_4W4fE6R3oxV66LanziLDGQkl6IGXRbw_aixxTJKnrDGWbFN4bLeNkYzRhTWySk4Onz6r3L2K4iRelOCIzpqRRvP0IgyMZAqVjIfRc6uIkebdT-XnCw2G4Zpxlslzuss2TElr0nVABLzXn3AnkAXYbp9Um5e7bJA?purpose=inline"
    },
    "lessons": []
  },
  {
    "id": "economia-politica",
    "title": "7. Economia Política",
    "overview": "Estuda como instituições, interesses e decisões políticas influenciam a economia.",
    "description": "Estuda as relações entre poder político, instituições, interesses e resultados econômicos.",
    "lessons": []
  }
];

export type EducationWorld = {
  id: string; name: string; number: string; subtitle: string; description: string;
  color: string; icon: string; certificateTitle: string; tracks: Track[];
};
export const educationWorlds: EducationWorld[] = [
  { id: 'executivo', name: 'Executivo', number: '1', subtitle: 'Poder Executivo brasileiro', description: 'Um espaço para estudar o Poder Executivo brasileiro.', color: '#967000', icon: 'executive', certificateTitle: 'Certificado do Poder Executivo', tracks: [] },
  { id: 'legislativo', name: 'Legislativo', number: '2', subtitle: 'Poder Legislativo brasileiro', description: 'Um espaço para estudar o Poder Legislativo brasileiro.', color: '#285bb5', icon: 'legislative', certificateTitle: 'Certificado do Poder Legislativo', tracks: [] },
  { id: 'judiciario', name: 'Judiciário', number: '3', subtitle: 'Poder Judiciário brasileiro', description: 'Um espaço para estudar o Poder Judiciário brasileiro.', color: '#b43941', icon: 'judicial', certificateTitle: 'Certificado do Poder Judiciário', tracks: [] },
  { id: 'economia', name: 'Economia', number: '4', subtitle: 'Economia brasileira', description: 'Um espaço para estudar a economia e o funcionamento econômico brasileiro.', color: '#24764f', icon: 'economy', certificateTitle: 'Certificado de Economia', tracks: economyTracks },
];
