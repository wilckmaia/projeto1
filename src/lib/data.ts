export type Question = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Task = {
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
            options: ["A maioria parlamentar pode alterar qualquer regra sem limitações", "A legitimidade eleitoral torna desnecessário o controle constitucional", "Mesmo governos eleitos estão submetidos aos limites estabelecidos pela Constituição", "Direitos constitucionais dependem exclusivamente da popularidade da medida"],
            correctIndex: 2,
            explanation: "Resposta correta: C. A legitimidade eleitoral não autoriza a eliminação de direitos fundamentais; o poder público continua submetido aos limites constitucionais."
          },
          {
            prompt: "No debate político brasileiro, grupos frequentemente defendem mudanças na Constituição. Isso demonstra que a Constituição de 1988:",
            options: ["É completamente imutável", "Pode ser modificada por procedimentos específicos, embora existam limitações constitucionais ao poder de reforma", "Pode ser alterada diretamente pelo presidente", "Só pode ser modificada por referendo"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Constituições são normas jurídicas que podem ser alteradas, mas apenas por meio de processos e limites estabelecidos no próprio texto constitucional."
          },
          {
            prompt: "Quando liberdade de expressão e proteção de outros direitos fundamentais entram em tensão, qual interpretação é mais adequada?",
            options: ["Nenhum direito fundamental possui limites", "A liberdade de expressão pode ser simplesmente abolida pelo governo", "Direitos fundamentais podem exigir ponderação e aplicação conforme os limites constitucionais", "O Executivo possui sempre a interpretação final"],
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
            options: ["Governar ignorando o Congresso por possuir maioria popular", "Construir uma coalizão parlamentar com outros partidos", "Convocar automaticamente novas eleições legislativas", "Transferir ao STF a aprovação dos projetos"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Em um sistema multipartidário, sem maioria legislativa, o presidente depende de negociações e de alianças para obter apoio para sua agenda."
          },
          {
            prompt: "Críticos argumentam que grandes coalizões podem aumentar negociações por ministérios, emendas e influência política. Defensores respondem que coalizões:",
            options: ["São necessariamente ilegais", "Podem ser necessárias para produzir maiorias governativas em um sistema partidário fragmentado", "Eliminam completamente conflitos entre Executivo e Legislativo", "Tornam as eleições desnecessárias"],
            correctIndex: 1,
            explanation: "Resposta correta: B. As coalizões podem facilitar o funcionamento do governo em sistemas fragmentados e contribuírem para a governabilidade das maiorias."
          },
          {
            prompt: "Um Congresso muito fragmentado tende a tornar a governabilidade presidencial:",
            options: ["Necessariamente impossível", "Independente dos partidos", "Mais dependente de negociação e formação de maiorias parlamentares", "Exclusivamente controlada pelo Judiciário"],
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
            options: ["Apenas democracia versus autoritarismo", "Redistribuição, eficiência econômica e justiça tributária", "Separação entre Executivo e Judiciário", "Sistemas eleitorais"],
            correctIndex: 1,
            explanation: "Resposta correta: B. A tributação implica escolhas sobre redistribuição, impacto econômico e critérios de justiça, sendo uma questão central da economia política."
          },
          {
            prompt: "Um político afirma que “reduzir impostos sempre aumenta a arrecadação”. Qual análise é mais adequada?",
            options: ["A afirmação é necessariamente verdadeira", "A afirmação é necessariamente falsa em qualquer circunstância", "O resultado depende, entre outros fatores, das alíquotas existentes e da resposta da atividade econômica e dos contribuintes", "Impostos não possuem relação com arrecadação"],
            correctIndex: 2,
            explanation: "Resposta correta: C. A relação entre tributos e arrecadação depende de alíquotas, comportamento econômico e efeitos sobre a produção, os preços e a base tributária."
          },
          {
            prompt: "Dois grupos defendem respectivamente maior participação estatal e maior participação do mercado na economia. Esse conflito envolve principalmente diferentes posições sobre:",
            options: ["Como recursos devem ser alocados e quais funções Estado e mercado devem desempenhar", "Se eleições deveriam existir", "Quantos estados o Brasil deveria possuir", "Quem interpreta a Constituição"],
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
            options: ["Estimular a atividade econômica durante a desaceleração", "Diminuir necessariamente a dívida imediatamente", "Reduzir automaticamente a inflação", "Eliminar a necessidade de impostos"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Em recessão, maior gasto público pode aumentar demanda agregada e estimular a atividade econômica, mesmo que o déficit aumente temporariamente."
          },
          {
            prompt: "Um país mantém déficits elevados durante muitos anos. Qual preocupação pode surgir?",
            options: ["A dívida pública pode crescer e aumentar as restrições fiscais futuras", "O déficit necessariamente desaparece sozinho", "O país automaticamente deixa de possuir moeda", "O Legislativo deixa de funcionar"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Déficits persistentes podem aumentar a dívida pública e criar restrições futuras para investimentos e estabilidade fiscal."
          },
          {
            prompt: "Por que o debate entre aumentar gastos e controlar o déficit não possui uma resposta simples?",
            options: ["Porque déficits nunca importam", "Porque gastos públicos não afetam a economia", "Porque existem trade-offs entre estímulo econômico, prioridades públicas e sustentabilidade fiscal", "Porque somente bancos decidem o orçamento público"],
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
            options: ["Competição entre diferentes grupos pela influência sobre decisões públicas", "Necessariamente corrupção", "O fim da democracia representativa", "A inexistência de elites"],
            correctIndex: 0,
            explanation: "Resposta correta: A. O pluralismo vê a política como um campo em que diferentes grupos competem pela influência sobre decisões públicas."
          },
          {
            prompt: "Uma crítica das teorias elitistas ao pluralismo é que:",
            options: ["Todos os grupos possuem exatamente os mesmos recursos para influenciar decisões", "Alguns grupos podem possuir muito mais dinheiro, organização, informação e acesso aos tomadores de decisão", "Grupos econômicos nunca possuem influência política", "Somente eleitores individuais influenciam governos"],
            correctIndex: 1,
            explanation: "Resposta correta: B. A crítica elitista aponta que nem todos os grupos têm igualdade de recursos e acesso, o que afeta sua capacidade de influenciar decisões públicas."
          },
          {
            prompt: "Qual situação diferencia melhor lobby de corrupção?",
            options: ["Lobby e corrupção são necessariamente sinônimos", "Defender interesses perante autoridades pode ser uma atividade legítima; corrupção envolve práticas ilícitas ou abuso de poder para obter vantagens indevidas", "Lobby existe apenas quando dinheiro é entregue ilegalmente", "Corrupção é permitida quando realizada por grupos de interesse"],
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
            options: ["Necessariamente os milhões de cidadãos", "O grupo menor e mais diretamente afetado pode ter incentivos maiores para se organizar", "Nenhum dos dois", "Apenas funcionários públicos podem se organizar"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Um grupo pequeno e diretamente afetado tende a ter mais incentivos para se organizar, pois o custo individual da ação coletiva é menor e o impacto direto é maior."
          },
          {
            prompt: "Todos os trabalhadores de determinado setor podem se beneficiar de uma conquista coletiva, inclusive aqueles que não participaram de sua obtenção. Isso pode gerar:",
            options: ["Captura regulatória", "Judicialização", "Problema do free rider", "Federalismo"],
            correctIndex: 2,
            explanation: "Resposta correta: C. O free rider surge quando alguém se beneficia de um resultado coletivo sem contribuir para sua obtenção ou manutenção."
          },
          {
            prompt: "Qual mecanismo pode ajudar grupos a superar problemas de ação coletiva?",
            options: ["Criar incentivos para participação e mecanismos de coordenação", "Aumentar indefinidamente o número de participantes", "Impedir qualquer liderança", "Garantir benefícios independentemente da participação em todas as situações"],
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
            options: ["Federalismo", "Captura regulatória", "Pluralismo", "Judicialização"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Captura regulatória ocorre quando atores regulados influenciam ou controlam a agência reguladora em benefício próprio, em vez do interesse público."
          },
          {
            prompt: "Um governante distribui cargos públicos principalmente com base em relações pessoais e utiliza estruturas estatais como extensão de seus interesses particulares. O conceito mais relacionado é:",
            options: ["Patrimonialismo", "Liberalismo", "Federalismo fiscal", "Representação proporcional"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Patrimonialismo designa a lógica em que a administração pública é tratada como extensão privada da vontade pessoal do governante ou de grupos ligados a ele."
          },
          {
            prompt: "Por que simplesmente aumentar penas não necessariamente elimina a corrupção?",
            options: ["Porque corrupção não pode ser combatida", "Porque incentivos, probabilidade de detecção, transparência e qualidade institucional também influenciam o comportamento", "Porque penas não fazem parte das instituições", "Porque corrupção existe apenas em democracias"],
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
            options: ["Autoritarismo", "Accountability", "Patrimonialismo", "Presidencialismo absoluto"],
            correctIndex: 1,
            explanation: "Resposta correta: B. Accountability reúne mecanismos de fiscalização, transparência e responsabilização por decisões públicas."
          },
          {
            prompt: "Existe um possível dilema quando instituições de controle recebem muito poder e pouca fiscalização sobre suas próprias decisões. Qual é ele?",
            options: ["Controladores também precisam estar sujeitos a mecanismos de accountability", "Instituições fiscalizadoras devem possuir poder ilimitado", "Fiscalização e democracia são incompatíveis", "Somente o Executivo pode fiscalizar o Estado"],
            correctIndex: 0,
            explanation: "Resposta correta: A. Mesmo instituições de controle precisam estar sujeitas a limites e mecanismos de fiscalização para evitar concentração de poder sem responsabilização."
          },
          {
            prompt: "Um governo eleito argumenta: “Recebemos milhões de votos, portanto instituições de controle não deveriam impedir nossas decisões.” Qual resposta melhor corresponde a uma democracia constitucional?",
            options: ["Correto, porque eleições concedem poderes ilimitados", "Incorreto, porque legitimidade eleitoral convive com limites constitucionais e mecanismos de controle", "Correto somente quando o presidente possui maioria no Congresso", "Incorreto porque instituições de controle devem governar no lugar dos eleitos"],
            correctIndex: 1,
            explanation: "Resposta correta: B. A legitimidade eleitoral é importante, mas não elimina limites constitucionais nem a necessidade de mecanismos de transparência e controle institucional."
          }
        ]
      }
    ]
  }
];

export const getWorldById = (id: string) => worlds.find((world) => world.id === id);
export const allTasks = worlds.flatMap((world) => world.tasks.map((task) => ({ ...task, worldId: world.id, worldName: world.name })));

export const getTaskById = (taskId: string) => allTasks.find((task) => task.id === taskId) ?? null;
