export type Question = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Task = {
  sequential?: boolean;
  id: string;
  title: string;
  explanation: string;
  summary: string;
  deepContent: string;
  keyConcepts: string[];
  examples: string[];
  questions: Question[];
};

export type World = {
  prerequisiteWorldIds?: string[];
  id: string;
  name: string;
  number: string;
  subtitle: string;
  description: string;
  tasks: Task[];
};

export const worlds: World[] = [
  {
    id: "mundo-1",
    name: "Fundamentos",
    number: "1",
    subtitle: "Fundamentos",
    description: "Base conceitual para entender política, poder, justiça e ideologias.",
    tasks: [
      {
        id: "m1-t1",
        title: "O que é política?",
        explanation: "A política organiza decisões coletivas em sociedades marcadas por conflitos, interesses e recursos limitados.",
        summary: "Política envolve decisões compartilhadas, poder, regras e conflitos sobre o bem comum.",
        deepContent: "Em qualquer grupo humano, existem diferenças de interesse, valores e recursos. A política surge quando esses conflitos precisam ser resolvidos por normas, instituições e decisões coletivas. Não se restringe apenas a eleições ou partidos, mas também aparece em escolas, empresas, comunidades e Estado.",
        keyConcepts: ["Decisões coletivas", "Conflito de interesses", "Poder e regras", "Estado e sociedade"],
        examples: ["A aprovação de uma lei sobre impostos", "Um conselho escolar definindo regras", "Uma comunidade decidindo sobre recursos públicos"],
        questions: [
          {
            prompt: "Qual definição melhor descreve política?",
            options: ["Apenas eleições e partidos", "A organização das relações de poder e das decisões coletivas", "Somente a administração financeira do Estado", "Qualquer discussão entre pessoas"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Política envolve a organização de decisões coletivas e as relações de poder que orientam a convivência social. Política não é apenas eleições ou partidos, embora esses sejam elementos importantes de algumas formas de organização política."
          },
          {
            prompt: "A política existe principalmente porque:",
            options: ["Sociedades precisam tomar decisões sobre interesses e recursos coletivos", "Todos possuem os mesmos interesses", "O Estado precisa necessariamente controlar a economia", "Existem partidos políticos"],
            correctIndex: 0,
            explanation: "Resposta correta: A. As sociedades precisam organizar conflitos e escolhas sobre recursos, regras, valores e bem comum. Isso cria a necessidade de decisões coletivas e de mecanismos de poder e autoridade."
          },
          {
            prompt: "Qual situação é um exemplo de decisão política?",
            options: ["Escolher uma música para ouvir sozinho", "Decidir qual roupa comprar", "O Congresso aprovar uma lei sobre impostos", "Escolher o jantar em casa"],
            correctIndex: 2,
            explanation: "Resposta correta: C. A aprovação de uma lei sobre impostos envolve escolhas coletivas, regras públicas e impactos sobre a sociedade. É um exemplo clássico de decisão política."
          }
        ]
      },
      {
        id: "m1-t2",
        title: "Poder, autoridade e legitimidade",
        explanation: "Poder é capacidade de influenciar decisões; autoridade é poder reconhecido como válido; legitimidade explica a aceitação social daquele poder.",
        summary: "Poder e autoridade são diferentes: o primeiro é a capacidade de agir, o segundo é a validade reconhecida do poder.",
        deepContent: "Poder não se reduz à violência, embora possa usar coerção. Ele também aparece na capacidade de atrair, persuadir, organizar e decidir. Autoridade, por sua vez, é um tipo de poder que é visto como legítimo de acordo com normas, tradição ou consenso. Legitimidade indica a capacidade de o poder ser aceito como válido e não apenas imposto por força.",
        keyConcepts: ["Poder", "Autoridade", "Legitimidade", "Obediência"],
        examples: ["Um professor orientando a turma", "Um juiz aplicando a lei", "Um governo sendo aceito por sua tradição e constitucionalidade"],
        questions: [
          {
            prompt: "Em política, poder pode ser entendido como:",
            options: ["Apenas o uso da violência", "A capacidade de influenciar comportamentos ou decisões", "O direito de ocupar um cargo público", "A riqueza acumulada por uma pessoa"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Poder é a capacidade de influenciar comportamentos, instituições e decisões. Ele pode ser exercido de várias formas, não apenas por força física."
          },
          {
            prompt: "Qual é a principal diferença entre poder e autoridade?",
            options: ["Não existe diferença", "Autoridade é um poder reconhecido como válido ou legítimo", "Poder sempre depende de eleições", "Autoridade só existe em democracias"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Autoridade é um tipo de poder considerado legítimo por normas, regras ou crenças. Poder bruto e autoridade não são a mesma coisa."
          },
          {
            prompt: "Um governo possui legitimidade quando:",
            options: ["Possui o maior exército possível", "Não possui oposição", "Seu direito de governar é reconhecido como válido segundo determinadas normas ou crenças", "Controla todas as empresas do país"],
            correctIndex: 2,
            explanation: "Resposta correta: C. Legitimidade está ligada ao reconhecimento social e jurídico do direito de governar, conforme normas, valores e instituições. Não depende de força absoluta."
          }
        ]
      },
      {
        id: "m1-t3",
        title: "De Sócrates a Rawls",
        explanation: "A filosofia política investiga como viver em sociedade de forma justa, quem deve governar e quais princípios orientam a ordem política.",
        summary: "A tradição filosófica analisa justiça, liberdade, autoridade e a forma adequada de organizar a vida coletiva.",
        deepContent: "Platão associava a política à busca do bem comum e pensava que os filósofos, por sua capacidade de conhecer o justo, estariam mais preparados para governar. Aristóteles viu o ser humano como animal político e estudou as formas de governo. Rawls, por sua vez, propõe a justiça como equidade a partir do véu da ignorância, imaginando que as regras seriam escolhidas sem conhecer a própria posição social.",
        keyConcepts: ["Justiça", "Cidadania", "Contrato social", "Véu da ignorância"],
        examples: ["Platão e a cidade ideal", "Aristóteles e a vida em comunidade", "Rawls e a escolha dos princípios sem saber a posição social"],
        questions: [
          {
            prompt: "Para Platão, quem estaria mais preparado para governar sua cidade ideal?",
            options: ["Comerciantes", "Filósofos", "Militares", "Proprietários de terras"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Platão defendia que os filósofos, por conhecerem o bem e a justiça, estariam melhor preparados para governar a cidade ideal."
          },
          {
            prompt: "Aristóteles considerava o ser humano um:",
            options: ["Ser naturalmente apolítico", "Animal político", "Indivíduo incapaz de viver em sociedade", "Ser exclusivamente econômico"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Aristóteles entendia que o ser humano é essencialmente político: vive em comunidade, participa da vida pública e constrói a cidade."
          },
          {
            prompt: "No experimento do “véu da ignorância” de John Rawls, as pessoas escolheriam princípios de justiça sem saber:",
            options: ["Quais leis existem", "Como funciona uma democracia", "Qual posição ocuparão na sociedade", "O que significa liberdade"],
            correctIndex: 2,
            explanation: "Resposta correta: C. O véu da ignorância obriga as pessoas a escolherem princípios gerais sem saber em que posição social estarão, buscando uma justiça mais imparcial e equitativa."
          }
        ]
      },
      {
        id: "m1-t4",
        title: "Maquiavel: política sem maquiagem",
        explanation: "Maquiavel analisa a política como ela funciona na prática, sem reduzir o estudo do poder à pureza moral ou à idealização das instituições.",
        summary: "A obra de Maquiavel ajuda a entender conflitos, estratégia e poder com atenção ao real e não apenas ao ideal.",
        deepContent: "Maquiavel distinguiu entre a moral dos indivíduos e a exigência de governar em contextos de conflito, risco e instabilidade. Seu conceito de virtù refere-se à capacidade de agir com inteligência política diante das circunstâncias. Fortuna representa fatores externos, imprevisíveis e parcialmente fora do controle humano, como oportunidades, crises e pressões históricas.",
        keyConcepts: ["Realismo político", "Virtù", "Fortuna", "Conflito e poder"],
        examples: ["Um governante improvisando diante de uma crise", "A necessidade de alianças em tempos de instabilidade", "O papel de contingências históricas na política"],
        questions: [
          {
            prompt: "Uma característica importante do pensamento de Maquiavel é:",
            options: ["Analisar a política como ela funciona na prática", "Defender que governantes nunca utilizem força", "Rejeitar qualquer forma de Estado", "Considerar política e religião exatamente iguais"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Maquiavel enfatiza que a política deve ser analisada em suas condições reais, com atenção ao poder, ao conflito e às circunstâncias históricas."
          },
          {
            prompt: "O conceito de virtù em Maquiavel está relacionado principalmente à:",
            options: ["Bondade religiosa do governante", "Capacidade política de agir diante das circunstâncias", "Obediência absoluta às tradições", "Distribuição igualitária da riqueza"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Virtù representa a capacidade de agir estrategicamente e efetivamente em contextos políticos complexos e adversos."
          },
          {
            prompt: "Em Maquiavel, fortuna representa principalmente:",
            options: ["Dinheiro público", "Apoio popular", "Circunstâncias, acaso e fatores que escapam parcialmente ao controle humano", "Poder militar"],
            correctIndex: 2,
            explanation: "Resposta correta: C. Fortuna designa elementos fora do controle direto do governante, como contingências históricas, riscos e oportunidades que influenciam a política."
          }
        ]
      },
      {
        id: "m1-t5",
        title: "Liberalismos",
        explanation: "O liberalismo se refere a uma família de ideias que valoriza liberdade individual, direitos e limites ao poder arbitrário.",
        summary: "Liberalismos, no plural, compreendem correntes diversas sobre Estado, mercado e justiça social.",
        deepContent: "O liberalismo clássico enfatiza direitos individuais, mercado e limitação do Estado. Já o liberalismo social ou contemporâneo pode aceitar mais intervenção pública para ampliar oportunidades e reduzir desigualdades. A ideia central é que a liberdade deve ser protegida e o poder deve ter limites, mas os detalhes sobre como isso se concretiza variam bastante entre correntes.",
        keyConcepts: ["Liberdade individual", "Direitos", "Limitação do poder", "Estados e mercado"],
        examples: ["Proteção à liberdade de expressão", "Direitos de propriedade e contrato", "Políticas de educação e assistência social"],
        questions: [
          {
            prompt: "Qual princípio está historicamente associado ao liberalismo?",
            options: ["Limitação do poder estatal", "Poder absoluto do monarca", "Partido único", "Fim da propriedade privada em todas as suas formas"],
            correctIndex: 0,
            explanation: "Resposta correta: A. O liberalismo se associa à limitação do poder estatal e à proteção de direitos e liberdades individuais contra abusos de autoridade."
          },
          {
            prompt: "John Locke defendia direitos naturais, entre eles:",
            options: ["Vida, liberdade e propriedade", "Guerra, território e religião", "Igualdade econômica absoluta", "Obediência irrestrita ao governante"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Locke destacou direitos naturais como vida, liberdade e propriedade, oferecendo base para a crítica ao poder absoluto e para a defesa de limites constitucionais."
          },
          {
            prompt: "Por que é mais correto falar em “liberalismos” no plural?",
            options: ["Porque o liberalismo não possui princípios identificáveis", "Porque existem diferentes correntes liberais, com divergências sobre Estado, economia e justiça social", "Porque cada país possui obrigatoriamente uma ideologia liberal própria", "Porque liberalismo significa qualquer sistema democrático"],
            correctIndex: 1,
            explanation: "Resposta correta: B. O liberalismo não é uma única corrente homogênea; há divergências sobre o papel do Estado, a economia e como conciliar liberdade e igualdade."
          }
        ]
      },
      {
        id: "m1-t6",
        title: "Socialismo, conservadorismo e além",
        explanation: "As ideologias políticas não são blocos rígidos: elas reunem diferentes correntes, valores e respostas a desigualdades, autoridade e mudança social.",
        summary: "A diversidade política inclui liberalismos, socialismos, conservadorismos, anarquismos, nacionalismos e outras tradições.",
        deepContent: "Historicamente, correntes socialistas dão grande atenção à desigualdade econômica, à concentração de propriedade e à organização coletiva. O conservadorismo clássico, como o de Edmund Burke, valoriza tradições, instituições e mudanças graduais. O estudo da política exige atenção aos contextos históricos e às divergências internas das correntes, em vez de reduzir tudo a falsos rótulos.",
        keyConcepts: ["Desigualdade", "Tradição", "Instituições", "Diversidade ideológica"],
        examples: ["Debates sobre propriedade e mercado", "Mudanças graduais em instituições", "Conflitos entre diferentes visões de justiça e ordem"],
        questions: [
          {
            prompt: "Historicamente, correntes socialistas dão especial importância à discussão sobre:",
            options: ["Desigualdade econômica e relações de propriedade", "Retorno das monarquias absolutistas", "Extinção de qualquer organização coletiva", "Superioridade do poder religioso sobre qualquer Estado"],
            correctIndex: 0,
            explanation: "Resposta correta: A. O socialismo costuma enfatizar desigualdades econômicas, concentração de poder e propriedade e a necessidade de organizar a vida econômica de forma mais igualitária."
          },
          {
            prompt: "O conservadorismo clássico, associado a pensadores como Edmund Burke, tende a valorizar:",
            options: ["Mudanças revolucionárias permanentes", "Tradições, instituições e mudanças graduais", "Eliminação imediata das instituições existentes", "Ausência completa de autoridade"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Burke e o conservadorismo clássico defendem prudência, estabilidade e respeito às instituições, favoráveis a mudanças lentas e graduais."
          },
          {
            prompt: "Qual alternativa apresenta corretamente a diversidade ideológica?",
            options: ["Toda posição política pertence exclusivamente ao liberalismo ou socialismo", "Todas as ideologias defendem os mesmos objetivos", "Existem diversas tradições, como liberalismo, socialismo, conservadorismo, anarquismo, nacionalismo e outras", "Ideologias políticas deixaram de existir nas democracias modernas"],
            correctIndex: 2,
            explanation: "Resposta correta: C. O campo político é plural e inclui várias tradições ideológicas, cada uma com interpretações diferentes sobre liberdade, igualdade, autoridade e justiça."
          }
        ]
      }
    ]
  },
  {
    id: "mundo-2",
    name: "Estado, Democracia e Instituições",
    number: "2",
    subtitle: "Estado, Democracia e Instituições",
    description: "Como o Estado, as eleições e as instituições moldam a forma de decisão coletiva.",
    tasks: [
      {
        id: "m2-t1",
        title: "Estado moderno e capacidade estatal",
        explanation: "O Estado moderno reúne território, população, autoridade e instituições que exigem cumprimento de leis e execução de políticas.",
        summary: "Capacidade estatal refere-se à habilidade de o Estado implementar decisões e cumprir suas funções de forma efetiva.",
        deepContent: "O Estado moderno diferencia-se por sua organização burocrática, presença permanente, território delimitado e autoridade sobre a população. A capacidade estatal envolve a habilidade de cobrar impostos, produzir normas, executar políticas públicas, controlar a coercitividade legítima e manter o funcionamento das instituições. Quando essa capacidade é baixa, o Estado tende a ter dificuldades para aplicar leis, prestar serviços e cumprir decisões de governo.",
        keyConcepts: ["Território", "Soberania", "Capacidade estatal", "Instituições"],
        examples: ["A arrecadação de tributos", "A execução de políticas públicas", "A aplicação de decisões judiciais"],
        questions: [
          {
            prompt: "O que caracteriza o Estado moderno?",
            options: ["Apenas a existência de um governante", "Uma organização política com instituições, território, população e autoridade sobre esse território", "A ausência de leis permanentes", "A existência obrigatória de uma democracia"],
            correctIndex: 1,
            explanation: "Resposta correta: B. O Estado moderno combina território, população, instituições e autoridade sobre esse território, formando um sistema de poder político organizado."
          },
          {
            prompt: "O conceito de capacidade estatal refere-se principalmente à capacidade do Estado de:",
            options: ["Eliminar empresas privadas", "Criar partidos políticos", "Implementar políticas, arrecadar recursos e fazer cumprir suas decisões", "Impedir qualquer oposição política"],
            correctIndex: 2,
            explanation: "Resposta correta: C. A capacidade estatal está ligada à efetividade do Estado em arrecadar, executar, regular e tornar as políticas públicas concretas."
          },
          {
            prompt: "Um Estado com baixa capacidade estatal provavelmente enfrentaria maior dificuldade para:",
            options: ["Criar símbolos nacionais", "Cobrar impostos, oferecer serviços públicos e aplicar suas leis", "Possuir diferentes opiniões políticas", "Realizar debates no Parlamento"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Estados com baixa capacidade estatal tendem a ter dificuldades concretas na arrecadação, execução de políticas e aplicação da lei."
          }
        ]
      },
      {
        id: "m2-t2",
        title: "Democracia, autoritarismo e regimes híbridos",
        explanation: "Existem diferentes regimes políticos e critérios para distinguir democracia de autoritarismo ou regimes mistos.",
        summary: "Democracia exige competição, participação e regras de alternância; autoritarismo restringe a competição e a liberdade política.",
        deepContent: "A democracia representativa envolve eleições competitivas, alternância no poder e direitos políticos. Já regimes autoritários tendem a limitar a competição e as liberdades, concentrando poder. Regimes híbridos combinam elementos democráticos, como eleições, com práticas autoritárias, como restrições à oposição ou enfraquecimento das instituições.",
        keyConcepts: ["Democracia", "Autoritarismo", "Regime híbrido", "Alternância"],
        examples: ["Eleições competitivas em democracia", "Controle da mídia em regimes autoritários", "Eleições com desigualdade de condições entre candidatos"],
        questions: [
          {
            prompt: "Uma característica fundamental de uma democracia representativa é:",
            options: ["Ausência de oposição", "Eleições competitivas e possibilidade de alternância no poder", "Governo permanente do mesmo partido", "Controle militar das instituições"],
            correctIndex: 1,
            explanation: "Resposta correta: B. A democracia representativa depende de eleições competitivas, participação e possibilidade real de alternância do poder."
          },
          {
            prompt: "Um regime autoritário geralmente apresenta:",
            options: ["Forte limitação da competição política e das liberdades políticas", "Separação absoluta entre sociedade e Estado", "Eleições necessariamente livres e competitivas", "Alternância obrigatória de poder"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Autoritarismo caracteriza-se por limitar a competição, a oposição e as liberdades políticas, concentrando poder em poucas mãos."
          },
          {
            prompt: "O que é um regime híbrido?",
            options: ["Um sistema sem governo", "Uma democracia direta", "Um regime que combina instituições democráticas, como eleições, com práticas autoritárias", "Uma monarquia sem instituições políticas"],
            correctIndex: 2,
            explanation: "Resposta correta: C. Regimes híbridos misturam elementos democráticos com práticas autoritárias, como manipulação de regras, repressão ou assimetria no processo eleitoral."
          }
        ]
      },
      {
        id: "m2-t3",
        title: "Eleições e sistemas eleitorais",
        explanation: "Eleições são mecanismos centrais para a representação política, mas o desenho do sistema eleitoral influencia o tipo de representação e a governabilidade.",
        summary: "As regras eleitorais definem como votos se convertem em mandatos e como a competição política se organiza.",
        deepContent: "Em sistemas majoritários, vence quem atinge a maioria definida pelas regras. Em sistemas proporcionais, busca-se aproximar o número de cadeiras da distribuição dos votos entre os partidos ou candidaturas. A forma do sistema eleitoral influencia a fragmentação partidária, a concentração do poder e a representação de minorias.",
        keyConcepts: ["Eleições", "Representação", "Sistema majoritário", "Sistema proporcional"],
        examples: ["Eleição de prefeito por maioria simples", "Disputas legislativas por cálculo proporcional", "Efeito das regras na fragmentação partidária"],
        questions: [
          {
            prompt: "Qual é uma função fundamental das eleições democráticas?",
            options: ["Eliminar conflitos políticos", "Permitir que cidadãos escolham representantes e governantes", "Impedir a existência de oposição", "Garantir que um partido permaneça no poder"],
            correctIndex: 1,
            explanation: "Resposta correta: B. As eleições permitem que os cidadãos escolham seus representantes e governantes, tornando a política mais responsável e legitimada."
          },
          {
            prompt: "Em um sistema eleitoral majoritário, normalmente vence:",
            options: ["O candidato ou chapa que alcança o critério de maioria definido pelas regras da eleição", "O partido com mais filiados", "O candidato mais velho", "Todos os candidatos proporcionalmente"],
            correctIndex: 0,
            explanation: "Resposta correta: A. No sistema majoritário, o critério essencial é a vitória pela maioria definida pela regra eleitoral, que pode ser simples ou absoluta."
          },
          {
            prompt: "Em sistemas proporcionais, busca-se principalmente:",
            options: ["Dar todas as cadeiras ao partido vencedor", "Distribuir cadeiras de acordo com a proporção de votos, conforme as regras do sistema", "Eliminar os partidos menores", "Fazer todos os candidatos receberem o mesmo número de votos"],
            correctIndex: 1,
            explanation: "Resposta correta: B. O sistema proporcional procura refletir, na medida do possível, a distribuição dos votos entre os partidos e candidaturas."
          }
        ]
      },
      {
        id: "m2-t4",
        title: "Polarização e erosão democrática",
        explanation: "A polarização extrema e a erosão das normas democráticas enfraquecem a capacidade de negociação, cooperação e controle institucional.",
        summary: "Polarização e erosão democrática são fenômenos distintos, mas frequentemente se reforçam mutuamente.",
        deepContent: "Polarização ocorre quando grupos políticos se distanciam cada vez mais em identidades, valores e posições. Erosão democrática é o enfraquecimento gradual de normas, instituições e mecanismos de accountability. Ela pode emergir de atos de governos eleitos, manipulação de regras, ataques à oposição e enfraquecimento do sistema de freios e contrapesos.",
        keyConcepts: ["Polarização", "Instituições", "Erosão democrática", "Controles"],
        examples: ["Relações de hostilidade entre grupos políticos", "Ataques à imprensa e ao Judiciário", "Ameaças à independência dos órgãos de controle"],
        questions: [
          {
            prompt: "Em política, polarização ocorre quando:",
            options: ["Grupos políticos se tornam mais distantes e divididos entre posições ou identidades concorrentes", "Todos os partidos defendem exatamente as mesmas propostas", "As eleições deixam de existir automaticamente", "O Poder Judiciário assume o Executivo"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Polarização designa o aumento da distância entre grupos políticos e a intensificação de conflitos em torno de identidades, valores e posicionamentos."
          },
          {
            prompt: "O que significa erosão democrática?",
            options: ["O fim imediato de uma democracia por golpe militar", "O enfraquecimento gradual de instituições, normas e garantias democráticas", "A realização frequente de eleições", "O crescimento econômico de uma democracia"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Erosão democrática é um processo gradual e muitas vezes silencioso de enfraquecimento das instituições e dos compromissos democráticos."
          },
          {
            prompt: "Qual situação pode representar um sinal de erosão democrática?",
            options: ["Existência de oposição política legítima", "Realização de debates públicos", "Enfraquecimento sistemático dos mecanismos de controle e das instituições democráticas", "Existência de diferentes partidos"],
            correctIndex: 2,
            explanation: "Resposta correta: C. Quando mecanismos de controle e instituições democráticas são enfraquecidos progressivamente, isso sinaliza a erosão de um regime democrático."
          }
        ]
      },
      {
        id: "m2-t5",
        title: "Constituição e separação dos poderes",
        explanation: "A Constituição organiza o Estado, estabelece direitos e cria limites ao poder. A separação dos poderes evita a concentração excessiva de autoridade.",
        summary: "Constituições e separação de poderes são instrumentos básicos de limitação e controle do poder estatal.",
        deepContent: "A Constituição define regras fundamentais do Estado e dos direitos. A separação entre Executivo, Legislativo e Judiciário busca distribuir funções e impedir a concentração de poder. O sistema de freios e contrapesos permite que cada poder controle e limite o exercício dos demais, respeitando o marco constitucional.",
        keyConcepts: ["Constituição", "Separação de poderes", "Freios e contrapesos", "Limites do poder"],
        examples: ["Leis funcionais", "Controle do Legislativo pelo Judiciário", "Veto e fiscalização do Executivo"],
        questions: [
          {
            prompt: "Qual é uma das principais funções de uma Constituição?",
            options: ["Organizar juridicamente o Estado e estabelecer direitos, competências e limites ao poder", "Determinar quem deve vencer as eleições", "Eliminar conflitos entre cidadãos", "Substituir todas as demais leis diariamente"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Uma Constituição organiza o Estado, delimita competências, reconhece direitos e estabelece limites ao exercício do poder."
          },
          {
            prompt: "A separação entre Executivo, Legislativo e Judiciário busca principalmente:",
            options: ["Concentrar poder", "Impedir qualquer cooperação entre instituições", "Distribuir funções e criar mecanismos de limitação e controle do poder", "Tornar o Legislativo superior aos demais poderes"],
            correctIndex: 2,
            explanation: "Resposta correta: C. A separação de poderes tem como objetivo distribuir atribuições e reduzir o risco de concentração de autoridade, criando mecanismos de controle recíproco."
          },
          {
            prompt: "O sistema de freios e contrapesos significa que:",
            options: ["Cada poder pode exercer determinados controles sobre os demais dentro das regras constitucionais", "Nenhum poder pode interferir juridicamente em outro", "O Judiciário controla permanentemente todos os outros poderes", "O Executivo pode extinguir os outros poderes"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Freios e contrapesos mostram que os poderes podem se limitar e fiscalizar uns aos outros dentro dos limites constitucionais."
          }
        ]
      },
      {
        id: "m2-t6",
        title: "Controle judicial e impeachment",
        explanation: "Os mecanismos de controle Constitucional e de responsabilização política são fundamentais para que governos e instituições respondam aos limites legais.",
        summary: "A democracia exige mecanismos de fiscalização e responsabilização, tanto jurídico quanto político.",
        deepContent: "O controle de constitucionalidade permite verificar se leis e atos estariam de acordo com a Constituição. Já o impeachment é um mecanismo de responsabilização jurídica e política de agentes públicos em situações previstas constitucionalmente. Esses instrumentos ajudam a preservar a ordem constitucional e a impedir abusos de poder.",
        keyConcepts: ["Controle de constitucionalidade", "Impeachment", "Responsabilização", "Constituição"],
        examples: ["Lei questionada judicialmente", "Processo de impeachment do presidente", "Fiscais do Executivo e do Legislativo"],
        questions: [
          {
            prompt: "O controle de constitucionalidade permite verificar se:",
            options: ["Uma lei ou ato é compatível com a Constituição", "Um candidato possui chances de vencer uma eleição", "Uma política pública é popular", "Um partido deveria participar de uma eleição"],
            correctIndex: 0,
            explanation: "Resposta correta: A. O controle de constitucionalidade pergunta se a lei ou ato está em conformidade com a Constituição, guardando a hierarquia das normas."
          },
          {
            prompt: "No Brasil, o impeachment do presidente da República é:",
            options: ["Uma eleição extraordinária", "Um mecanismo constitucional de responsabilização por crime de responsabilidade, seguindo procedimento previsto na Constituição e na legislação", "Uma decisão exclusiva do STF", "Uma forma de dissolver o Congresso Nacional"],
            correctIndex: 1,
            explanation: "Resposta correta: B. O impeachment é um instrumento constitucional de responsabilização, com regras específicas para afastar e julgar o presidente em caso de crime de responsabilidade."
          },
          {
            prompt: "Qual é uma diferença importante entre impeachment e eleição?",
            options: ["Não existe diferença", "Impeachment é um mecanismo de responsabilização; eleição é um processo de escolha de representantes ou governantes", "Ambos dependem exclusivamente do Judiciário", "Ambos acontecem obrigatoriamente a cada quatro anos"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Impeachment e eleição cumprem funções diferentes: a eleição escolhe o governante; o impeachment processa e responsabiliza um poder público em circunstâncias previstas pela Constituição."
          }
        ]
      }
    ]
  },
  {
    id: "mundo-3",
    name: "Política Brasileira, Economia e Poder",
    number: "3",
    subtitle: "Política Brasileira, Economia e Poder",
    description: "Aplicação dos conceitos à Constituição, ao presidencialismo, à economia e às instituições de controle.",
    tasks: [
      {
        id: "m3-t1",
        title: "A Constituição de 1988",
        explanation: "A Constituição brasileira de 1988 reorganizou a democracia após o período autoritário e definiu limites, direitos e competências públicas.",
        summary: "A Constituição de 1988 é um marco institucional sólido, mas sujeito a reformas dentro de procedimentos determinados.",
        deepContent: "A Constituição de 1988 ampliou direitos fundamentais, estruturou a federação e organizou os poderes. Ela estabelece que o poder político não é ilimitado: mesmo governos eleitos estão submetidos aos limites constitucionais. Quando direitos fundamentais entram em tensão, a análise exige ponderação e regras de proporcionalidade e compatibilidade com a Constituição.",
        keyConcepts: ["Constituição”, “Direitos fundamentais”, “Limites constitucionais”, “Ponderação"],
        examples: ["Direitos de liberdade e igualdade", "Reformas constitucionais", "Conflito entre liberdade de expressão e outros direitos"],
        questions: [
          {
            prompt: "Um governo possui amplo apoio popular e maioria no Congresso, mas propõe restringir um direito protegido constitucionalmente. Qual princípio é mais relevante para analisar o caso?",
            options: ["A maioria parlamentar pode modificar qualquer regra constitucional sem sofrer limitações", "A legitimidade obtida nas eleições dispensa o governo do controle constitucional", "Mesmo governos eleitos estão submetidos aos limites estabelecidos pela Constituição", "A proteção dos direitos constitucionais depende exclusivamente da popularidade da medida"],
            correctIndex: 2,
            explanation: "Resposta correta: C. A legitimidade eleitoral não autoriza a eliminação de direitos fundamentais; o poder público continua submetido aos limites constitucionais."
          },
          {
            prompt: "No debate político brasileiro, grupos frequentemente defendem mudanças na Constituição. Isso demonstra que a Constituição de 1988:",
            options: ["Permanece imutável desde sua promulgação, mesmo quando mudanças recebem amplo apoio da população e do Congresso", "Pode ser modificada por procedimentos específicos, embora existam limitações constitucionais ao poder de reforma", "Pode ser alterada diretamente pelo presidente, mediante decisão própria, sem aprovação de emendas pelo Congresso Nacional", "Somente pode ser modificada mediante referendo popular, sendo insuficiente a aprovação de emendas pelo Congresso Nacional"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Constituições são normas jurídicas que podem ser alteradas, mas apenas por meio de processos e limites estabelecidos no próprio texto constitucional."
          },
          {
            prompt: "Quando liberdade de expressão e proteção de outros direitos fundamentais entram em tensão, qual interpretação é mais adequada?",
            options: ["Direitos fundamentais devem ser exercidos sem limites, mesmo quando entram em conflito", "A liberdade de expressão pode ser abolida por decisão do governo eleito", "Direitos fundamentais podem exigir ponderação e aplicação conforme os limites constitucionais", "O Executivo sempre detém a interpretação final sobre conflitos entre direitos fundamentais"],
            correctIndex: 2,
            explanation: "Resposta correta: C. Direitos fundamentais têm limites e podem exigir ponderação, sempre tomando como referência a norma constitucional e os princípios de proteção de outros direitos."
          }
        ]
      },
      {
        id: "m3-t2",
        title: "Presidencialismo de coalizão",
        explanation: "No Brasil, o Executivo e o Legislativo são eleitos separadamente, o que torna a negociação entre partidos central para a governabilidade.",
        summary: "O presidencialismo brasileiro exige coalizões e articulação parlamentária para viabilizar a agenda de governo.",
        deepContent: "Quando o presidente não controla a maioria do Congresso, seu governo precisa construir coalizões parlamentares para aprovar leis e orçamento. Isso pode aumentar e complicar as negociações, mas também é uma resposta do sistema à fragmentação partidária. Coalizões e negociações são parte da dinâmica do presidencialismo brasileiro.",
        keyConcepts: ["Coalizão", "Governabilidade", "Congresso", "Presidencialismo"],
        examples: ["Aprovação de projetos de lei", "Distribuição de ministérios e emendas", "Conflitos entre Executivo e Legislativo"],
        questions: [
          {
            prompt: "Um presidente é eleito com 52% dos votos, mas seu partido controla apenas 15% da Câmara. Para aprovar projetos, provavelmente precisará:",
            options: ["Ignorar o Congresso com base na votação popular", "Construir uma coalizão parlamentar com outros partidos", "Convocar novas eleições legislativas automaticamente após sua posse", "Delegar ao STF a aprovação dos projetos presidenciais"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Em um sistema multipartidário, sem maioria legislativa, o presidente depende de negociações e de alianças para obter apoio para sua agenda."
          },
          {
            prompt: "Críticos argumentam que grandes coalizões podem aumentar negociações por ministérios, emendas e influência política. Defensores respondem que coalizões:",
            options: ["São acordos necessariamente ilegais, pois a negociação entre partidos viola as regras democráticas", "Podem ser necessárias para produzir maiorias governativas em um sistema partidário fragmentado", "Eliminam os conflitos entre Executivo e Legislativo ao reunir partidos na base governista", "Dispensam a realização de eleições, pois os partidos já negociaram a composição governamental"],
            correctIndex: 1,
            explanation: "Resposta correta: B. As coalizões podem facilitar o funcionamento do governo em sistemas fragmentados e contribuírem para a governabilidade das maiorias."
          },
          {
            prompt: "Um Congresso muito fragmentado tende a tornar a governabilidade presidencial:",
            options: ["Inviável em qualquer circunstância, independentemente das alianças que sejam negociadas", "Independente do apoio partidário para aprovar a agenda do governo", "Mais dependente de negociação e formação de maiorias parlamentares", "Subordinada exclusivamente ao Judiciário, responsável por garantir a agenda presidencial"],
            correctIndex: 2,
            explanation: "Resposta correta: C. Quando o Congresso se fragmenta, a governabilidade exige maior articulação e acordo entre partidos para viabilizar decisões e políticas públicas."
          }
        ]
      },
      {
        id: "m3-t3",
        title: "Estado, mercado e impostos",
        explanation: "A economia política estuda como recursos, regras, impostos e o papel do Estado afetam a distribuição e a produção social.",
        summary: "A discussão sobre Estado e mercado envolve escolhas sobre arrecadação, regulação, justiça distributiva e eficiência econômica.",
        deepContent: "A tributação e a atuação estatal são temas centrais da economia política: como arrecadar recursos, financiar serviços públicos e definir quem deve suportar mais ou menos custos. Situações envolvendo impostos, subsídios, regulação e investimentos públicos abrem debates sobre redistribuição, eficiência econômica e justiça distributiva. Os conflitos são estruturados pela ideia de que o Estado e o mercado têm funções diferentes e complementares.",
        keyConcepts: ["Tributação", "Redistribuição", "Estado", "Mercado"],
        examples: ["Aumento de impostos sobre rendas altas", "Políticas públicas de educação e saúde", "Impostos e investimentos públicos"],
        questions: [
          {
            prompt: "Um governo decide aumentar impostos sobre rendas mais altas para financiar políticas sociais. O principal debate político-econômico envolvido é:",
            options: ["Democracia versus autoritarismo como único eixo explicativo", "Redistribuição, eficiência econômica e justiça tributária", "Separação de competências entre Executivo e Judiciário", "Sistemas eleitorais e regras de escolha parlamentar"],
            correctIndex: 1,
            explanation: "Resposta correta: B. A tributação implica escolhas sobre redistribuição, impacto econômico e critérios de justiça, sendo uma questão central da economia política."
          },
          {
            prompt: "Um político afirma que “reduzir impostos sempre aumenta a arrecadação”. Qual análise é mais adequada?",
            options: ["A afirmação é verdadeira em qualquer contexto, pois toda redução de impostos gera necessariamente um aumento da receita pública", "A afirmação é falsa em qualquer contexto, pois nenhuma redução de impostos pode ser acompanhada por aumento da arrecadação", "O resultado depende, entre outros fatores, das alíquotas existentes e da resposta da atividade econômica e dos contribuintes", "O valor dos impostos não tem relação com a arrecadação, pois a receita pública independe da cobrança de tributos"],
            correctIndex: 2,
            explanation: "Resposta correta: C. A relação entre tributos e arrecadação depende de alíquotas, comportamento econômico e efeitos sobre a produção, os preços e a base tributária."
          },
          {
            prompt: "Dois grupos defendem respectivamente maior participação estatal e maior participação do mercado na economia. Esse conflito envolve principalmente diferentes posições sobre:",
            options: ["Como recursos devem ser alocados e quais funções Estado e mercado devem desempenhar", "Se eleições deveriam continuar existindo como mecanismo de escolha dos representantes do poder público", "Quantos estados deveriam compor o território brasileiro e integrar a organização federativa do país", "Qual instituição deve interpretar a Constituição e resolver divergências sobre o significado do texto"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Esse conflito se refere a como os recursos devem ser alocados, qual papel cabe ao Estado e qual papel cabe ao mercado na economia."
          }
        ]
      },
      {
        id: "m3-t4",
        title: "Orçamento, déficit e política fiscal",
        explanation: "A política fiscal determina como o Estado reúne receitas e distribui gastos, afetando crescimento, inflação, dívida e justiça social.",
        summary: "Gastos públicos, receitas e déficit são decisões políticas com impactos de curto e longo prazo.",
        deepContent: "O orçamento público traduz prioridades do Estado. Quando há déficit, despesas superam receitas em um período. O aumento do déficit pode ser uma escolha deliberada para ampliar investimentos e estimular a economia em momentos de desaceleração, mas também pode gerar riscos de sustentabilidade fiscal e aumento da dívida pública. Por isso, o debate sobre gastos e déficit envolve trade-offs complexos.",
        keyConcepts: ["Déficit", "Dívida pública", "Política fiscal", "Orçamento"],
        examples: ["Investimentos em infraestrutura", "Gastos em políticas sociais", "Ajustes fiscais em momentos de crise"],
        questions: [
          {
            prompt: "Durante uma forte recessão, o governo aumenta temporariamente investimentos mesmo sabendo que isso pode ampliar o déficit. A principal justificativa econômica seria:",
            options: ["Estimular a atividade econômica durante a desaceleração", "Reduzir necessariamente a dívida pública já no presente", "Provocar uma queda automática da inflação durante a recessão", "Dispensar a arrecadação de impostos para financiar despesas"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Em recessão, maior gasto público pode aumentar demanda agregada e estimular a atividade econômica, mesmo que o déficit aumente temporariamente."
          },
          {
            prompt: "Um país mantém déficits elevados durante muitos anos. Qual preocupação pode surgir?",
            options: ["A dívida pública pode crescer e aumentar as restrições fiscais futuras", "O déficit desaparecerá por conta própria, mesmo sem mudanças nas contas públicas", "O país perderá automaticamente sua moeda por manter despesas superiores às receitas", "O Legislativo deixará de funcionar devido à duração dos déficits públicos"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Déficits persistentes podem aumentar a dívida pública e criar restrições futuras para investimentos e estabilidade fiscal."
          },
          {
            prompt: "Por que o debate entre aumentar gastos e controlar o déficit não possui uma resposta simples?",
            options: ["Porque o déficit é irrelevante para avaliar qualquer decisão sobre as contas públicas", "Porque as despesas públicas não produzem efeitos sobre o funcionamento da economia", "Porque existem trade-offs entre estímulo econômico, prioridades públicas e sustentabilidade fiscal", "Porque a definição do orçamento público compete exclusivamente aos bancos do país"],
            correctIndex: 2,
            explanation: "Resposta correta: C. Há conflitos entre estímulo econômico, objetivos públicos e manutenção da sustentabilidade fiscal. A resposta depende do contexto e das prioridades do governo."
          }
        ]
      },
      {
        id: "m3-t5",
        title: "Elites, pluralismo e lobby",
        explanation: "As decisões públicas são influenciadas por diferentes grupos sociais com recursos, organização e acesso ao poder.",
        summary: "A influência política varia entre grupos e depende de organização, recursos e regras institucionais.",
        deepContent: "Teorias elitistas e pluralistas oferecem perspectivas diferentes sobre quem influencia as decisões públicas. Enquanto o pluralismo destaca a competição entre grupos, a teoria elitista ressalta a concentração de recursos e a desigualdade de poder. O lobby é uma forma organizada de influência política, podendo ser legítimo ou problemático conforme as regras e a transparência.",
        keyConcepts: ["Pluralismo", "Elites", "Lobby", "Influência política"],
        examples: ["Empresas pressionando o Congresso", "Sindicalismo e mobilização", "ONGs e grupos de interesse em debates legislativos"],
        questions: [
          {
            prompt: "Grandes empresas, sindicatos, ONGs e associações pressionam o Congresso sobre uma nova legislação. Para uma interpretação pluralista, isso demonstra principalmente:",
            options: ["Competição entre diferentes grupos pela influência sobre decisões públicas", "Prática necessariamente corrupta de pressão organizada sobre os representantes eleitos", "Encerramento da representação democrática pela atuação de grupos de interesse", "Ausência de elites políticas demonstrada pela participação de diferentes organizações"],
            correctIndex: 0,
            explanation: "Resposta correta: A. O pluralismo vê a política como um campo em que diferentes grupos competem pela influência sobre decisões públicas."
          },
          {
            prompt: "Uma crítica das teorias elitistas ao pluralismo é que:",
            options: ["Todos os grupos dispõem dos mesmos recursos financeiros, organização e acesso às autoridades para influenciar decisões públicas", "Alguns grupos podem possuir muito mais dinheiro, organização, informação e acesso aos tomadores de decisão", "Os grupos econômicos permanecem sem influência política, mesmo quando possuem recursos financeiros e organização para defender interesses", "A influência sobre governos cabe somente aos eleitores individuais, sem participação de organizações ou grupos de interesse"],
            correctIndex: 1,
            explanation: "Resposta correta: B. A crítica elitista aponta que nem todos os grupos têm igualdade de recursos e acesso, o que afeta sua capacidade de influenciar decisões públicas."
          },
          {
            prompt: "Qual situação diferencia melhor lobby de corrupção?",
            options: ["Defender interesses perante autoridades e praticar corrupção são necessariamente a mesma atividade; ambas envolvem, por definição, uma atuação ilícita para obter vantagens", "Defender interesses perante autoridades pode ser uma atividade legítima; corrupção envolve práticas ilícitas ou abuso de poder para obter vantagens indevidas", "A atuação só constitui lobby quando envolve entrega ilegal de dinheiro às autoridades; sem esse pagamento, a defesa de interesses não recebe essa classificação", "A corrupção passa a ser permitida quando praticada por grupos de interesse organizados; a representação coletiva torna legítima a obtenção de vantagens indevidas"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Lobby é a atuação organizada para influenciar normas e políticas, enquanto corrupção envolve práticas ilícitas ou abuso de poder para obter vantagens indevidas."
          }
        ]
      },
      {
        id: "m3-t6",
        title: "Ação coletiva e free rider",
        explanation: "A ação coletiva enfrenta desafios quando os benefícios de uma decisão são compartilhados, mas os custos são distribuídos de forma desigual.",
        summary: "A organização política depende de mecanismos para superar o problema da ação coletiva e do free rider.",
        deepContent: "Quando muitos indivíduos se beneficiam de uma reforma ou decisão coletiva, alguns podem tentar aproveitar o benefício sem contribuir para sua construção. Esse fenômeno é chamado de free rider. Grupos menores e diretamente afetados tendem a se organizar mais facilmente do que grandes públicos dispersos, por isso o problema da ação coletiva é central em política.",
        keyConcepts: ["Free rider", "Ação coletiva", "Organização", "Benefícios coletivos"],
        examples: ["Movimentos sociais", "Sindicatos”, “Campanhas por reformas trabalhistas"],
        questions: [
          {
            prompt: "Milhões de cidadãos seriam beneficiados individualmente em pequena quantidade por determinada reforma, enquanto um pequeno grupo sofreria grandes perdas. Qual grupo tende a possuir maior facilidade para se organizar politicamente?",
            options: ["Os milhões de cidadãos necessariamente se organizam melhor, pois o maior número garante sua mobilização", "O grupo menor e mais diretamente afetado pode ter incentivos maiores para se organizar", "Nenhum dos grupos consegue se organizar politicamente, independentemente das diferenças entre seus custos e benefícios", "Apenas quem trabalha no serviço público consegue formar grupos para atuar na política"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Um grupo pequeno e diretamente afetado tende a ter mais incentivos para se organizar, pois o custo individual da ação coletiva é menor e o impacto direto é maior."
          },
          {
            prompt: "Todos os trabalhadores de determinado setor podem se beneficiar de uma conquista coletiva, inclusive aqueles que não participaram de sua obtenção. Isso pode gerar:",
            options: ["Processo de captura regulatória", "Judicialização das relações trabalhistas", "Problema do free rider", "Organização política pelo federalismo"],
            correctIndex: 2,
            explanation: "Resposta correta: C. O free rider surge quando alguém se beneficia de um resultado coletivo sem contribuir para sua obtenção ou manutenção."
          },
          {
            prompt: "Qual mecanismo pode ajudar grupos a superar problemas de ação coletiva?",
            options: ["Criar incentivos para participação e mecanismos de coordenação", "Ampliar indefinidamente o grupo como solução suficiente para organizá-lo", "Impedir a formação de qualquer liderança dentro do grupo", "Assegurar sempre os benefícios, independentemente da participação de cada integrante"],
            correctIndex: 0,
            explanation: "Resposta correta: A. A coordenação, os incentivos e a liderança ajudam grupos a superar dificuldades de organização e mobilização coletiva."
          }
        ]
      },
      {
        id: "m3-t7",
        title: "Corrupção, patrimonialismo e captura",
        explanation: "Quando o Estado é usado para beneficiar interesses privados ou redes pessoais, a governança e a integridade institucional se enfraquecem.",
        summary: "Corrupção, patrimonialismo e captura regulatória são fenômenos de usa indevido do poder público.",
        deepContent: "Corrupção envolve a utilização indevida de poder público para ganho privado. Patrimonialismo diz respeito à lógica em que o Estado é usado como extensão de interesses pessoais e familiares. Já a captura regulatória acontece quando agências ou órgãos responsáveis pela regulação passam a atender prioritariamente os interesses das empresas ou grupos regulados, em detrimento do interesse público.",
        keyConcepts: ["Corrupção", "Patrimonialismo", "Captura regulatória", "Governança"],
        examples: ["Favorecimento de empresas reguladas", "Distribuição de cargos por lealdade pessoal", "Uso indevido de recursos públicos"],
        questions: [
          {
            prompt: "Uma agência responsável por fiscalizar determinado setor começa sistematicamente a favorecer as empresas reguladas em vez do interesse público. Esse fenômeno é chamado de:",
            options: ["Organização federativa", "Captura regulatória", "Competição pluralista", "Intervenção judicial"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Captura regulatória ocorre quando atores regulados influenciam ou controlam a agência reguladora em benefício próprio, em vez do interesse público."
          },
          {
            prompt: "Um governante distribui cargos públicos principalmente com base em relações pessoais e utiliza estruturas estatais como extensão de seus interesses particulares. O conceito mais relacionado é:",
            options: ["Patrimonialismo", "Liberalismo político", "Federalismo fiscal", "Representação proporcional"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Patrimonialismo designa a lógica em que a administração pública é tratada como extensão privada da vontade pessoal do governante ou de grupos ligados a ele."
          },
          {
            prompt: "Por que simplesmente aumentar penas não necessariamente elimina a corrupção?",
            options: ["Porque a corrupção é impossível de combater, independentemente das medidas adotadas pelas instituições públicas", "Porque incentivos, probabilidade de detecção, transparência e qualidade institucional também influenciam o comportamento", "Porque as penas não integram as instituições e permanecem separadas das regras de funcionamento estatal", "Porque a corrupção ocorre somente em democracias, sendo ausente em todas as outras formas de governo"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Combater corrupção depende também de transparência, fiscalização, probabilidade de detecção e qualidade institucional, não apenas de sanções legais."
          }
        ]
      },
      {
        id: "m3-t8",
        title: "Accountability e instituições de controle",
        explanation: "A democracia depende de mecanismos que exijam prestação de contas e responsabilidade dos governantes e das instituições estatais.",
        summary: "Accountability exige transparência e controle para que a atuação do governo seja monitorada e responsabilizada.",
        deepContent: "Accountability refere-se à capacidade de governos, autoridades e instituições responderem por suas decisões. Ela depende de mecanismos como imprensa, Legislativo, tribunais de contas, judiciário e órgãos fiscalizadores. Quando esses mecanismos têm poder e também são submetidos a controle, a qualidade democrática se fortalece. Se uma instituição fiscalizadora se torna incontestável, há risco de concentração do poder sem accountability recíproca.",
        keyConcepts: ["Accountability", "Prestação de contas", "Instituições de controle", "Transparência"],
        examples: ["Auditoria de contas públicas", "Investigação da imprensa", "Fiscalização legislativa e judicial"],
        questions: [
          {
            prompt: "Imprensa, oposição, tribunais de contas, Legislativo e órgãos fiscalizadores investigam decisões de um governo. Isso representa diferentes mecanismos de:",
            options: ["Dominação autoritária", "Accountability", "Gestão patrimonialista", "Presidencialismo irrestrito"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Accountability reúne mecanismos de fiscalização, transparência e responsabilização por decisões públicas."
          },
          {
            prompt: "Existe um possível dilema quando instituições de controle recebem muito poder e pouca fiscalização sobre suas próprias decisões. Qual é ele?",
            options: ["Controladores também precisam estar sujeitos a mecanismos de accountability", "Instituições fiscalizadoras devem exercer poder ilimitado para garantir a fiscalização", "A fiscalização institucional impede a democracia de funcionar de modo adequado", "A fiscalização do Estado deve caber exclusivamente ao poder Executivo"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Mesmo instituições de controle precisam estar sujeitas a limites e mecanismos de fiscalização para evitar concentração de poder sem responsabilização."
          },
          {
            prompt: "Um governo eleito argumenta: “Recebemos milhões de votos, portanto instituições de controle não deveriam impedir nossas decisões.” Qual resposta melhor corresponde a uma democracia constitucional?",
            options: ["Correto, porque a vitória eleitoral concede ao governo poderes ilimitados para executar suas decisões", "Incorreto, porque legitimidade eleitoral convive com limites constitucionais e mecanismos de controle", "Correto, desde que o presidente disponha de maioria no Congresso para apoiar suas decisões", "Incorreto, porque cabe às instituições de controle assumir o governo no lugar dos eleitos"],
            correctIndex: 1,
            explanation: "Resposta correta: B. A legitimidade eleitoral é importante, mas não elimina limites constitucionais nem a necessidade de mecanismos de transparência e controle institucional."
          }
        ]
      }
    ]
  },
{
  "id": "mundo-4",
  "name": "MUNDO FLÁVIO BOLSONARO",
  "number": "4",
  "subtitle": "MUNDO FLÁVIO BOLSONARO",
  "description": "8 tópicos · 40 perguntas",
  "prerequisiteWorldIds": [
    "mundo-1",
    "mundo-2",
    "mundo-3"
  ],
  "tasks": [
    {
      "id": "m4-t1",
      "title": "Economia e Emprego",
      "summary": "Na área de economia e emprego, Flávio Bolsonaro propõe uma política voltada à **redução da burocracia, controle dos gastos públicos, flexibilização das relações de trabalho e incentivo à iniciativa privada**. Entre as medidas apresentadas estão o uso de inteligência artificial para acompanhar gastos públicos, a retomada de desestatizações e um “revogaço” de normas para facilitar a abertura e o funcionamento de empresas.\n\nNo mercado de trabalho, as propostas incluem permitir modalidades de **pagamento por hora**, reduzir gradualmente o custo da contratação sem retirar direitos e criar contratos específicos para jovens de 18 a 24 anos procurando o primeiro emprego e para pessoas com 50 anos ou mais que estejam desempregadas há pelo menos um ano.\n\nTambém propõe criar um **banco nacional de vagas conectado aos setores de RH das empresas**, o programa Minha Primeira Empresa e ampliar o uso de inteligência artificial por pequenos negócios. Na infraestrutura, prevê **R$ 900 bilhões em investimentos durante quatro anos** em rodovias, ferrovias, portos, aeroportos e hidrovias.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Como Flávio Bolsonaro pretende utilizar inteligência artificial na economia e na administração pública?",
          "options": [
            "Apenas para trocar o trabalho de servidores públicos por sistemas de IA",
            "Para controlar gastos públicos e ampliar o acesso de pequenas empresas à IA",
            "Exclusivamente para administrar o Pix e automatizar o funcionamento desse sistema de pagamentos",
            "Para determinar os salários dos trabalhadores por meio de cálculos realizados por IA"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que suas propostas preveem para facilitar a entrada de determinados grupos no mercado de trabalho?",
          "options": [
            "Criar contratos específicos para jovens no primeiro emprego e pessoas com 50 anos ou mais desempregadas há pelo menos 12 meses",
            "Eliminar os contratos formais de trabalho para pessoas com menos de 24 anos, permitindo que a contratação desse grupo dispense qualquer vínculo formal",
            "Criar postos de trabalho no serviço público para desempregados, tornando obrigatória a oferta de emprego estatal a quem estiver sem uma ocupação",
            "Proibir contratos de trabalho diferenciados por idade, exigindo que jovens e pessoas mais velhas sejam contratados sob as mesmas regras, sem distinção etária"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Qual é o objetivo do programa Minha Primeira Empresa?",
          "options": [
            "Oferecer financiamento exclusivamente a grandes empresas para suas atividades",
            "Converter empresas privadas em estatais sob administração do governo",
            "Reduzir a burocracia para abrir e formalizar um negócio",
            "Assegurar vagas no serviço público para quem inicia empreendimentos"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Qual medida está relacionada à infraestrutura?",
          "options": [
            "Investir R$ 900 bilhões em quatro anos em diferentes meios de transporte e logística",
            "Aplicar todos os recursos apenas em rodovias, sem investir nos demais meios de transporte",
            "Interromper os investimentos federais em aeroportos, suspendendo a aplicação de recursos da União nesse setor",
            "Tornar obrigatória a privatização de todas as ferrovias brasileiras, transferindo sua operação à iniciativa privada"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Em relação ao papel do Estado e às empresas, qual conjunto melhor representa as propostas apresentadas?",
          "options": [
            "Ampliar as regulamentações empresariais e expandir a presença de estatais",
            "Reduzir burocracia, retomar desestatizações e facilitar a atividade empresarial",
            "Suspender a abertura de empresas enquanto durar a reforma tributária",
            "Centralizar no governo federal a criação direta dos postos de trabalho"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        }
      ]
    },
    {
      "id": "m4-t2",
      "title": "Saúde",
      "summary": "Na área da saúde, Flávio Bolsonaro propõe o chamado **Plano Real da Saúde**, que pretende reformular aspectos do SUS, principalmente seu modelo de financiamento, além de buscar maior valorização dos profissionais de saúde.\n\nPara tentar reduzir filas e acelerar atendimentos, a proposta prevê **contratar serviços e exames da rede privada em horários ociosos**. Também pretende ampliar o uso de tecnologia por meio de um **prontuário eletrônico único**, reunindo informações de saúde dos pacientes, e de consultas por **teleatendimento**.\n\nOutra medida é a **entrega de medicamentos em domicílio** para idosos, pessoas com deficiência e pacientes com doenças crônicas, buscando facilitar o acesso contínuo aos tratamentos.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Qual é o principal objetivo do chamado Plano Real da Saúde?",
          "options": [
            "Encerrar o funcionamento do SUS e transferir seu atendimento integralmente à rede privada",
            "Reformular o SUS, incluindo seu financiamento, e valorizar os profissionais de saúde",
            "Entregar toda a saúde pública aos municípios, concentrando neles a responsabilidade pelo atendimento",
            "Eliminar os recursos federais da saúde, encerrando a participação financeira da União"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Como a proposta pretende utilizar a rede privada para ajudar no atendimento?",
          "options": [
            "Exigindo a contratação de planos de saúde por todos",
            "Transferindo todos os hospitais públicos para a iniciativa privada",
            "Contratando serviços e exames privados em horários ociosos",
            "Restringindo o atendimento da rede privada apenas aos idosos"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Para que serviria o prontuário eletrônico único?",
          "options": [
            "Para reunir eletronicamente as informações de saúde dos pacientes",
            "Para substituir as consultas médicas por atendimentos de inteligência artificial",
            "Para controlar os preços de venda dos medicamentos disponíveis",
            "Para cadastrar exclusivamente as pessoas atendidas por planos privados"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Qual grupo seria beneficiado pela proposta de entrega de medicamentos em domicílio?",
          "options": [
            "Exclusivamente os profissionais que trabalham nos serviços de saúde",
            "Somente os pacientes que permanecem internados em unidades hospitalares",
            "Todos os brasileiros, independentemente da idade ou condição de saúde",
            "Idosos, pessoas com deficiência e pessoas com doenças crônicas"
          ],
          "correctIndex": 3,
          "explanation": "Resposta correta: D"
        },
        {
          "prompt": "Qual medida pretende facilitar consultas sem exigir necessariamente o atendimento presencial?",
          "options": [
            "Prontuário impresso",
            "Teleatendimento",
            "Privatização hospitalar",
            "Desestatização nacional"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        }
      ]
    },
    {
      "id": "m4-t3",
      "title": "Educação",
      "summary": "Na educação, Flávio Bolsonaro propõe medidas voltadas à **alfabetização, tecnologia, formação profissional, ampliação de vagas e aproximação entre educação e mercado de trabalho**. Entre as propostas estão ampliar a oferta de creches em período integral e utilizar o **método fônico na alfabetização**.\n\nO plano também prevê ampliar as **escolas cívico-militares** e aumentar o acesso a tecnologias nas escolas, com robótica, computadores, tablets e internet. O **Programa Acolher** permitiria que alunos com melhor desempenho recebessem remuneração para ajudar outros estudantes por meio de aulas de reforço.\n\nEm regiões onde não houver vagas suficientes na rede pública, a proposta prevê a utilização de **vouchers para que estudantes frequentem escolas particulares**. Para aproximar a formação das necessidades do mercado, seria criada uma Política Nacional de Formação de Talentos, voltada às profissões do futuro, além de incentivos a instituições que formem profissionais considerados necessários ao país.\n\nNo ensino superior, propõe um modelo de **empréstimo contingente à renda**, no qual o estudante financia seus estudos e começa a pagar a dívida depois da formação. Também propõe o **Programa Escola de Campeões**, utilizando parcerias público-privadas para ampliar o esporte competitivo nas escolas.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que o Programa Acolher propõe?",
          "options": [
            "Contratar somente professores particulares para realizar as atividades de reforço escolar",
            "Remunerar alunos de melhor desempenho para oferecer reforço a outros estudantes",
            "Colocar estudantes no lugar dos professores para assumir as aulas escolares",
            "Conceder bolsas exclusivamente aos estudantes matriculados em instituições particulares de ensino"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Como funcionaria a proposta de voucher educacional?",
          "options": [
            "Todos os estudantes receberiam recursos em dinheiro destinados à compra dos materiais utilizados na escola",
            "O governo faria pagamentos mensais a todos os estudantes, independentemente da disponibilidade de vagas públicas",
            "Em locais com falta de vagas públicas, estudantes poderiam utilizar vagas em escolas particulares",
            "As escolas particulares passariam a integrar a rede pública, mediante sua transformação em instituições estatais"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Quais mudanças tecnológicas são propostas para as escolas?",
          "options": [
            "Trocar todas as aulas presenciais pela modalidade remota",
            "Levar robótica, computadores, tablets e internet às escolas",
            "Adotar apenas livros digitais, eliminando os materiais impressos",
            "Substituir os professores por sistemas de inteligência artificial"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Como funcionaria o empréstimo contingente à renda para o ensino superior?",
          "options": [
            "O estudante iniciaria o pagamento antes mesmo de ingressar no curso superior",
            "O estudante nunca teria de devolver o valor recebido para estudar",
            "O estudante começaria a pagar a dívida depois de se formar",
            "Só as universidades públicas poderiam oferecer esse tipo de empréstimo"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Qual conjunto representa melhor as propostas apresentadas para a educação básica?",
          "options": [
            "Ampliação de creches integrais, alfabetização pelo método fônico, tecnologia e expansão das escolas cívico-militares",
            "Encerramento das creches públicas e diminuição da presença de recursos tecnológicos nas atividades da educação básica",
            "Transferência da educação básica para instituições particulares, substituindo as escolas públicas como responsáveis pelo atendimento escolar",
            "Encerramento das aulas presenciais e substituição de todo o ensino básico por atividades exclusivamente em formato digital"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m4-t4",
      "title": "Política, Instituições e Corrupção",
      "summary": "Na área política e institucional, Flávio Bolsonaro apresenta propostas para **alterar regras do funcionamento do governo e do Judiciário**, com atenção especial ao STF. Entre elas estão acabar com a possibilidade de reeleição para cargos do Executivo, reduzir o número de ministérios e cargos comissionados e enxugar a estrutura da administração pública.\n\nEm relação ao STF, propõe **extinguir suas competências criminais originárias**, limitar decisões monocráticas e estabelecer uma quarentena de um ano para que ministros de Estado possam ser indicados ao Supremo. Também propõe impedir que parentes de magistrados até o terceiro grau e seus respectivos escritórios atuem no tribunal em que o magistrado exerce sua função.\n\nFlávio também declarou a intenção de indicar pessoas que considera **“patriotas” para futuras vagas no STF**. Outro ponto é a defesa de uma **anistia relacionada aos acontecimentos de 8 de janeiro de 2023**, medida que poderia beneficiar condenados pelos atos e outros casos abrangidos pelo texto de uma eventual lei. O alcance exato dependeria da legislação aprovada.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Flávio Bolsonaro propõe em relação à reeleição?",
          "options": [
            "Autorizar o exercício de três mandatos consecutivos",
            "Acabar com a possibilidade de reeleição",
            "Preservar integralmente as atuais regras de reeleição",
            "Restringir a reeleição ao cargo de presidente"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Quais mudanças são propostas em relação ao STF?",
          "options": [
            "Encerrar integralmente as atividades do STF mediante sua extinção",
            "Ampliar a quantidade de ministros e seus poderes individuais",
            "Limitar decisões monocráticas e alterar suas competências criminais originárias",
            "Entregar ao Congresso todas as funções atualmente exercidas pelo STF"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Qual é uma das propostas destinadas a evitar conflitos de interesse no Judiciário?",
          "options": [
            "Impedir parentes de magistrados até o terceiro grau e seus escritórios de atuar no respectivo tribunal",
            "Proibir que magistrados tenham familiares exercendo a advocacia, independentemente do tribunal ou da área em que esses profissionais atuem",
            "Impedir que qualquer advogado mantenha relações pessoais com magistrados, mesmo sem atuação em processos sob responsabilidade desses juízes",
            "Extinguir todos os escritórios particulares de advocacia, impedindo a prestação privada de serviços jurídicos em qualquer tribunal do país"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que a proposta de quarentena para indicação ao STF estabelece?",
          "options": [
            "Ministros que já integram o STF teriam de suspender o julgamento de processos por um ano, cumprindo esse período de afastamento",
            "Ministros de Estado teriam de cumprir uma quarentena de um ano antes de poderem ser indicados ao STF",
            "Qualquer candidato a uma vaga no STF teria de trabalhar durante um ano no Congresso antes de receber sua indicação",
            "Presidentes da República ficariam impedidos de indicar ministros ao STF durante o primeiro ano de exercício de seus respectivos mandatos"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual é a posição apresentada sobre o 8 de janeiro de 2023?",
          "options": [
            "Defender o aumento das penas para todos os envolvidos",
            "Preservar sem alterações a situação dos condenados pelos acontecimentos",
            "Defender uma anistia relacionada aos envolvidos nos acontecimentos",
            "Encaminhar a totalidade dos processos para julgamento nos tribunais estaduais"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        }
      ]
    },
    {
      "id": "m4-t5",
      "title": "Meio Ambiente",
      "summary": "Na área ambiental, Flávio Bolsonaro propõe combinar **preservação ambiental, produção rural e aproveitamento econômico sustentável dos recursos naturais**. Entre as metas apresentadas está **zerar o desmatamento ilegal até 2029** e ampliar formas de geração de renda associadas à manutenção da floresta preservada.\n\nPara o setor rural, as propostas incluem **simplificar as outorgas para irrigação** e acelerar a regularização fundiária e a entrega de títulos aos pequenos proprietários. Também pretende implementar maior **rastreabilidade das cadeias produtivas**, permitindo acompanhar a origem e o percurso dos produtos.\n\nNa área energética, propõe transformar o Brasil em uma **potência em biocombustíveis**, aproveitando recursos renováveis. O plano também defende o uso responsável e sustentável dos recursos naturais.\n\nNa administração ambiental, pretende **eliminar sobreposições de competências entre Ibama, Funai e ICMBio**, buscando definir de maneira mais clara a atuação de cada órgão.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Qual é a meta apresentada para o desmatamento ilegal?",
          "options": [
            "Reduzir o desmatamento ilegal à metade até 2040",
            "Zerar o desmatamento ilegal até 2029",
            "Liberar desmatamento em toda terra privada",
            "Zerar qualquer desmatamento até o ano de 2027"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que Flávio Bolsonaro propõe para pequenos proprietários rurais?",
          "options": [
            "Interromper a emissão dos títulos de propriedade rural",
            "Transferir suas propriedades para o domínio da União",
            "Acelerar a regularização fundiária e a titulação",
            "Impedir o uso de irrigação em pequenas propriedades"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Qual é a proposta relacionada à energia e aos combustíveis?",
          "options": [
            "Encerrar o uso de combustíveis renováveis na matriz brasileira",
            "Transformar o Brasil em uma potência de biocombustíveis",
            "Restringir a matriz de combustíveis brasileira às fontes fósseis",
            "Impedir a produção de etanol em todo o Brasil"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que significa ampliar alternativas de renda a partir da floresta preservada dentro das propostas apresentadas?",
          "options": [
            "Criar formas de atividade econômica associadas à conservação da floresta",
            "Converter as áreas de floresta preservada em espaços para construção de cidades",
            "Impedir toda atividade econômica que tenha relação com as áreas de floresta",
            "Autorizar somente a mineração como atividade econômica nas áreas de floresta"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que é proposto em relação a Ibama, Funai e ICMBio?",
          "options": [
            "Encerrar o funcionamento dos três órgãos",
            "Converter os órgãos em empresas privadas",
            "Ampliar a coincidência de suas funções",
            "Eliminar sobreposições entre suas atribuições"
          ],
          "correctIndex": 3,
          "explanation": "Resposta correta: D"
        }
      ]
    },
    {
      "id": "m4-t6",
      "title": "Programas Sociais e Direitos Humanos",
      "summary": "Na área de programas sociais e direitos humanos, Flávio Bolsonaro propõe **manter os programas assistenciais existentes**, mas alterar a forma de reajuste de benefícios como o BPC e os pisos da Previdência, que seriam corrigidos pela inflação, sem aumento real acima dela.\n\nTambém propõe criar um sistema de **benefícios e incentivos associados a determinadas ações**, como manter os filhos na escola, vaciná-los, realizar exames preventivos, concluir cursos de capacitação, poupar e manter as contas em dia. Essas ações poderiam gerar vantagens como cashback social, juros menores, descontos e maior facilidade de acesso ao crédito. Ao mesmo tempo, pretende proibir que recursos provenientes de programas sociais sejam utilizados em apostas.\n\nPara as mulheres, as propostas incluem integrar ferramentas como **Ligue 180, delegacias online, botão de emergência e centrais de monitoramento** em uma plataforma de resposta rápida. Também prevê a iniciativa Escola Brasil por Elas, oferecendo capacitação e ensino gratuito em parceria com o Sistema S e a iniciativa privada.\n\nPara idosos, propõe um **aplicativo de companhia e alerta para quem mora sozinho** e o Programa Casa Segura para Envelhecer, com subsídios relacionados à moradia. Para povos indígenas e quilombolas, defende maior autonomia para que decidam sobre atividades produtivas em suas terras.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que a proposta prevê para os programas assistenciais existentes?",
          "options": [
            "Encerrar imediatamente os programas",
            "Manter os programas existentes",
            "Trocar benefícios por empréstimos",
            "Privatizar integralmente os programas"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Como funcionaria o sistema de incentivos sociais proposto?",
          "options": [
            "Determinadas ações, como manter crianças na escola e realizar exames preventivos, poderiam gerar benefícios como cashback, descontos e melhores condições de crédito",
            "Todas as pessoas receberiam empréstimos sem juros de forma automática, sem necessidade de cumprir ações relacionadas à frequência escolar, à saúde ou à capacitação",
            "O acesso aos benefícios sociais ficaria restrito às pessoas que possuem emprego, excluindo os desempregados mesmo quando cumprissem ações de educação, saúde ou capacitação",
            "A concessão dos benefícios dependeria exclusivamente da idade de cada pessoa, sem considerar ações como manter crianças na escola, realizar exames ou concluir cursos"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que é proposto para melhorar a proteção das mulheres?",
          "options": [
            "Encerrar o atendimento pelo Ligue 180 e transferir o recebimento das denúncias para delegacias presenciais",
            "Reunir diferentes canais de denúncia e emergência em uma plataforma integrada de resposta rápida",
            "Entregar às empresas privadas a responsabilidade de administrar os canais destinados às denúncias das mulheres",
            "Disponibilizar um sistema de proteção com funcionamento limitado ao horário comercial, sem atendimento nos demais períodos"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Quais medidas são propostas especificamente para idosos?",
          "options": [
            "Limitar as medidas ao aumento do valor da aposentadoria, sem oferecer iniciativas de companhia ou apoio à moradia",
            "Criar um aplicativo de companhia e alerta e um programa de subsídio relacionado à moradia segura",
            "Instituir residências coletivas obrigatórias para idosos, determinando que passem a morar nesses locais em vez de suas casas",
            "Trocar o pagamento do BPC por empréstimos bancários, substituindo o benefício assistencial pelo acesso ao crédito para idosos"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual é a proposta relacionada aos povos indígenas e quilombolas?",
          "options": [
            "Impedir o desenvolvimento de qualquer atividade econômica dentro dos territórios dessas comunidades",
            "Entregar às empresas privadas a responsabilidade pela administração das terras dessas comunidades",
            "Dar maior autonomia para decidirem sobre atividades produtivas em suas terras",
            "Reservar exclusivamente ao governo federal a escolha das atividades realizadas nesses territórios"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        }
      ]
    },
    {
      "id": "m4-t7",
      "title": "Política Externa",
      "summary": "Na política externa, Flávio Bolsonaro propõe aproximar o Brasil de iniciativas internacionais de **cooperação militar, integração econômica e atração de investimentos estrangeiros**. Entre as propostas apresentadas está a participação brasileira no chamado **Escudo das Américas**, iniciativa de cooperação militar associada ao governo de Donald Trump.\n\nNa economia internacional, pretende **retomar o processo de adesão do Brasil à OCDE**, incluindo medidas de adequação às regras da organização, como a proposta de eliminação gradual do IOF sobre determinadas operações.\n\nTambém propõe criar um **plano nacional de integração às cadeias globais de valor**, buscando aumentar a participação de empresas e produtos brasileiros nas diferentes etapas da produção mundial.\n\nOutra prioridade seria posicionar o Brasil entre os **principais destinos internacionais de investimentos ligados à transição energética**, aproveitando o potencial energético brasileiro para atrair capital e projetos.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Flávio Bolsonaro propõe em relação à OCDE?",
          "options": [
            "Encerrar de vez as negociações do Brasil com a OCDE",
            "Retomar o processo de adesão do Brasil à organização",
            "Estabelecer uma nova organização internacional para concorrer com a OCDE",
            "Limitar a participação brasileira na OCDE à parceria militar"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual é o objetivo do plano de integração às cadeias globais de valor?",
          "options": [
            "Reduzir a presença do Brasil no comércio mundial e nas trocas com outros países",
            "Direcionar toda a produção brasileira ao mercado interno, sem atender à demanda externa",
            "Ampliar a participação do Brasil nas redes internacionais de produção e comércio",
            "Impedir a participação de empresas estrangeiras nas atividades que compõem a economia brasileira"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "O que é proposto na área de cooperação militar internacional?",
          "options": [
            "Abandonar todos os acordos militares",
            "Participar do Escudo das Américas",
            "Criar uma força da OCDE",
            "Trocar Forças Armadas por força internacional"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual é uma das propostas relacionadas à integração econômica internacional?",
          "options": [
            "Elevar de forma permanente a cobrança do IOF incidente sobre as operações realizadas no âmbito internacional",
            "Proibir a entrada de investimentos estrangeiros no Brasil, impedindo a aplicação de capital externo no país",
            "Avançar na adesão à OCDE, incluindo a redução gradual do IOF prevista nesse processo",
            "Retirar o Brasil das organizações econômicas internacionais e deixar de participar dessas instituições"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Como a transição energética aparece nas propostas de política externa?",
          "options": [
            "Como uma área na qual o Brasil buscaria atrair investimentos internacionais",
            "Como um setor que passaria a ficar sem recebimento de investimentos estrangeiros",
            "Como uma política voltada exclusivamente à atuação militar do Brasil no exterior",
            "Como motivo para paralisar os projetos de energia desenvolvidos no território brasileiro"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m4-t8",
      "title": "Segurança Pública",
      "summary": "Na segurança pública, Flávio Bolsonaro propõe uma política de **endurecimento das penas, expansão do sistema prisional, uso de tecnologia e maior participação federal no combate ao crime organizado**.\n\nEntre as medidas está classificar determinadas organizações criminosas como narcoterroristas e mobilizar **Exército, Marinha e Aeronáutica** para apoiar as polícias estaduais no enfrentamento dessas organizações.\n\nO plano prevê **reduzir a maioridade penal para 16 ou, em determinados crimes graves, 14 anos**, além de acabar com a progressão de regime para condenados por crimes hediondos. Também propõe construir cinco novos presídios de segurança máxima e criar 500 mil novas vagas no sistema prisional em quatro anos.\n\nNa área tecnológica, pretende criar a **“Muralha Brasileira”**, sistema de reconhecimento facial integrado a bancos de dados criminais, além de um Sistema Nacional de Fronteira. Para combater a violência contra mulheres, propõe monitorar por tornozeleira eletrônica agressores sujeitos a medidas protetivas. Também defende a castração química de condenados por abuso sexual contra mulheres e crianças.\n\nOutras propostas incluem **dobrar os investimentos federais em segurança pública**, aumentar as penas relacionadas ao furto e à revenda de celulares roubados e redirecionar recursos atualmente destinados às famílias de detentos para famílias de vítimas.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Como Flávio Bolsonaro propõe combater organizações ligadas ao narcotráfico?",
          "options": [
            "Empregando somente as Forças Armadas no enfrentamento ao narcotráfico, sem participação das polícias estaduais nessas operações",
            "Classificando organizações criminosas como narcoterroristas e utilizando as Forças Armadas para apoiar as polícias estaduais",
            "Entregando aos municípios toda a responsabilidade pela segurança pública, inclusive pelo combate às organizações do narcotráfico",
            "Diminuindo a participação do governo federal na segurança pública e no enfrentamento às organizações do narcotráfico"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que é a chamada “Muralha Brasileira”?",
          "options": [
            "Uma estrutura de barreiras físicas instalada ao longo de todas as fronteiras",
            "Uma categoria adicional de estabelecimento prisional pertencente ao sistema penitenciário federal",
            "Um sistema de reconhecimento facial integrado a bancos de dados criminais",
            "Uma divisão especializada que passaria a integrar a estrutura das Forças Armadas"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "O que é proposto para o sistema prisional?",
          "options": [
            "Reduzir o total de presídios no Brasil, deixando o sistema prisional com menos unidades",
            "Criar cinco novos presídios de segurança máxima e 500 mil novas vagas em quatro anos",
            "Trocar todos os presídios pelo uso de tornozeleiras, sem manter presos em unidades prisionais",
            "Passar os presídios federais ao setor privado, deixando essas unidades sob a gestão de empresas"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual medida é proposta para agressores de mulheres que estejam sujeitos a medidas protetivas?",
          "options": [
            "Monitoramento por tornozeleira eletrônica",
            "Aplicação exclusiva de multa",
            "Banimento permanente de celulares",
            "Serviço comunitário sempre obrigatório"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que a proposta prevê para pessoas condenadas por crimes hediondos?",
          "options": [
            "Progressão automática de regime",
            "Redução da pena após cumprir metade",
            "Fim da progressão de regime",
            "Troca compulsória por tornozeleira"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        }
      ]
    }
  ]
},
{
  "id": "mundo-5",
  "name": "MUNDO LULA",
  "number": "5",
  "subtitle": "MUNDO LULA",
  "description": "8 t?picos ? 39 perguntas",
  "prerequisiteWorldIds": [
    "mundo-1",
    "mundo-2",
    "mundo-3"
  ],
  "tasks": [
    {
      "id": "m5-t1",
      "title": "Economia e Emprego",
      "summary": "Na área de economia e emprego, Luiz Inácio Lula da Silva propõe medidas voltadas à **redução da jornada de trabalho, proteção dos trabalhadores, equilíbrio das contas públicas, desenvolvimento de setores estratégicos e ampliação do acesso ao emprego**.\n\nNo mercado de trabalho, propõe **reduzir a jornada para 40 horas semanais e acabar com a escala 6x1, sem redução dos salários**. Também pretende aperfeiçoar a regulamentação dos trabalhos realizados por meio de plataformas digitais e melhorar as políticas de acesso à Previdência.\n\nPara facilitar a busca por emprego, a proposta inclui a criação de uma **Plataforma Pública Nacional de Empregabilidade com inteligência artificial**, buscando conectar trabalhadores às oportunidades disponíveis.\n\nNa política econômica, Lula defende uma **trajetória sustentável para a dívida pública** e a criação de condições para uma redução sustentada da taxa de juros. Também propõe manter os **Correios como empresa estatal**.\n\nEm setores considerados estratégicos, defende a chamada **soberania energética e mineral**, incluindo a exploração do pré-sal, da Margem Equatorial, de minerais críticos e de terras raras. Na área científica, pretende dar continuidade ao **Programa Conhecimento Brasil**, voltado à repatriação de cientistas.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Lula propõe em relação à jornada de trabalho?",
          "options": [
            "Reduzir a jornada para 40 horas semanais e acabar com a escala 6x1, sem redução salarial",
            "Manter a escala 6x1 e estabelecer uma jornada máxima de 44 horas semanais",
            "Reduzir a jornada apenas para trabalhadores contratados pelo setor público federal",
            "Permitir que cada empresa determine livremente a jornada, inclusive com redução salarial"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Como Lula pretende utilizar inteligência artificial na área de emprego?",
          "options": [
            "Criando um sistema para determinar automaticamente os salários dos trabalhadores",
            "Criando uma Plataforma Pública Nacional de Empregabilidade com uso de inteligência artificial",
            "Utilizando inteligência artificial para substituir processos de contratação nas empresas privadas",
            "Criando uma plataforma destinada exclusivamente à contratação de servidores públicos federais"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que Lula defende na área de energia e recursos minerais?",
          "options": [
            "Interromper a exploração do pré-sal e concentrar a produção apenas em fontes renováveis",
            "Privatizar a exploração de todos os minerais considerados estratégicos para o país",
            "Defender a soberania energética e mineral, incluindo pré-sal, Margem Equatorial e minerais estratégicos",
            "Suspender novos projetos minerais até que o país reduza de forma significativa sua dívida pública"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Quais são algumas das propostas apresentadas para a política econômica?",
          "options": [
            "Eliminar a dívida pública e determinar diretamente uma taxa fixa de juros para o país",
            "Buscar uma trajetória sustentável da dívida pública e criar condições para redução sustentada dos juros",
            "Aumentar permanentemente os juros e utilizar os recursos arrecadados para financiar programas trabalhistas",
            "Suspender o pagamento da dívida pública para ampliar imediatamente os investimentos federais"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual conjunto representa corretamente outras propostas apresentadas por Lula?",
          "options": [
            "Privatizar os Correios, encerrar programas científicos e reduzir o acesso dos trabalhadores à Previdência",
            "Manter os Correios estatais, continuar o Programa Conhecimento Brasil e melhorar o acesso à Previdência",
            "Transformar os Correios em cooperativa, restringir a Previdência e substituir programas científicos por bolsas privadas",
            "Manter apenas parte dos Correios estatal e limitar programas de repatriação de cientistas ao setor energético"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        }
      ]
    },
    {
      "id": "m5-t2",
      "title": "Saúde",
      "summary": "Na área da saúde, Luiz Inácio Lula da Silva propõe medidas voltadas à **ampliação do acesso aos serviços de saúde, uso de novas tecnologias, prevenção de doenças, fortalecimento do tratamento do câncer e expansão da produção nacional de insumos farmacêuticos**.\n\nEntre as propostas está ampliar o uso de **inteligência artificial para triagem de pacientes e criar uma fila única digital organizada de acordo com o risco clínico**, buscando priorizar os casos conforme sua necessidade médica. Também pretende investir em **telecirurgia e cirurgia robótica**, incorporando novas tecnologias aos procedimentos de saúde.\n\nNa prevenção e acompanhamento de doenças, propõe incluir **exames laboratoriais e de monitoramento de doenças crônicas no Farmácia Popular**. Para o tratamento do câncer, pretende consolidar o que apresenta como a **maior rede pública de cuidado ao câncer do mundo**.\n\nLula também propõe avançar na **nacionalização de insumos farmacêuticos (IFAs)** utilizando o potencial da biodiversidade brasileira e expandir a **Rede Alyne**, voltada à saúde materna, na Amazônia Legal.\n\nAlém disso, pretende melhorar o acesso de pessoas de todas as idades ao **esporte e à atividade física, incluindo pessoas com deficiência**, e ampliar a atenção destinada a pessoas com problemas relacionados a **jogos de apostas**.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Como Lula propõe utilizar inteligência artificial no atendimento de saúde?",
          "options": [
            "Para realizar diagnósticos automaticamente e substituir consultas realizadas por profissionais de saúde",
            "Para fazer a triagem de pacientes e organizar uma fila única digital de acordo com o risco clínico",
            "Para determinar quais pacientes poderão utilizar gratuitamente os serviços oferecidos pelo sistema público",
            "Para substituir as filas hospitalares por um sistema destinado exclusivamente aos atendimentos de emergência"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Quais tecnologias Lula pretende ampliar na realização de procedimentos cirúrgicos?",
          "options": [
            "Telecirurgia e cirurgia robótica",
            "Inteligência artificial e atendimento exclusivamente remoto",
            "Impressão de medicamentos e consultas automatizadas",
            "Cirurgias domiciliares e equipamentos hospitalares portáteis"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que é proposto em relação ao Farmácia Popular?",
          "options": [
            "Limitar o programa à distribuição de medicamentos para doenças consideradas de alta complexidade",
            "Transformar o programa em uma rede destinada exclusivamente ao acompanhamento de pessoas idosas",
            "Incluir exames laboratoriais e de monitoramento de doenças crônicas entre os serviços contemplados",
            "Substituir a distribuição de medicamentos pela realização gratuita de exames em hospitais privados"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Quais propostas estão relacionadas ao câncer e à produção de insumos farmacêuticos?",
          "options": [
            "Ampliar a rede privada de câncer e aumentar a importação de insumos farmacêuticos utilizados pelo país",
            "Consolidar uma ampla rede pública de cuidado ao câncer e avançar na nacionalização de insumos farmacêuticos",
            "Concentrar o tratamento do câncer em hospitais especializados e interromper a produção nacional de insumos",
            "Transferir os tratamentos de câncer para os estados e restringir a produção de insumos ao setor privado"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Quais outros grupos ou áreas recebem atenção específica nas propostas apresentadas?",
          "options": [
            "Saúde materna na Amazônia Legal, pessoas com problemas relacionados a apostas e acesso inclusivo à atividade física",
            "Exclusivamente atletas profissionais, mulheres de grandes centros urbanos e pessoas internadas por doenças crônicas",
            "Apenas pessoas com deficiência, pacientes com câncer e profissionais envolvidos na produção de medicamentos",
            "Saúde materna apenas nas capitais, apostadores profissionais e pessoas que praticam esportes competitivos"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m5-t3",
      "title": "Educação",
      "summary": "Na área da educação, Luiz Inácio Lula da Silva propõe medidas voltadas à **alfabetização, ampliação do ensino público, educação em tempo integral, formação técnica e qualificação profissional**.\n\nUma das metas é alcançar **80% das crianças alfabetizadas na idade adequada** e assegurar o **acesso universal à Educação Infantil de qualidade**. Na Educação Básica, pretende ampliar a oferta de **ensino público em tempo integral**.\n\nPara o Ensino Médio, Lula propõe medidas para **aumentar a atratividade e incentivar a permanência dos estudantes**, acompanhadas da expansão do **Ensino Técnico-Profissionalizante**, aproximando a formação escolar da preparação para o mercado de trabalho. Também pretende **expandir a rede de Institutos Federais**.\n\nAlém da educação escolar, as propostas incluem promover **qualificação profissional e formação continuada para pessoas que já estão no mercado de trabalho**. Na área de idiomas, pretende ampliar o **MEC Idiomas**, incluindo novas línguas no programa.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Qual é a meta apresentada por Lula para a alfabetização das crianças?",
          "options": [
            "Garantir que 60% das crianças concluam a alfabetização antes de entrar no Ensino Fundamental",
            "Alcançar 80% das crianças alfabetizadas na idade considerada adequada",
            "Garantir alfabetização integral apenas para estudantes matriculados em escolas de tempo integral",
            "Alcançar 80% de alfabetização somente entre estudantes atendidos pela rede federal de ensino"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que Lula propõe para o Ensino Médio e a formação profissional?",
          "options": [
            "Aumentar a permanência dos estudantes e expandir o Ensino Técnico-Profissionalizante",
            "Substituir gradualmente o Ensino Médio regular por cursos exclusivamente profissionalizantes",
            "Concentrar a formação técnica apenas nos estudantes que concluírem toda a Educação Básica",
            "Reduzir a formação profissional nas escolas e concentrá-la exclusivamente nas universidades"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Quais propostas buscam ampliar diretamente a estrutura e o acesso à educação pública?",
          "options": [
            "Expandir os Institutos Federais e ampliar a Educação Básica pública em tempo integral",
            "Concentrar os investimentos nos Institutos Federais e reduzir gradualmente o ensino em tempo integral",
            "Expandir apenas universidades federais e transferir a Educação Básica integral para instituições privadas",
            "Limitar novos Institutos Federais às capitais e concentrar a Educação Básica no ensino de meio período"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que é proposto para trabalhadores que precisam continuar sua formação profissional?",
          "options": [
            "Oferecer formação profissional somente para pessoas que estejam fora do mercado de trabalho",
            "Promover qualificação profissional e formação continuada ao longo da participação no mercado de trabalho",
            "Substituir programas de qualificação profissional por cursos obrigatórios oferecidos pelos Institutos Federais",
            "Restringir programas de formação continuada aos trabalhadores que ainda não concluíram o Ensino Médio"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que Lula propõe em relação ao ensino de idiomas?",
          "options": [
            "Criar um programa de idiomas destinado exclusivamente aos estudantes dos Institutos Federais",
            "Concentrar o MEC Idiomas apenas no ensino de inglês e espanhol para estudantes do Ensino Médio",
            "Incluir novas línguas no MEC Idiomas, ampliando as opções oferecidas pelo programa",
            "Substituir o MEC Idiomas por cursos profissionalizantes voltados ao mercado internacional"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        }
      ]
    },
    {
      "id": "m5-t4",
      "title": "Política e Corrupção",
      "summary": "Na área de política e combate à corrupção, Luiz Inácio Lula da Silva propõe medidas voltadas ao **fortalecimento do voto, aumento da transparência, prevenção da corrupção e modernização dos serviços públicos**.\n\nUma das principais propostas é implementar uma **reforma política** com o objetivo de aumentar o poder do voto dos cidadãos, reduzir a influência da manipulação econômica no processo político e ampliar o debate político.\n\nNo combate à corrupção, Lula propõe criar **mecanismos de transparência ativa, prevenção e combate à corrupção**, buscando ampliar o acesso às informações públicas e fortalecer instrumentos destinados a prevenir e enfrentar práticas irregulares.\n\nTambém pretende promover a **digitalização dos serviços públicos**, ampliando o uso de ferramentas digitais na prestação de serviços do Estado.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Qual é um dos principais objetivos da reforma política proposta por Lula?",
          "options": [
            "Aumentar o poder do voto, reduzir a manipulação econômica e ampliar o debate político",
            "Transferir parte das decisões eleitorais diretamente para representantes do Poder Judiciário",
            "Reduzir a participação dos eleitores e concentrar as decisões políticas nos partidos",
            "Diminuir os debates eleitorais e ampliar a influência econômica durante as campanhas"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Lula propõe especificamente para o combate à corrupção?",
          "options": [
            "Concentrar as investigações exclusivamente nos órgãos ligados ao Poder Executivo",
            "Criar mecanismos de transparência ativa, prevenção e combate à corrupção",
            "Transferir todas as políticas anticorrupção para os governos estaduais e municipais",
            "Substituir os mecanismos preventivos por punições aplicadas somente após irregularidades"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Como a modernização da administração pública aparece nas propostas apresentadas?",
          "options": [
            "Pela substituição dos serviços federais por serviços administrados exclusivamente pelos estados",
            "Pela redução da oferta de serviços públicos realizados através de plataformas digitais",
            "Pela promoção da digitalização dos serviços públicos oferecidos à população",
            "Pela transferência gradual dos serviços digitais públicos para empresas privadas"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Qual conjunto melhor representa as propostas apresentadas para política e corrupção?",
          "options": [
            "Reforma política, maior transparência, prevenção da corrupção e digitalização dos serviços públicos",
            "Redução da participação eleitoral, diminuição da transparência e descentralização dos serviços federais",
            "Ampliação da influência econômica nas eleições e transferência dos serviços públicos para empresas privadas",
            "Manutenção integral do sistema político atual e redução dos mecanismos preventivos contra a corrupção"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m5-t5",
      "title": "Meio Ambiente",
      "summary": "Na área de meio ambiente, Luiz Inácio Lula da Silva propõe combinar **transição energética, redução de emissões, agricultura de baixo carbono, gestão de recursos naturais e políticas de reciclagem e saneamento ambiental**.\n\nEntre as propostas está **acabar com os lixões e ampliar a coleta seletiva e a reciclagem**. Na agricultura, pretende regulamentar a **Lei de Bioinsumos**, promover a transição para sistemas agrícolas de baixo carbono e dar continuidade à política de reforma agrária.\n\nNa área de energia e transportes, Lula propõe **aumentar a participação de fontes limpas na matriz energética**, acelerar a eletrificação dos transportes e abrir uma nova frente de investimentos em **baterias**. Ao mesmo tempo, defende continuar a exploração de **petróleo e gás natural**, segundo a proposta, com cuidados ambientais e visão estratégica.\n\nTambém pretende realizar uma **gestão estratégica dos minerais críticos** e regulamentar o **Sistema Brasileiro de Comércio de Emissões (SBCE)**, relacionado à redução e negociação de emissões de gases de efeito estufa.\n\nAlém disso, propõe incluir a **Caatinga como um ativo estratégico climático**, reconhecendo sua importância dentro das políticas ambientais e climáticas do país.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Lula propõe para a gestão de resíduos no Brasil?",
          "options": [
            "Acabar com os lixões e ampliar a coleta seletiva e a reciclagem",
            "Manter os lixões apenas em municípios que ainda não possuem sistemas de coleta seletiva",
            "Concentrar a reciclagem nas grandes cidades e transferir a gestão dos lixões para os estados",
            "Substituir gradualmente a coleta seletiva por grandes centros nacionais de armazenamento de resíduos"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Quais medidas são propostas para energia e transportes?",
          "options": [
            "Ampliar fontes limpas na matriz energética e acelerar a eletrificação dos transportes",
            "Concentrar a matriz energética em petróleo e reduzir investimentos na eletrificação dos transportes",
            "Substituir os investimentos em fontes limpas pela ampliação exclusiva da produção de biocombustíveis",
            "Manter a matriz energética atual e limitar veículos elétricos aos sistemas públicos de transporte"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Qual é a posição apresentada sobre a exploração de petróleo e gás natural?",
          "options": [
            "Encerrar gradualmente toda exploração de petróleo e gás natural realizada no território brasileiro",
            "Manter a exploração, segundo a proposta, com cuidados ambientais e uma visão considerada estratégica",
            "Permitir novas explorações somente quando todas as fontes fósseis forem destinadas ao mercado interno",
            "Substituir imediatamente a exploração de petróleo e gás por fontes exclusivamente renováveis de energia"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que Lula propõe para tornar a produção agrícola mais relacionada à agenda ambiental?",
          "options": [
            "Promover sistemas agrícolas de baixo carbono e regulamentar a Lei de Bioinsumos",
            "Substituir a produção agrícola convencional exclusivamente por agricultura estatal de larga escala",
            "Limitar os bioinsumos às propriedades participantes dos programas federais de reforma agrária",
            "Concentrar a redução das emissões agrícolas somente na substituição das máquinas utilizadas no campo"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Qual conjunto representa outras medidas ambientais apresentadas?",
          "options": [
            "Gestão estratégica dos minerais críticos, regulamentação do SBCE, investimentos em baterias e valorização climática da Caatinga",
            "Suspensão da exploração mineral, abandono do mercado de emissões e concentração dos investimentos em combustíveis fósseis",
            "Privatização dos minerais críticos, encerramento dos investimentos em baterias e retirada da Caatinga das políticas climáticas",
            "Restrição do comércio de emissões ao setor agrícola e substituição dos investimentos em baterias pela produção de petróleo"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m5-t6",
      "title": "Programas Sociais e Direitos Humanos",
      "summary": "Na área de programas sociais e direitos humanos, Luiz Inácio Lula da Silva propõe medidas voltadas ao **combate à fome e à pobreza, manutenção da assistência social, ampliação de direitos e proteção de diferentes grupos da população**.\n\nEntre os principais objetivos está **erradicar a fome no Brasil**, manter e melhorar os programas de assistência social e integrar diferentes projetos para enfrentar **múltiplas dimensões da pobreza**. A política de habitação também seria integrada à estratégia de redução da pobreza.\n\nLula propõe fortalecer **ações afirmativas, como cotas raciais e sociais**, tanto no ensino superior quanto nos concursos públicos federais. Para as mulheres, pretende ampliar políticas de proteção à vida e de combate ao machismo e ao sexismo. Também propõe ampliar o acesso aos direitos da população **LGBTQIA+**, combater a homofobia e enfrentar o capacitismo.\n\nAs propostas incluem ainda **efetivar os direitos dos povos indígenas e garantir os direitos humanos das pessoas idosas**. Na área de assistência e cuidados, pretende fomentar **lavanderias públicas, cozinhas solidárias e restaurantes populares**, além de criar um programa de capacitação de cuidadores.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Como Lula propõe enfrentar a fome e as diferentes dimensões da pobreza?",
          "options": [
            "Erradicar a fome, melhorar a assistência social e integrar diferentes programas de combate à pobreza",
            "Substituir os programas de assistência social por uma política concentrada exclusivamente na distribuição de alimentos",
            "Concentrar o combate à pobreza somente na criação de empregos e reduzir gradualmente os programas de assistência",
            "Transferir os programas de combate à fome para estados e municípios e encerrar iniciativas nacionais integradas"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que é proposto em relação às ações afirmativas?",
          "options": [
            "Manter cotas sociais apenas nas universidades e retirar sua aplicação dos concursos públicos federais",
            "Fortalecer cotas raciais e sociais no ensino superior e também nos concursos públicos federais",
            "Substituir as cotas raciais e sociais por programas baseados exclusivamente no desempenho acadêmico",
            "Aplicar ações afirmativas somente aos cursos superiores considerados prioritários pelo governo federal"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Quais medidas são apresentadas para mulheres, população LGBTQIA+ e pessoas com deficiência?",
          "options": [
            "Ampliar a proteção às mulheres, os direitos da população LGBTQIA+ e combater homofobia e capacitismo",
            "Concentrar as políticas para esses grupos exclusivamente na ampliação do acesso ao mercado de trabalho",
            "Transferir as políticas de proteção desses grupos integralmente para os governos estaduais e municipais",
            "Criar políticas específicas apenas para mulheres e substituir as demais por programas gerais de assistência social"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Como a habitação aparece nas propostas de combate à pobreza?",
          "options": [
            "Como uma política independente, sem relação direta com os programas destinados à redução da pobreza",
            "Como uma política que seria integrada à estratégia mais ampla de redução da pobreza",
            "Como uma política destinada exclusivamente às pessoas atendidas por restaurantes populares",
            "Como um programa voltado somente à construção de moradias para pessoas idosas e seus cuidadores"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Quais iniciativas são propostas na área de alimentação, serviços comunitários e cuidados?",
          "options": [
            "Fomentar lavanderias públicas, cozinhas solidárias e restaurantes populares, além de capacitar cuidadores",
            "Substituir restaurantes populares por benefícios financeiros e limitar a formação de cuidadores ao setor privado",
            "Criar cozinhas públicas somente em áreas rurais e direcionar as lavanderias exclusivamente às pessoas idosas",
            "Concentrar os serviços comunitários na distribuição de alimentos e encerrar programas públicos de capacitação"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m5-t7",
      "title": "Política Externa",
      "summary": "Na política externa, Luiz Inácio Lula da Silva propõe manter uma atuação internacional definida como **“ativa e altiva”**, buscando ampliar a presença do Brasil nas relações internacionais e fortalecer sua participação em organismos multilaterais.\n\nUma das prioridades é **fortalecer a presença brasileira em organismos multilaterais** e buscar uma posição de liderança na **agenda climática e de desenvolvimento sustentável** nos fóruns internacionais.\n\nNa área econômica, Lula propõe **diversificar as parcerias comerciais, tecnológicas e financeiras do Brasil**, ampliando as relações do país com diferentes parceiros internacionais nessas áreas.\n\nNa área de defesa, pretende investir nas **capacidades das Forças Armadas** e fortalecer a **Base Industrial de Defesa**, relacionada ao desenvolvimento e à produção de bens, tecnologias e serviços estratégicos para a defesa nacional.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Como Lula define a política externa que pretende adotar?",
          "options": [
            "Uma política externa “ativa e altiva”, com maior atuação brasileira no cenário internacional",
            "Uma política externa concentrada apenas nas relações comerciais com países da América Latina",
            "Uma política externa de redução gradual da participação brasileira nos principais fóruns internacionais",
            "Uma política externa voltada prioritariamente para acordos militares com grandes potências internacionais"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Lula propõe em relação aos organismos multilaterais?",
          "options": [
            "Reduzir a participação brasileira e priorizar exclusivamente acordos realizados diretamente entre países",
            "Fortalecer a presença do Brasil nesses organismos e ampliar sua atuação internacional",
            "Participar apenas dos organismos relacionados ao comércio e ao desenvolvimento econômico",
            "Substituir a participação nesses organismos pela criação de novas instituições lideradas exclusivamente pelo Brasil"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual papel Lula pretende que o Brasil exerça nas discussões internacionais sobre clima?",
          "options": [
            "Participar das discussões climáticas sem assumir posições de liderança nos fóruns internacionais",
            "Concentrar a atuação ambiental brasileira exclusivamente nas negociações realizadas na América do Sul",
            "Liderar a agenda de clima e desenvolvimento sustentável nos fóruns internacionais",
            "Separar as discussões sobre desenvolvimento sustentável das políticas internacionais relacionadas ao clima"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "O que é proposto para as relações econômicas internacionais do Brasil?",
          "options": [
            "Concentrar as relações econômicas nos países que já são os principais parceiros comerciais brasileiros",
            "Diversificar as parcerias comerciais, tecnológicas e financeiras mantidas pelo Brasil",
            "Priorizar parcerias financeiras e reduzir acordos relacionados ao comércio e à transferência de tecnologia",
            "Limitar novas parcerias internacionais aos países participantes dos mesmos organismos multilaterais que o Brasil"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual é a proposta apresentada para a área de defesa?",
          "options": [
            "Reduzir investimentos militares e concentrar recursos exclusivamente na participação brasileira em organismos internacionais",
            "Transferir parte das capacidades das Forças Armadas para organizações multilaterais das quais o Brasil participa",
            "Investir nas capacidades das Forças Armadas e na Base Industrial de Defesa",
            "Concentrar os investimentos militares exclusivamente na compra de equipamentos produzidos no exterior"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        }
      ]
    },
    {
      "id": "m5-t8",
      "title": "Segurança Pública",
      "summary": "Na área de segurança pública, Luiz Inácio Lula da Silva propõe uma política baseada na **integração entre os diferentes níveis de governo, fortalecimento das instituições de segurança, inteligência e combinação de prevenção e repressão ao crime organizado**.\n\nEntre as propostas está fortalecer o **Sistema Único de Segurança Pública** e ampliar a atuação coordenada entre União, estados e demais entes, com **integração e acesso a dados qualificados para combater facções criminosas**. Lula também propõe reestruturar as polícias e ampliar os investimentos em inteligência contra o crime organizado.\n\nPara os profissionais de segurança, pretende aprofundar investimentos em **formação continuada e cuidados com a saúde física e mental**. Também propõe a adoção de **câmeras corporais para policiais seguindo padrões nacionais de uso** e medidas para reduzir a circulação de armas ilegais.\n\nNo combate a outros tipos de criminalidade, pretende ampliar o **Programa Celular Seguro** e consolidar o Brasil como uma referência regional no **combate ao crime cibernético**.\n\nNo sistema de justiça e prisional, Lula propõe realizar reformas e criar um **protocolo nacional para classificação e transferência de presos de alta periculosidade**. Também pretende criar o **Ministério da Segurança Pública**, caso a PEC da Segurança seja aprovada pelo Congresso.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Como Lula propõe fortalecer o combate às facções e ao crime organizado?",
          "options": [
            "Concentrar as operações exclusivamente no governo federal e retirar dos estados o acesso aos dados criminais",
            "Integrar diferentes níveis de governo, compartilhar dados qualificados e ampliar investimentos em inteligência",
            "Transferir o combate às facções exclusivamente às Forças Armadas e reduzir a participação das polícias estaduais",
            "Priorizar ações municipais independentes e diminuir o compartilhamento nacional de informações sobre organizações criminosas"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Quais medidas são propostas em relação às polícias e aos profissionais de segurança?",
          "options": [
            "Reestruturar as polícias e ampliar investimentos em formação continuada e saúde física e mental dos profissionais",
            "Unificar todas as polícias brasileiras e transferir a formação dos profissionais exclusivamente para o governo federal",
            "Manter a estrutura atual das polícias e concentrar novos investimentos somente na aquisição de equipamentos",
            "Reduzir programas de formação profissional e direcionar os recursos principalmente para a ampliação do sistema prisional"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Lula propõe em relação às câmeras corporais utilizadas por policiais?",
          "options": [
            "Utilizá-las exclusivamente em operações federais relacionadas ao combate de facções criminosas",
            "Deixar que cada unidade policial estabeleça suas regras sem qualquer padrão definido nacionalmente",
            "Adotar câmeras corporais para policiais seguindo padrões nacionais de utilização",
            "Substituir gradualmente o uso das câmeras corporais por sistemas de reconhecimento facial"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Quais medidas são apresentadas para crimes envolvendo celulares e o ambiente digital?",
          "options": [
            "Ampliar o Programa Celular Seguro e buscar tornar o Brasil referência regional no combate ao crime cibernético",
            "Criar uma polícia específica para celulares e transferir o combate ao crime cibernético para empresas de tecnologia",
            "Substituir o Programa Celular Seguro por um cadastro obrigatório de aparelhos e reduzir a atuação federal no ambiente digital",
            "Concentrar o combate aos crimes digitais exclusivamente nas instituições financeiras e empresas de telecomunicações"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que é proposto para o sistema prisional e a estrutura federal de segurança?",
          "options": [
            "Criar um protocolo para presos de alta periculosidade e, se a PEC da Segurança for aprovada, criar o Ministério da Segurança Pública",
            "Transferir todos os presos de alta periculosidade para presídios federais e criar imediatamente o Ministério da Segurança Pública",
            "Substituir o atual sistema prisional por unidades federais e criar o Ministério da Segurança independentemente do Congresso",
            "Manter as regras atuais para transferência de presos e criar uma secretaria de segurança subordinada às polícias estaduais"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    }
  ]
},
{
  "id": "mundo-6",
  "name": "MUNDO RENAN SANTOS",
  "number": "6",
  "subtitle": "MUNDO RENAN SANTOS",
  "description": "8 t?picos ? 38 perguntas",
  "prerequisiteWorldIds": [
    "mundo-1",
    "mundo-2",
    "mundo-3"
  ],
  "tasks": [
    {
      "id": "m6-t1",
      "title": "Economia e Emprego",
      "summary": "Na área de economia e emprego, Renan Santos propõe medidas voltadas à **redução dos gastos públicos, flexibilização das relações de trabalho, mudanças na Previdência, privatizações e aumento dos investimentos em infraestrutura**.\n\nEntre as principais propostas fiscais está **cortar R$ 1,1 trilhão em gastos públicos** para interromper a atual trajetória de crescimento do endividamento. Os cortes incluiriam despesas com o alto funcionalismo. Também pretende revisar renúncias fiscais e subsídios relacionados à Zona Franca de Manaus e realizar uma **nova reforma da Previdência**, buscando reduzir os gastos com aposentadorias. Outra medida seria acabar com o reajuste automático de benefícios vinculados ao salário mínimo.\n\nNa organização administrativa do país, Renan propõe **reduzir o número de municípios brasileiros dos atuais 5.570 para aproximadamente 1.656**. Também pretende **privatizar os Correios**.\n\nNo mercado de trabalho, propõe alterar a Constituição para permitir **regras trabalhistas mais flexíveis e maior liberdade para trabalhadores e empresas**.\n\nPara estimular investimentos e desenvolvimento econômico, pretende criar **zonas econômicas especiais no Nordeste** e estabelecer uma meta de investimentos em infraestrutura equivalente a **2% a 4% do PIB, com foco especialmente em ferrovias**.\n\nOutra proposta é a criação de uma **reserva estratégica brasileira em Bitcoin**, incorporando o ativo às reservas estratégicas do país.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Qual é uma das principais propostas de Renan Santos para controlar o crescimento do endividamento público?",
          "options": [
            "Cortar R$ 1,1 trilhão em gastos públicos, incluindo reduções de despesas no alto funcionalismo",
            "Aumentar R$ 1,1 trilhão em impostos para financiar integralmente o crescimento das despesas públicas",
            "Privatizar exclusivamente empresas estaduais e utilizar os recursos para ampliar os gastos previdenciários",
            "Suspender temporariamente o pagamento da dívida pública para aumentar os investimentos em infraestrutura"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Renan Santos propõe em relação às regras de trabalho?",
          "options": [
            "Estabelecer uma legislação trabalhista única, sem possibilidade de negociação entre empresas e trabalhadores",
            "Alterar a Constituição para permitir regras mais flexíveis e maior liberdade para trabalhadores e empresas",
            "Reduzir a jornada de trabalho nacional e estabelecer novas limitações para acordos entre trabalhadores e empresas",
            "Transferir aos estados a responsabilidade de definir integralmente suas próprias legislações trabalhistas"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Quais mudanças Renan propõe na Previdência e nos benefícios vinculados ao salário mínimo?",
          "options": [
            "Aumentar os gastos previdenciários e garantir reajustes acima do salário mínimo para todos os benefícios",
            "Manter o atual sistema previdenciário e modificar apenas os benefícios destinados ao alto funcionalismo",
            "Realizar uma nova reforma da Previdência e acabar com o reajuste automático de benefícios vinculados ao salário mínimo",
            "Substituir o sistema previdenciário por contas individuais e eliminar imediatamente os benefícios vinculados ao salário mínimo"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "O que Renan Santos propõe para infraestrutura e desenvolvimento regional?",
          "options": [
            "Investir exclusivamente em rodovias e concentrar novas zonas econômicas especiais na Região Sudeste",
            "Estabelecer investimentos de 2% a 4% do PIB em infraestrutura, com foco em ferrovias, e criar zonas econômicas especiais no Nordeste",
            "Reduzir os investimentos federais em infraestrutura e transferir a construção de ferrovias exclusivamente aos governos estaduais",
            "Concentrar investimentos públicos na Zona Franca de Manaus e suspender novos projetos ferroviários no Nordeste"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual conjunto representa outras mudanças econômicas e administrativas propostas por Renan Santos?",
          "options": [
            "Manter os Correios estatais, ampliar o número de municípios e criar uma reserva estratégica baseada exclusivamente em dólar",
            "Privatizar os Correios, reduzir o número de municípios e criar uma reserva estratégica em Bitcoin",
            "Privatizar os Correios, criar novos municípios e impedir que ativos digitais sejam utilizados em reservas estratégicas",
            "Manter a estrutura municipal atual, transformar os Correios em autarquia e substituir reservas internacionais por Bitcoin"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        }
      ]
    },
    {
      "id": "m6-t2",
      "title": "Saúde",
      "summary": "Na área da saúde, Renan Santos propõe medidas relacionadas à **digitalização do SUS, ampliação do uso de tecnologia, mudanças nas regras de financiamento da saúde e adoção de novas abordagens terapêuticas**.\n\nEntre as propostas está implementar **inteligência artificial no SUS para auxiliar na criação de um prontuário único dos pacientes**, além de integrar as **teleconsultas** ao sistema público de saúde. Também propõe disponibilizar **Ozempic pelo SUS**.\n\nNa área de saúde mental, Renan defende estabelecer a **internação compulsória de pessoas que classifica como portadoras de doenças mentais graves, com atenção especial ao que descreve como psicopatas que tenham cometido crimes violentos**. Também propõe legalizar o uso terapêutico da **psilocibina e do canabidiol**.\n\nOutra proposta é proibir o que o plano descreve como **“propaganda, financiamento e influência” que promovam a transição de crianças e adolescentes**.\n\nNo financiamento da saúde pública, Renan propõe **acabar com o piso constitucional de gastos em Saúde**, retirando a obrigação constitucional de um patamar mínimo de recursos destinado à área.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Como Renan Santos pretende utilizar tecnologia no SUS?",
          "options": [
            "Implementar inteligência artificial para um prontuário único e integrar teleconsultas ao sistema público",
            "Substituir consultas presenciais por inteligência artificial e tornar todos os atendimentos exclusivamente digitais",
            "Utilizar inteligência artificial apenas para controlar os gastos dos hospitais e restringir consultas presenciais",
            "Criar prontuários separados para cada hospital e transferir as teleconsultas exclusivamente para a rede privada"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Quais medidas são propostas em relação a medicamentos e substâncias para uso terapêutico?",
          "options": [
            "Disponibilizar Ozempic pelo SUS e legalizar o uso terapêutico da psilocibina e do canabidiol",
            "Disponibilizar canabidiol pelo SUS e proibir qualquer utilização terapêutica da psilocibina e do Ozempic",
            "Oferecer Ozempic exclusivamente pela rede privada e restringir o uso terapêutico do canabidiol",
            "Legalizar livremente todas as substâncias e retirar do SUS a responsabilidade pela distribuição de medicamentos"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Renan Santos propõe na área de internação compulsória?",
          "options": [
            "Proibi-la em todos os casos envolvendo pessoas que tenham cometido crimes violentos",
            "Aplicá-la automaticamente a qualquer pessoa diagnosticada com algum transtorno psicológico",
            "Estabelecê-la para pessoas que classifica como portadoras de doenças mentais graves, especialmente nos casos descritos de psicopatas que cometem crimes violentos",
            "Transferir integralmente aos familiares a decisão sobre internações de pessoas envolvidas em crimes violentos"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Qual medida é apresentada em relação à transição de crianças e adolescentes?",
          "options": [
            "Financiar programas públicos destinados à transição de crianças e adolescentes",
            "Proibir o que o plano descreve como propaganda, financiamento e influência que promovam essa transição",
            "Transferir exclusivamente às escolas a responsabilidade pela regulamentação desse tipo de conteúdo",
            "Criar uma política federal de financiamento destinada exclusivamente aos adolescentes maiores de 16 anos"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que Renan Santos propõe em relação ao financiamento constitucional da Saúde?",
          "options": [
            "Aumentar o percentual mínimo que obrigatoriamente deve ser destinado à Saúde",
            "Manter integralmente as atuais regras constitucionais de gastos mínimos com Saúde",
            "Criar um novo piso constitucional vinculado exclusivamente ao crescimento da economia",
            "Acabar com o piso constitucional de gastos em Saúde"
          ],
          "correctIndex": 3,
          "explanation": "Resposta correta: D"
        }
      ]
    },
    {
      "id": "m6-t3",
      "title": "Educação",
      "summary": "Na área da educação, Renan Santos propõe mudanças relacionadas à **alfabetização, critérios de acesso e financiamento do ensino, modelos escolares, homeschooling e regras de gastos públicos e remuneração de professores**.\n\nNa alfabetização, pretende implementar o **método fônico**. No ensino superior, propõe **acabar com as cotas e substituí-las por bolsas destinadas a estudantes que se destacam academicamente**, além de redirecionar recursos públicos atualmente destinados ao ensino superior para a **Educação Básica**.\n\nRenan também propõe uma **reeducação ampla da sociedade, dentro e fora das escolas, com o objetivo declarado de estabelecer uma cultura de direita**. Outra proposta é implementar **escolas militares ou cívico-militares**, defendidas pelo candidato como espaços de maior disciplina e de oferta de um “exemplo masculino” para jovens em situação de vulnerabilidade, especialmente aqueles sem figura paterna.\n\nTambém pretende apoiar a **regularização do homeschooling**, permitindo a regulamentação da educação domiciliar. Para os professores, propõe **revisar o piso salarial da categoria**.\n\nNo financiamento da educação, Renan defende **acabar com o piso constitucional de gastos em Educação**, retirando a exigência constitucional de um patamar mínimo de recursos destinado à área.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Renan Santos propõe para a alfabetização e a organização de determinados modelos escolares?",
          "options": [
            "Implementar o método fônico e escolas militares ou cívico-militares",
            "Manter os métodos atuais de alfabetização e substituir escolas militares por instituições técnicas",
            "Implementar exclusivamente alfabetização digital e transformar escolas públicas em unidades profissionalizantes",
            "Transferir a definição do método de alfabetização para cada família e eliminar modelos cívico-militares"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Renan Santos propõe em relação às cotas e aos recursos destinados ao ensino?",
          "options": [
            "Ampliar as cotas e aumentar prioritariamente os recursos destinados ao ensino superior",
            "Acabar com as cotas, substituí-las por bolsas baseadas em destaque acadêmico e redirecionar recursos para a Educação Básica",
            "Manter as cotas exclusivamente no ensino público e criar bolsas sem critérios relacionados ao desempenho acadêmico",
            "Substituir as cotas por financiamento estudantil e direcionar mais recursos públicos para universidades federais"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual proposta é apresentada em relação à orientação cultural e política da sociedade?",
          "options": [
            "Impedir que qualquer corrente política ou cultural seja discutida dentro das instituições de ensino",
            "Promover uma reeducação dentro e fora do ambiente escolar com o objetivo declarado de estabelecer uma cultura de direita",
            "Restringir discussões políticas exclusivamente às universidades e proibi-las durante a Educação Básica",
            "Criar uma política educacional voltada à retirada de conteúdos relacionados a qualquer corrente ideológica"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que Renan Santos propõe em relação à educação domiciliar e aos professores?",
          "options": [
            "Proibir o homeschooling e manter obrigatoriamente as regras atuais do piso salarial dos professores",
            "Regularizar o homeschooling e extinguir qualquer remuneração mínima nacional destinada aos professores",
            "Apoiar a regularização do homeschooling e revisar o piso salarial dos professores",
            "Limitar o homeschooling ao Ensino Médio e estabelecer um novo piso exclusivamente para professores federais"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "O que é proposto em relação ao financiamento constitucional da Educação?",
          "options": [
            "Aumentar o percentual mínimo de recursos que obrigatoriamente deve ser destinado à Educação",
            "Manter o piso constitucional e direcioná-lo exclusivamente para a Educação Básica",
            "Criar um novo piso constitucional destinado apenas às escolas públicas de tempo integral",
            "Acabar com o piso constitucional de gastos em Educação"
          ],
          "correctIndex": 3,
          "explanation": "Resposta correta: D"
        }
      ]
    },
    {
      "id": "m6-t4",
      "title": "Política e Corrupção",
      "summary": "Na área de política e combate à corrupção, Renan Santos propõe medidas relacionadas à **criminalização de determinados discursos políticos, punição de condenados por corrupção, redução de supersalários no setor público e maior controle sobre emendas parlamentares**.\n\nUma das propostas é **criminalizar o que o candidato denomina “discurso comunista”**, tornando determinadas manifestações enquadradas nessa definição sujeitas a sanções criminais.\n\nPara pessoas condenadas por corrupção, Renan propõe a criação ou utilização de um **presídio localizado na Floresta Amazônica**, para onde esses condenados seriam enviados.\n\nNa administração pública, pretende **cortar os chamados supersalários**, buscando limitar remunerações consideradas excessivas dentro do setor público.\n\nTambém propõe **aumentar o controle sobre as emendas parlamentares**, criando mecanismos para controlar a utilização desses recursos.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Renan Santos propõe em relação ao que denomina “discurso comunista”?",
          "options": [
            "Restringi-lo exclusivamente dentro das instituições públicas federais",
            "Criminalizar o que considera “discurso comunista”",
            "Permiti-lo apenas durante campanhas e debates eleitorais",
            "Submetê-lo exclusivamente às regras internas dos partidos políticos"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual medida é proposta para pessoas condenadas por corrupção?",
          "options": [
            "Cumprimento obrigatório de penas exclusivamente em presídios estaduais de segurança máxima",
            "Substituição das penas de prisão por multas proporcionais ao patrimônio dos condenados",
            "Envio dos condenados por corrupção para um presídio localizado na Floresta Amazônica",
            "Criação de prisão domiciliar específica acompanhada da devolução dos recursos desviados"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "O que Renan Santos propõe em relação às remunerações no setor público?",
          "options": [
            "Cortar os chamados supersalários existentes no setor público",
            "Criar um novo teto salarial apenas para funcionários de empresas estatais",
            "Manter as atuais regras de remuneração sem realizar mudanças nos salários mais elevados",
            "Reduzir exclusivamente os salários de servidores públicos pertencentes ao Poder Executivo"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Qual medida é apresentada em relação às emendas parlamentares?",
          "options": [
            "Acabar completamente com todas as modalidades de emendas parlamentares",
            "Transferir a administração das emendas parlamentares exclusivamente ao Poder Executivo",
            "Aumentar automaticamente os recursos disponíveis para deputados e senadores por meio das emendas",
            "Controlar as emendas parlamentares e a utilização dos recursos relacionados a elas"
          ],
          "correctIndex": 3,
          "explanation": "Resposta correta: D"
        }
      ]
    },
    {
      "id": "m6-t5",
      "title": "Meio Ambiente",
      "summary": "Na área de meio ambiente, Renan Santos apresenta uma proposta voltada principalmente à **mudança no processo de licenciamento ambiental para facilitar a realização de investimentos e projetos econômicos**.\n\nA proposta é **agilizar o licenciamento ambiental**, buscando diminuir o tempo e os obstáculos envolvidos na aprovação de projetos, especialmente nos setores de **infraestrutura, mineração e energia**.\n\nSegundo a proposta, essa mudança teria como objetivos **reduzir a insegurança jurídica para os investidores, destravar investimentos e estimular o crescimento econômico**.\n\nAssim, dentro das informações apresentadas, a política ambiental de Renan nesse tema está concentrada na **relação entre licenciamento ambiental e desenvolvimento econômico**.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Renan Santos propõe em relação ao licenciamento ambiental?",
          "options": [
            "Tornar o processo mais rápido para facilitar a realização de determinados investimentos",
            "Suspender novos licenciamentos ambientais até que as regras nacionais sejam completamente reformuladas",
            "Transferir todos os processos de licenciamento ambiental para empresas privadas especializadas",
            "Exigir novos procedimentos ambientais antes da aprovação de qualquer investimento em infraestrutura"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Quais setores seriam especialmente beneficiados pela agilização proposta?",
          "options": [
            "Agricultura, turismo e comércio exterior",
            "Infraestrutura, mineração e energia",
            "Tecnologia, educação e telecomunicações",
            "Transporte urbano, saúde e indústria farmacêutica"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual é um dos objetivos apresentados para a mudança no licenciamento ambiental?",
          "options": [
            "Reduzir a insegurança jurídica e ajudar a destravar investimentos",
            "Impedir investimentos privados em setores considerados ambientalmente estratégicos",
            "Concentrar os novos investimentos exclusivamente em projetos públicos de energia",
            "Substituir investimentos em mineração por projetos relacionados exclusivamente à infraestrutura"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Como o crescimento econômico aparece nessa proposta ambiental?",
          "options": [
            "Como um objetivo que seria estimulado pela agilização do licenciamento e pelo destravamento de investimentos",
            "Como uma consequência que deveria ser evitada quando envolvesse projetos de mineração e energia",
            "Como uma responsabilidade exclusiva das empresas privadas, sem relação com o processo de licenciamento",
            "Como um objetivo secundário restrito aos investimentos realizados diretamente pelo governo federal"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m6-t6",
      "title": "Programas Sociais e Direitos Humanos",
      "summary": "Na área de programas sociais e direitos humanos, Renan Santos propõe medidas relacionadas à **urbanização, população em situação de rua, proteção de mulheres, mudanças no Bolsa Família e organização da migração interna**.\n\nUma das metas apresentadas é **acabar com as favelas em um período de 10 anos**. Para pessoas em situação de rua com problemas mentais ou consideradas como tendo comportamento perigoso, propõe medidas de **punição e internação compulsória**.\n\nNa proteção às mulheres, Renan pretende criar um **aplicativo de alerta ligado às medidas protetivas**, que avisaria uma mulher quando o agressor estivesse próximo, permitindo que ela se protegesse e acionasse a polícia.\n\nTambém propõe uma **reforma do Bolsa Família**. Segundo a proposta, pessoas classificadas como “adultos saudáveis” deixariam de receber o auxílio e passariam a atuar em **frentes de trabalho do governo**.\n\nOutra proposta é **organizar a migração interna**, buscando evitar, segundo o plano, a superlotação de determinadas cidades e o surgimento ou agravamento de problemas sociais relacionados ao crescimento populacional.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Qual é a meta apresentada por Renan Santos em relação às favelas?",
          "options": [
            "Reduzir pela metade o número de favelas existentes durante um período de dez anos",
            "Acabar com as favelas em um período de 10 anos",
            "Transferir a administração das favelas exclusivamente para os governos municipais",
            "Transformar todas as favelas em zonas econômicas especiais durante os próximos dez anos"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que Renan propõe para moradores de rua com problemas mentais ou comportamento considerado perigoso?",
          "options": [
            "Oferecer exclusivamente benefícios financeiros e atendimento voluntário em unidades municipais",
            "Transferir essas pessoas obrigatoriamente para programas federais de habitação popular",
            "Adotar medidas de punição e promover internação compulsória nos casos descritos pela proposta",
            "Criar frentes de trabalho obrigatórias como única política destinada às pessoas em situação de rua"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Como funcionaria a proposta de aplicativo voltado à proteção das mulheres?",
          "options": [
            "Avisaria quando um agressor sujeito a medida protetiva estivesse próximo, permitindo acionar a polícia",
            "Permitiria que qualquer pessoa acompanhasse em tempo real a localização de condenados por violência",
            "Substituiria as medidas protetivas por um sistema digital de comunicação direta entre vítima e agressor",
            "Seria utilizado exclusivamente pela polícia para localizar mulheres que possuem medidas protetivas"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Renan Santos propõe em relação ao Bolsa Família?",
          "options": [
            "Ampliar o benefício para todos os adultos e criar um programa voluntário de trabalho complementar",
            "Manter as regras atuais do programa e criar frentes de trabalho exclusivamente para pessoas não beneficiárias",
            "Substituir integralmente o Bolsa Família por empregos públicos permanentes oferecidos pelo governo federal",
            "Reformar o programa para que “adultos saudáveis” deixem de receber o auxílio e atuem em frentes de trabalho do governo"
          ],
          "correctIndex": 3,
          "explanation": "Resposta correta: D"
        },
        {
          "prompt": "Qual é o objetivo apresentado para a organização da migração interna?",
          "options": [
            "Evitar que determinadas cidades fiquem superlotadas e enfrentem problemas sociais relacionados a esse processo",
            "Impedir permanentemente que brasileiros possam mudar de um estado para outro sem autorização do governo",
            "Concentrar a população das pequenas cidades em regiões metropolitanas com maior oferta de empregos públicos",
            "Transferir moradores de grandes cidades para municípios menores por meio de programas obrigatórios de habitação"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m6-t7",
      "title": "Política Externa",
      "summary": "Na política externa, Renan Santos propõe medidas relacionadas ao **combate internacional ao crime organizado, aproximação estratégica com os Estados Unidos, integração entre países de língua portuguesa e fortalecimento militar do Brasil**.\n\nUma das propostas é transformar o Brasil em uma **liderança no combate ao crime organizado na América do Sul**, ampliando o papel brasileiro no enfrentamento regional dessas organizações.\n\nRenan também propõe **bloquear e proibir determinados financiamentos estrangeiros destinados a ONGs** que, segundo sua caracterização, promovam agendas “pró-crime e garantismo penal”. Entre os exemplos mencionados na proposta estão recursos provenientes de fundações como a Open Society, associada a George Soros.\n\nNa área comercial e diplomática, pretende estabelecer uma **aliança estratégica com os Estados Unidos** para buscar substituir parte das importações americanas provenientes da China por produtos brasileiros.\n\nTambém propõe promover uma maior **integração lusófona**, buscando aproximar países de língua portuguesa e reposicioná-los como um bloco geopolítico mais coeso.\n\nNa área militar, Renan Santos propõe **desenvolver armas nucleares**, ampliando as capacidades estratégicas militares do Brasil.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Qual papel Renan Santos pretende que o Brasil exerça no combate ao crime organizado?",
          "options": [
            "Tornar-se uma liderança no combate ao crime organizado na América do Sul",
            "Concentrar o combate ao crime organizado exclusivamente dentro do território brasileiro",
            "Transferir a responsabilidade regional de combate ao crime para organizações internacionais",
            "Criar uma força militar independente formada exclusivamente pelos países de língua portuguesa"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Renan propõe em relação ao financiamento estrangeiro de determinadas ONGs?",
          "options": [
            "Permitir qualquer financiamento estrangeiro desde que os recursos sejam declarados ao governo brasileiro",
            "Bloquear e proibir financiamentos estrangeiros para ONGs enquadradas pelo candidato nas agendas mencionadas",
            "Proibir todo tipo de financiamento internacional destinado a qualquer organização não governamental brasileira",
            "Permitir financiamento estrangeiro exclusivamente quando proveniente de organizações sediadas nos Estados Unidos"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual é o objetivo da aliança estratégica proposta com os Estados Unidos?",
          "options": [
            "Substituir produtos brasileiros no mercado americano por mercadorias produzidas conjuntamente com a China",
            "Reduzir as exportações brasileiras aos Estados Unidos e priorizar exclusivamente os países da América do Sul",
            "Buscar substituir parte das importações americanas provenientes da China por produtos brasileiros",
            "Criar um mercado comum entre Brasil e Estados Unidos que elimine todas as importações provenientes da Ásia"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "O que significa a proposta de integração lusófona apresentada por Renan?",
          "options": [
            "Buscar maior integração entre países de língua portuguesa, formando um bloco geopolítico mais coeso",
            "Criar uma união exclusivamente comercial entre Brasil e Portugal, sem participação de outros países lusófonos",
            "Substituir as organizações internacionais existentes por uma instituição controlada pelos países de língua portuguesa",
            "Formar uma aliança militar obrigatória entre todos os países que possuem o português como língua oficial"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Qual proposta é apresentada por Renan Santos para a área militar estratégica?",
          "options": [
            "Abandonar programas militares estratégicos e depender de alianças internacionais para a defesa nacional",
            "Participar de um programa nuclear militar administrado conjuntamente com os Estados Unidos",
            "Concentrar os investimentos militares exclusivamente em armamentos convencionais e defesa de fronteiras",
            "Desenvolver armas nucleares no Brasil"
          ],
          "correctIndex": 3,
          "explanation": "Resposta correta: D"
        }
      ]
    },
    {
      "id": "m6-t8",
      "title": "Segurança Pública",
      "summary": "Na área de segurança pública, Renan Santos propõe uma política de **forte repressão às facções criminosas, ampliação do encarceramento, participação das Forças Armadas na segurança pública e endurecimento das penas**.\n\nEntre as propostas está promover uma **“guerra contra facções”**, utilizando também as Forças Armadas como apoio às forças de segurança. Para financiar operações contra o crime organizado, pretende investir **R$ 5 bilhões por ano**.\n\nRenan também propõe **reduzir a maioridade penal** e estabelecer uma pena de **30 anos para roubo e furto de celulares**. O plano inclui ainda promover o que é descrito como **encarceramento em massa** e destinar **R$ 6 bilhões para a construção de novos presídios**.\n\nPara a população carcerária, propõe utilizar presos como **força de trabalho em obras de infraestrutura**, medida associada pelo candidato à chamada **“PEC da Bola de Ferro”**.\n\nEm relação às armas, Renan defende **facilitar o porte de armas para o cidadão comum**. Também propõe adotar um **regime de exceção nas favelas**.\n\nAlém das medidas diretamente relacionadas à segurança pública, Renan propõe investir no **desenvolvimento de uma bomba atômica**, defendendo a medida como parte de uma estratégia para que o Brasil se torne, segundo sua proposta, uma das cinco maiores nações do mundo nos próximos 30 anos.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Como Renan Santos propõe intensificar o combate às facções criminosas?",
          "options": [
            "Promover uma “guerra contra facções”, utilizar as Forças Armadas como apoio e investir R$ 5 bilhões anuais em operações contra o crime organizado",
            "Concentrar o combate às facções exclusivamente nas polícias municipais e reduzir progressivamente a participação do governo federal",
            "Utilizar apenas as Forças Armadas no combate às facções e substituir as operações policiais realizadas pelos estados",
            "Priorizar exclusivamente medidas preventivas e direcionar os novos investimentos para programas sociais em áreas afetadas pelo crime organizado"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Quais mudanças Renan propõe em relação às penas e ao encarceramento?",
          "options": [
            "Reduzir a maioridade penal, estabelecer pena de 30 anos para roubo e furto de celulares e promover encarceramento em massa",
            "Manter a maioridade penal atual, aumentar apenas as penas relacionadas às facções e reduzir o número de pessoas encarceradas",
            "Reduzir as penas relacionadas a crimes patrimoniais e concentrar o encarceramento exclusivamente nos integrantes de organizações criminosas",
            "Aumentar a maioridade penal, criar penas alternativas para furtos e limitar novas prisões aos condenados por crimes violentos"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Renan Santos propõe para o sistema prisional?",
          "options": [
            "Investir R$ 6 bilhões em novos presídios e utilizar a população carcerária como força de trabalho em obras de infraestrutura",
            "Reduzir o número de presídios e utilizar exclusivamente penas alternativas para diminuir a população carcerária",
            "Destinar R$ 5 bilhões aos presídios existentes e proibir a utilização de presos em qualquer atividade relacionada a obras públicas",
            "Privatizar todo o sistema prisional e transferir às empresas de infraestrutura a responsabilidade pela administração dos presos"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Quais propostas são apresentadas em relação às armas e às favelas?",
          "options": [
            "Restringir o porte de armas para cidadãos e manter nas favelas as mesmas políticas de segurança existentes atualmente",
            "Facilitar o porte de armas para o cidadão comum e adotar um regime de exceção nas favelas",
            "Permitir armas exclusivamente para moradores de áreas consideradas de alto risco e ampliar o policiamento comunitário nas favelas",
            "Proibir novas autorizações de porte e transferir integralmente a segurança das favelas para as Forças Armadas"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual proposta estratégica militar também aparece entre as medidas apresentadas?",
          "options": [
            "Desenvolver uma bomba atômica como parte de uma estratégia para ampliar o poder internacional do Brasil",
            "Abandonar projetos relacionados à tecnologia nuclear e concentrar os investimentos exclusivamente na segurança pública",
            "Comprar armamentos nucleares de outros países para reduzir os custos de desenvolvimento da indústria militar brasileira",
            "Criar um programa nuclear exclusivamente civil e impedir qualquer investimento relacionado ao desenvolvimento militar"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    }
  ]
},
{
  "id": "mundo-7",
  "name": "MUNDO AUGUSTO CURY",
  "number": "7",
  "subtitle": "MUNDO AUGUSTO CURY",
  "description": "8 t?picos ? 36 perguntas",
  "prerequisiteWorldIds": [
    "mundo-1",
    "mundo-2",
    "mundo-3"
  ],
  "tasks": [
    {
      "id": "m7-t1",
      "title": "Economia e Emprego",
      "summary": "Na área de economia e emprego, Augusto Cury apresenta propostas voltadas ao **aumento da produção de alimentos, incentivo ao empreendedorismo e formação de profissionais em novas tecnologias**.\n\nUma das metas é **dobrar a produção de alimentos do Brasil ao longo da próxima década**, ampliando a capacidade produtiva do país nesse setor.\n\nNa área de empreendedorismo, Cury propõe criar **10 mil clubes de empreendedorismo em todo o país**, buscando ampliar espaços voltados ao desenvolvimento de iniciativas empreendedoras.\n\nTambém pretende investir na **formação de especialistas em inteligência artificial e robótica**, preparando profissionais para atuar nessas áreas tecnológicas.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Qual é a meta de Augusto Cury para a produção de alimentos no Brasil?",
          "options": [
            "Aumentar em 50% a produção de alimentos durante os próximos cinco anos",
            "Dobrar a produção de alimentos do Brasil ao longo da próxima década",
            "Triplicar a produção agrícola brasileira durante os próximos vinte anos",
            "Manter a produção atual e concentrar investimentos no aumento das exportações"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que Augusto Cury propõe para incentivar o empreendedorismo?",
          "options": [
            "Criar 10 mil clubes de empreendedorismo espalhados pelo país",
            "Criar 10 mil empresas públicas destinadas à contratação de novos empreendedores",
            "Implantar centros de empreendedorismo exclusivamente nas capitais brasileiras",
            "Criar programas de financiamento destinados apenas aos empreendedores do setor tecnológico"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Em quais áreas tecnológicas Augusto Cury pretende investir na formação de especialistas?",
          "options": [
            "Telecomunicações e desenvolvimento de equipamentos eletrônicos",
            "Computação em nuvem e desenvolvimento de aplicativos móveis",
            "Inteligência artificial e robótica",
            "Segurança cibernética e produção de semicondutores"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Qual conjunto melhor representa as propostas apresentadas para economia e emprego?",
          "options": [
            "Aumentar as importações de alimentos, criar empresas estatais e formar profissionais para o setor financeiro",
            "Expandir exclusivamente a produção industrial, criar centros comerciais e investir na formação de engenheiros",
            "Dobrar a produção de alimentos, criar 10 mil clubes de empreendedorismo e formar especialistas em IA e robótica",
            "Reduzir a produção agrícola, criar cooperativas públicas e concentrar a formação profissional no comércio exterior"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        }
      ]
    },
    {
      "id": "m7-t2",
      "title": "Saúde",
      "summary": "Na área da saúde, Augusto Cury apresenta uma proposta concentrada principalmente na **saúde mental e no atendimento às pessoas neurodivergentes pelo sistema público**.\n\nA proposta é estabelecer a **saúde mental como uma prioridade nacional**, dando maior atenção a essa área dentro das políticas públicas de saúde.\n\nCury também propõe garantir o **acolhimento de pessoas neurodivergentes no sistema público**, incorporando o atendimento a esse grupo dentro da prioridade destinada à saúde mental.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Qual área Augusto Cury propõe estabelecer como prioridade nacional?",
          "options": [
            "Saúde mental",
            "Saúde esportiva",
            "Saúde ocupacional",
            "Saúde alimentar"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Augusto Cury propõe em relação às pessoas neurodivergentes?",
          "options": [
            "Concentrar seu atendimento exclusivamente em instituições privadas especializadas",
            "Garantir seu acolhimento dentro do sistema público",
            "Criar um sistema separado do atendimento público de saúde",
            "Direcionar o atendimento apenas para programas realizados em escolas"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual alternativa melhor representa a proposta apresentada por Augusto Cury para a Saúde?",
          "options": [
            "Priorizar a expansão hospitalar e transferir o atendimento neurodivergente para instituições especializadas",
            "Concentrar os investimentos em medicamentos e criar uma rede privada destinada à saúde psicológica",
            "Estabelecer a saúde mental como prioridade nacional e acolher pessoas neurodivergentes no sistema público",
            "Criar uma política de saúde mental destinada exclusivamente às pessoas atendidas na rede educacional"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        }
      ]
    },
    {
      "id": "m7-t3",
      "title": "Educação",
      "summary": "Na área da educação, Augusto Cury propõe mudanças voltadas à **formação empreendedora, expansão do ensino técnico, inclusão de novas disciplinas, saúde emocional dos estudantes, capacitação de professores e incentivo à inovação nas universidades**.\n\nUma das propostas é criar **escolas voltadas à formação de empreendedores desde a Educação Básica**. Cury também pretende **expandir o ensino técnico e profissionalizante**, ampliando a formação direcionada ao mercado de trabalho e às profissões técnicas.\n\nNas escolas de tempo integral, propõe incluir no currículo aulas de **oratória, teatro, educação financeira, cooperativismo e empreendedorismo**. Também defende uma **reforma do Ensino Médio**, incluindo disciplinas como **gestão da emoção, educação financeira e inteligência artificial**.\n\nNa formação dos professores, Cury pretende promover capacitação para o acolhimento de estudantes com **autismo, TDAH, dislexia e altas habilidades**.\n\nOutra parte das propostas está relacionada à saúde emocional no ambiente escolar. O candidato pretende implementar programas de **gestão da emoção e prevenção da ansiedade, depressão, automutilação, bullying e violência escolar**.\n\nNo ensino superior, propõe **criar startups nas universidades**, incentivando iniciativas de empreendedorismo e inovação dentro dessas instituições.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Augusto Cury propõe para incentivar o empreendedorismo desde a Educação Básica?",
          "options": [
            "Criar escolas voltadas à formação de empreendedores desde a Educação Básica",
            "Concentrar a formação empreendedora exclusivamente nos cursos técnicos após o Ensino Médio",
            "Criar programas de empreendedorismo destinados somente aos estudantes das universidades públicas",
            "Oferecer formação empreendedora apenas para estudantes que já tenham iniciado uma atividade profissional"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Quais conteúdos Augusto Cury pretende incluir nas escolas de tempo integral?",
          "options": [
            "Programação, robótica, idiomas, administração pública e comércio exterior",
            "Oratória, teatro, educação financeira, cooperativismo e empreendedorismo",
            "Direito, contabilidade, psicologia, economia internacional e gestão empresarial",
            "Inteligência artificial, engenharia, marketing, matemática financeira e desenvolvimento de aplicativos"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que a proposta de reforma do Ensino Médio apresentada por Cury pretende incluir?",
          "options": [
            "Disciplinas como gestão da emoção, educação financeira e inteligência artificial",
            "Disciplinas como direito constitucional, empreendedorismo e programação avançada",
            "Conteúdos como robótica industrial, administração empresarial e comércio internacional",
            "Conteúdos como cooperativismo, contabilidade pública e desenvolvimento de startups"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Como Augusto Cury pretende melhorar o acolhimento de estudantes com diferentes necessidades educacionais?",
          "options": [
            "Criar escolas separadas exclusivamente para estudantes que apresentem dificuldades de aprendizagem",
            "Transferir o acompanhamento desses estudantes exclusivamente para profissionais externos às escolas",
            "Capacitar professores para acolher estudantes com autismo, TDAH, dislexia e altas habilidades",
            "Concentrar a capacitação dos professores exclusivamente no atendimento de estudantes com autismo"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Quais outras medidas fazem parte das propostas educacionais de Augusto Cury?",
          "options": [
            "Expandir o ensino técnico, desenvolver programas de saúde emocional e criar startups nas universidades",
            "Reduzir o ensino profissionalizante, concentrar programas emocionais no Ensino Médio e privatizar startups universitárias",
            "Substituir cursos técnicos por formação empreendedora, retirar programas emocionais e criar empresas públicas nas universidades",
            "Limitar o ensino técnico às universidades, criar programas exclusivamente contra o bullying e impedir startups acadêmicas"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m7-t4",
      "title": "Política e Corrupção",
      "summary": "Na área de política e administração pública, Augusto Cury propõe mudanças relacionadas ao **funcionamento do STF, sistema de governo, avaliação de servidores públicos e estrutura dos ministérios**.\n\nUma das propostas é promover uma **reforma do Supremo Tribunal Federal (STF)**, estabelecendo **mandatos fixos para os ministros**, em vez do modelo atual de permanência no cargo até a aposentadoria compulsória.\n\nCury também propõe promover a **transição do Brasil para o semipresidencialismo**, alterando o atual sistema presidencialista e dividindo funções de governo conforme esse novo modelo.\n\nNa administração pública, pretende estabelecer **indicadores para avaliar o desempenho dos servidores públicos**, utilizando critérios de desempenho para acompanhar sua atuação.\n\nEm relação à estrutura do governo federal, Cury propõe **criar o Ministério da Inteligência Artificial e Robótica**. Ao mesmo tempo, pretende **cortar entre 8 e 10 ministérios** da estrutura governamental.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Augusto Cury propõe em relação ao STF?",
          "options": [
            "Ampliar o número de ministros e manter os atuais critérios de permanência no cargo",
            "Promover uma reforma do STF e estabelecer mandatos fixos para seus ministros",
            "Transferir as atribuições do STF para uma nova instituição vinculada ao Congresso Nacional",
            "Manter a atual estrutura do STF e modificar exclusivamente o processo de escolha dos ministros"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual mudança Augusto Cury propõe para o sistema de governo brasileiro?",
          "options": [
            "Transformar o Brasil em um sistema parlamentarista sem a existência do cargo de presidente",
            "Manter o presidencialismo e ampliar os poderes administrativos dos governos estaduais",
            "Promover a transição do atual sistema brasileiro para o semipresidencialismo",
            "Criar um sistema presidencialista no qual o Congresso tenha apenas funções fiscalizadoras"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Como Augusto Cury pretende avaliar o desempenho dos servidores públicos?",
          "options": [
            "Por meio de indicadores utilizados para acompanhar e avaliar seu desempenho",
            "Exclusivamente por avaliações realizadas diretamente pelos ministros de cada área",
            "Por meio de eleições periódicas realizadas entre os funcionários de cada órgão público",
            "Exclusivamente pela quantidade de anos trabalhados dentro da administração pública"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Qual ministério Augusto Cury propõe criar?",
          "options": [
            "Ministério do Empreendedorismo e Desenvolvimento Tecnológico",
            "Ministério da Educação Financeira e Desenvolvimento Digital",
            "Ministério da Ciência, Automação e Empreendedorismo",
            "Ministério da Inteligência Artificial e Robótica"
          ],
          "correctIndex": 3,
          "explanation": "Resposta correta: D"
        },
        {
          "prompt": "O que Cury propõe em relação à quantidade de ministérios?",
          "options": [
            "Manter a quantidade atual e criar apenas um novo ministério dedicado à tecnologia",
            "Cortar entre 8 e 10 ministérios, além de criar o Ministério da Inteligência Artificial e Robótica",
            "Reduzir pela metade todos os ministérios e transferir suas funções para governos estaduais",
            "Criar entre 8 e 10 novos ministérios especializados em tecnologia e administração pública"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        }
      ]
    },
    {
      "id": "m7-t5",
      "title": "Meio Ambiente",
      "summary": "Na área de meio ambiente, Augusto Cury apresenta propostas voltadas ao **combate a incêndios, compensação ambiental, fiscalização, educação ambiental e desenvolvimento sustentável da Amazônia**.\n\nUma das propostas é criar um **sistema nacional de monitoramento e combate a incêndios**, utilizando **satélites, inteligência artificial e drones**, além de integrar a atuação da União e dos Estados.\n\nCury também propõe um **programa de compensação ambiental**, com créditos auditados, reflorestamento rastreável e incentivos para empresas que neutralizem suas emissões.\n\nNa fiscalização, pretende criar **comitês de proteção e fiscalização ambiental**, responsáveis por acompanhar recursos e contratos, ampliar a transparência e permitir a participação da sociedade civil.\n\nOutra proposta é realizar uma **campanha nacional de educação e conscientização ambiental**, com ações em escolas, meios de comunicação, plataformas digitais e comunidades.\n\nPara a Amazônia, Cury propõe criar o **Programa Amazônia Viva**, apoiando atividades como **bioeconomia, pesca sustentável, artesanato e turismo ecológico**. O programa também incluiria capacitação de ribeirinhos e investimentos em infraestrutura básica nas cidades amazônicas.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Como Augusto Cury propõe melhorar o monitoramento e o combate aos incêndios?",
          "options": [
            "Criar um sistema nacional com satélites, inteligência artificial, drones e integração entre União e Estados",
            "Concentrar o monitoramento exclusivamente nos governos estaduais e utilizar imagens fornecidas por empresas privadas",
            "Criar unidades federais de combate a incêndios sem utilizar sistemas tecnológicos de monitoramento ambiental",
            "Transferir o monitoramento aos municípios e utilizar exclusivamente equipes terrestres para identificar novos incêndios"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que está previsto no programa de compensação ambiental proposto por Cury?",
          "options": [
            "Cobrança de novos impostos ambientais, fiscalização municipal e financiamento público para empresas poluidoras",
            "Créditos auditados, reflorestamento rastreável e incentivos para empresas que neutralizem suas emissões",
            "Proibição de emissões industriais, reflorestamento obrigatório e substituição das atividades econômicas mais poluentes",
            "Créditos administrados pelos estados, reflorestamento voluntário e incentivos destinados exclusivamente ao agronegócio"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual seria uma das funções dos comitês de proteção e fiscalização ambiental?",
          "options": [
            "Administrar diretamente empresas envolvidas em atividades relacionadas aos recursos naturais",
            "Substituir os órgãos estaduais e assumir integralmente o licenciamento ambiental brasileiro",
            "Monitorar recursos e contratos, ampliar a transparência e permitir participação da sociedade civil",
            "Concentrar decisões ambientais no governo federal e limitar a participação de organizações da sociedade"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Como funcionaria a campanha nacional de educação e conscientização ambiental?",
          "options": [
            "Seria concentrada exclusivamente nas escolas públicas e destinada aos estudantes da Educação Básica",
            "Utilizaria escolas, meios de comunicação, plataformas digitais e comunidades para promover conscientização ambiental",
            "Seria realizada principalmente por empresas privadas e direcionada aos trabalhadores de setores industriais",
            "Utilizaria apenas plataformas digitais e campanhas governamentais direcionadas às grandes cidades brasileiras"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "O que o Programa Amazônia Viva pretende promover?",
          "options": [
            "Bioeconomia, pesca sustentável, artesanato, turismo ecológico, capacitação de ribeirinhos e infraestrutura básica",
            "Expansão industrial, mineração sustentável, grandes rodovias, capacitação empresarial e urbanização das comunidades",
            "Agricultura intensiva, exploração energética, turismo internacional, industrialização e transferência de comunidades",
            "Preservação integral sem atividades econômicas, restrição do turismo e redução dos investimentos nas cidades amazônicas"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m7-t6",
      "title": "Programas Sociais e Direitos Humanos",
      "summary": "Na área de programas sociais e direitos humanos, Augusto Cury apresenta propostas voltadas à **reformulação do Bolsa Família e à ampliação da inclusão produtiva de famílias em situação de vulnerabilidade**.\n\nUma das propostas é **reformular o Bolsa Família** para que beneficiários que consigam um emprego formal ou abram uma microempresa não sejam penalizados por essa mudança de situação. Segundo a proposta, essas pessoas passariam a contar com **incentivos e acesso a juros mais baixos**, buscando facilitar sua transição para novas fontes de renda.\n\nCury também propõe **ampliar programas de inclusão produtiva** destinados às famílias em situação de vulnerabilidade. A intenção é ampliar o acesso dessas famílias a **renda, capacitação e oportunidades de ascensão social**.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Augusto Cury propõe para beneficiários do Bolsa Família que consigam um emprego formal?",
          "options": [
            "Retirar imediatamente qualquer benefício e impedir temporariamente o acesso a outros programas sociais",
            "Evitar que sejam punidos pela mudança e oferecer incentivos e acesso a juros mais baixos",
            "Manter permanentemente o mesmo valor do benefício independentemente da nova renda obtida",
            "Transferir automaticamente essas pessoas para programas públicos obrigatórios de capacitação profissional"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Como a proposta trata beneficiários que decidam abrir uma microempresa?",
          "options": [
            "Prevê incentivos e juros mais baixos, evitando que sejam penalizados por iniciar a atividade",
            "Determina a saída imediata do programa e a cobrança de taxas específicas sobre a nova empresa",
            "Permite a abertura da empresa somente após o encerramento definitivo de qualquer benefício social",
            "Oferece financiamento exclusivamente para empresas abertas coletivamente por vários beneficiários"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Augusto Cury pretende ampliar para famílias em situação de vulnerabilidade?",
          "options": [
            "Programas de contratação obrigatória destinados exclusivamente ao serviço público federal",
            "Programas de transferência de renda sem medidas relacionadas à capacitação ou ao trabalho",
            "Programas de inclusão produtiva com acesso a renda, capacitação e oportunidades de ascensão social",
            "Programas de financiamento empresarial destinados exclusivamente às famílias que já possuem negócios"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Qual alternativa melhor representa as propostas apresentadas nessa área?",
          "options": [
            "Reformular o Bolsa Família para incentivar quem consegue emprego ou empreende e ampliar programas de inclusão produtiva",
            "Substituir o Bolsa Família por programas de emprego obrigatório e restringir incentivos à criação de microempresas",
            "Manter as atuais regras do Bolsa Família e concentrar os novos programas exclusivamente na transferência de renda",
            "Encerrar benefícios após a obtenção de emprego e direcionar os recursos economizados para programas empresariais"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        }
      ]
    },
    {
      "id": "m7-t7",
      "title": "Política Externa",
      "summary": "Na área de política externa, Augusto Cury propõe uma atuação internacional **ativa, equilibrada e pragmática**, baseada no diálogo, na cooperação internacional e na defesa da soberania nacional.\n\nUma das propostas é **modernizar a atuação das embaixadas brasileiras**, estabelecendo metas relacionadas à abertura de novos mercados, atração de investimentos estrangeiros e apoio aos exportadores brasileiros.\n\nCury também pretende **expandir acordos comerciais estratégicos com diferentes blocos econômicos**, buscando diversificar os mercados disponíveis para o Brasil e reduzir dependências externas.\n\nNas questões ambientais, propõe **ampliar a participação brasileira nas negociações internacionais sobre clima e meio ambiente**, dando atenção especial à **Amazônia e à biodiversidade brasileira**.\n\nOutra proposta é fortalecer a **cooperação com países em desenvolvimento** em áreas como tecnologia, energia, educação e infraestrutura.\n\nAlém disso, Cury pretende **treinar embaixadores para atuarem como influenciadores no exterior**, utilizando sua atuação internacional para promover a imagem do Brasil e, nas palavras da proposta, **“vender o Brasil melhor”**.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "Como Augusto Cury define a política externa que pretende adotar?",
          "options": [
            "Uma política ativa, equilibrada e pragmática, baseada no diálogo, cooperação internacional e defesa da soberania",
            "Uma política concentrada na aproximação com um único grupo de países e na redução das relações multilaterais",
            "Uma política baseada principalmente no isolamento econômico e na diminuição da participação em acordos internacionais",
            "Uma política direcionada exclusivamente ao comércio internacional, sem atuação brasileira em questões políticas globais"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Augusto Cury propõe para modernizar a atuação das embaixadas?",
          "options": [
            "Concentrar suas atividades exclusivamente na prestação de serviços aos brasileiros residentes no exterior",
            "Estabelecer metas de abertura de mercados, atração de investimentos e apoio aos exportadores brasileiros",
            "Transferir as funções comerciais das embaixadas para empresas privadas especializadas em comércio exterior",
            "Reduzir a atuação econômica das embaixadas e concentrar seus trabalhos exclusivamente nas relações diplomáticas"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual é o objetivo da expansão de acordos comerciais estratégicos?",
          "options": [
            "Concentrar o comércio brasileiro em poucos parceiros para facilitar as negociações internacionais",
            "Priorizar exclusivamente acordos com países em desenvolvimento e abandonar os demais mercados internacionais",
            "Diversificar mercados e reduzir dependências externas por meio de acordos com diferentes blocos econômicos",
            "Substituir acordos comerciais multilaterais por negociações realizadas exclusivamente com países da América Latina"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        },
        {
          "prompt": "Como Augusto Cury pretende ampliar a atuação internacional do Brasil nas áreas ambiental e de desenvolvimento?",
          "options": [
            "Participar das negociações climáticas e limitar a cooperação tecnológica aos países mais desenvolvidos",
            "Ampliar negociações sobre clima, com foco na Amazônia e biodiversidade, e fortalecer a cooperação com países em desenvolvimento",
            "Concentrar as negociações ambientais exclusivamente na Amazônia e reduzir acordos internacionais nas áreas de tecnologia e energia",
            "Transferir as negociações ambientais para organizações internacionais e priorizar apenas acordos brasileiros de infraestrutura"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Qual papel adicional Augusto Cury propõe para os embaixadores brasileiros?",
          "options": [
            "Atuar exclusivamente na negociação de tratados políticos entre o Brasil e outros governos",
            "Administrar diretamente campanhas comerciais realizadas por empresas brasileiras em outros países",
            "Atuar como influenciadores no exterior para promover melhor o Brasil internacionalmente",
            "Substituir representantes de empresas privadas nas negociações comerciais realizadas no exterior"
          ],
          "correctIndex": 2,
          "explanation": "Resposta correta: C"
        }
      ]
    },
    {
      "id": "m7-t8",
      "title": "Segurança Pública",
      "summary": "Na área de segurança pública, Augusto Cury apresenta propostas voltadas à **integração das forças de segurança, combate ao crime organizado, utilização de novas tecnologias, fortalecimento dos agentes de segurança, reforma do sistema penitenciário e combate à violência contra a mulher**.\n\nUma das propostas é **recriar o Ministério da Segurança Pública** e ampliar a integração entre as diferentes forças de segurança. Cury também pretende fortalecer o combate ao **crime organizado e às estruturas financeiras das facções**, buscando atingir não apenas suas atividades criminosas, mas também suas fontes e movimentações de recursos.\n\nNa área tecnológica, propõe ampliar o uso de **inteligência artificial, drones, câmeras e análise de dados** nas políticas de segurança pública.\n\nOutra medida é criar o **Programa FATO**, destinado a integrar, treinar e equipar as forças policiais. Cury também propõe melhorar as **condições de trabalho, formação e equipamentos dos agentes de segurança**.\n\nNo combate ao crime organizado internacional, pretende fortalecer a **cooperação com outros países e o controle das fronteiras brasileiras**.\n\nPara o sistema penitenciário, propõe uma reforma baseada em **segurança, educação, trabalho e ressocialização** das pessoas privadas de liberdade.\n\nNo combate à violência contra a mulher, Cury pretende criar um **aplicativo com botão de alerta georreferenciado**, além de implementar um sistema que utilize **drones** para auxiliar nesse tipo de ocorrência.",
      "explanation": "",
      "deepContent": "",
      "keyConcepts": [],
      "examples": [],
      "sequential": true,
      "questions": [
        {
          "prompt": "O que Augusto Cury propõe para melhorar a integração das forças de segurança?",
          "options": [
            "Recriar o Ministério da Segurança Pública e ampliar a integração entre as forças de segurança",
            "Transferir toda a segurança pública para os estados e reduzir a participação do governo federal",
            "Criar uma força policial nacional responsável por substituir progressivamente as polícias estaduais",
            "Concentrar as operações de segurança nas Forças Armadas e reduzir a participação das forças policiais"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Como Cury pretende fortalecer o combate ao crime organizado?",
          "options": [
            "Concentrar as operações exclusivamente na prisão das lideranças e reduzir o controle das fronteiras",
            "Combater as facções e suas estruturas financeiras, fortalecendo também a cooperação internacional e o controle das fronteiras",
            "Priorizar exclusivamente crimes financeiros e transferir o combate às facções para os governos estaduais",
            "Concentrar os recursos no policiamento das grandes cidades e reduzir operações relacionadas às fronteiras brasileiras"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        },
        {
          "prompt": "Quais tecnologias Augusto Cury pretende ampliar na segurança pública?",
          "options": [
            "Inteligência artificial, drones, câmeras e análise de dados",
            "Robôs autônomos, reconhecimento de voz, satélites e veículos militares",
            "Inteligência artificial, satélites, equipamentos militares e sistemas bancários",
            "Drones, robôs industriais, reconhecimento de voz e plataformas comerciais"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "Qual é a proposta relacionada às forças policiais e aos agentes de segurança?",
          "options": [
            "Criar o Programa FATO para integrar, treinar e equipar as forças policiais e melhorar as condições dos agentes",
            "Criar o Programa FATO exclusivamente para substituir equipamentos antigos utilizados pelas forças policiais",
            "Transferir a formação policial para instituições privadas e criar um programa nacional de contratação de agentes",
            "Unificar todas as carreiras policiais e substituir os programas atuais de treinamento por formação exclusivamente tecnológica"
          ],
          "correctIndex": 0,
          "explanation": "Resposta correta: A"
        },
        {
          "prompt": "O que Augusto Cury propõe para o sistema penitenciário e para o combate à violência contra a mulher?",
          "options": [
            "Reformar o sistema penitenciário com foco apenas na segurança e criar novas delegacias especializadas para mulheres",
            "Reformar os presídios com foco em segurança, educação, trabalho e ressocialização, além de criar aplicativo de alerta georreferenciado e utilizar drones contra a violência à mulher",
            "Ampliar exclusivamente o número de presídios e criar um aplicativo destinado apenas ao registro posterior de ocorrências de violência",
            "Transferir a administração penitenciária aos estados e utilizar exclusivamente câmeras para combater casos de violência contra a mulher"
          ],
          "correctIndex": 1,
          "explanation": "Resposta correta: B"
        }
      ]
    }
  ]
}
];

export const getWorldById = (id: string) => worlds.find((world) => world.id === id);
export const allTasks = worlds.flatMap((world) => world.tasks.map((task) => ({ ...task, worldId: world.id, worldName: world.name })));

export const getTaskById = (taskId: string) => allTasks.find((task) => task.id === taskId) ?? null;
