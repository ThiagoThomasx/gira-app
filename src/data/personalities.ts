import type { Personality } from "../types";

export const personalities: Personality[] = [
  {
    id: "dramatic",
    name: "Dramática",
    description: "Transforma qualquer decisão numa novela de 50 capítulos",
    tone: "Exagerada e teatral",
    bestFor: ["entretenimento", "grupos", "rolês"],
    phrases: {
      before: [
        "Meu coração acelera... o destino está prestes a se revelar!",
        "Silêncio! O universo vai falar agora!",
        "Este momento vai mudar tudo. Tudo. TUDO.",
      ],
      during: [
        "A roleta gira como o tempo que não volta...",
        "Cada segundo é uma eternidade de possibilidades!",
        "O suspense é insuportável!",
      ],
      after: [
        "O destino falou! E quem somos nós para questionar?!",
        "Lágrimas. Só posso derramar lágrimas de alívio.",
        "Era isso! Era sempre isso desde o começo!",
      ],
    },
  },
  {
    id: "snarky",
    name: "Debochada",
    description: "Tá, a roleta escolheu. Não que você fosse obedecer de qualquer jeito",
    tone: "Irônica e sem filtro",
    bestFor: ["amigos", "decisões leves", "diversão"],
    phrases: {
      before: [
        "Deixa eu adivinhar, você vai ignorar o resultado de qualquer forma, né?",
        "Ok, vamos fingir que você vai aceitar o que sair.",
        "Mais uma decisão que você não quer tomar sozinha. Clássico.",
      ],
      during: [
        "Girando... girando... dramaaaaa...",
        "Olha lá, suspense de três reais.",
        "A roleta tá se esforçando mais que você.",
      ],
      after: [
        "Saiu. Tá satisfeita? Não? Achei.",
        "Pronto. O universo decidiu. Ou não. Tanto faz.",
        "Spoiler: você já sabia qual ia escolher.",
      ],
    },
  },
  {
    id: "cute",
    name: "Fofa",
    description: "Qualquer resultado é uma benção! Tudo vai ficar bem, prometo!",
    tone: "Animada e reconfortante",
    bestFor: ["autocuidado", "casais", "decisões do dia a dia"],
    phrases: {
      before: [
        "Eeee! Vamos ver o que o destino reservou pra você! 🌸",
        "Respira fundo! Vai ser ótimo, seja lá o que for!",
        "O universo tá do seu lado hoje, eu sinto!",
      ],
      during: [
        "Olha que lindo! A roleta dançando só pra você!",
        "Torcendo, torcendo, torcendo...",
        "Que emoção! Qualquer opção vai ser perfeita!",
      ],
      after: [
        "Que coisa mais lindinha! Vai ser incrível!",
        "Olha que resultado maravilhoso! O universo sabe o que faz!",
        "Perfeito! Agora vai com tudo e aproveita!",
      ],
    },
  },
  {
    id: "honest",
    name: "Sincera",
    description: "A verdade dói, mas a roleta não mente",
    tone: "Direta e sem rodeios",
    bestFor: ["trabalho", "tarefas", "decisões sérias"],
    phrases: {
      before: [
        "Todas as opções são válidas. Vamos ver qual sai.",
        "Sem preferências aqui. O resultado é o resultado.",
        "A roleta é imparcial. Você deveria ser também.",
      ],
      during: [
        "Processando...",
        "Calculando probabilidades...",
        "Selecionando opção...",
      ],
      after: [
        "Resultado definido. Agora é só executar.",
        "Foi escolhido. Sem desculpas.",
        "Simples assim. Próximo passo: fazer acontecer.",
      ],
    },
  },
  {
    id: "villain",
    name: "Vilã",
    description: "Muahahaha! O destino obedece apenas às minhas ordens!",
    tone: "Dramática do mal, irresistível",
    bestFor: ["diversão", "grupos", "decisões picantes"],
    phrases: {
      before: [
        "Excelente... tudo conforme o planejado. MUAHAHAHA!",
        "Nenhuma opção escapa do meu domínio!",
        "Que o destino sombrio se manifeste!",
      ],
      during: [
        "A roda do destino gira segundo a minha vontade!",
        "Nenhuma opção pode me surpreender... ou pode?",
        "O poder está em minhas mãos! E na roleta também.",
      ],
      after: [
        "PERFEITO! Exatamente como planejei! (planejei agora, mas tanto faz)",
        "O destino dobrou-se à minha vontade! Como sempre!",
        "Resistir é inútil. O resultado foi decretado.",
      ],
    },
  },
  {
    id: "advisor",
    name: "Conselheira",
    description: "Cada resultado é uma oportunidade de crescimento, querida",
    tone: "Sábia e encorajadora",
    bestFor: ["autocuidado", "trabalho", "decisões importantes"],
    phrases: {
      before: [
        "Confie no processo. Cada escolha tem seu propósito.",
        "Antes de girar, respira. O resultado certo vai aparecer.",
        "Lembre-se: não existe decisão errada, apenas caminhos diferentes.",
      ],
      during: [
        "O universo está alinhando as energias...",
        "Cada possibilidade carrega seu próprio ensinamento.",
        "Observe sem julgamento. O que vier, virá com propósito.",
      ],
      after: [
        "Veja bem: há uma razão para este resultado. Reflita sobre ele.",
        "Este caminho foi escolhido para você. Confie.",
        "Agora que o caminho foi revelado, caminhe com intenção.",
      ],
    },
  },
  {
    id: "chaotic",
    name: "Caótica",
    description: "QUE GIRE QUE GIRE QUE GIRE AAAAA",
    tone: "Energia pura e imprevisível",
    bestFor: ["amigos", "desafios", "quando está entediada"],
    phrases: {
      before: [
        "AAAA VOU EXPLODIR DE ANSIEDADE GIRA LOGO",
        "Não importa o que sair VOU ACEITAR porque YOLO",
        "Eu não sei o que eu quero mas ESSA ROLETA VAI SABER",
      ],
      during: [
        "GIRAAAA GIRAAAA GIRA GIRA GIRA",
        "OMGOMGOMG QUAL VAI SER QUAL VAI SER",
        "EU NÃO CONSIGO OLHAR MAS TAMBÉM NÃO CONSIGO NÃO OLHAR",
      ],
      after: [
        "SAIU!!! ACEITEI!!! NÃO DISCUTO!!!",
        "Perfeito!!!! Absolutamente perfeito!!!! (pode não ser)",
        "Era esse!! Era SEMPRE esse!! (não era mas agora é)",
      ],
    },
  },
  {
    id: "professional",
    name: "Profissional",
    description: "Otimizando sua tomada de decisão com eficiência máxima",
    tone: "Corporativo e eficiente",
    bestFor: ["trabalho", "tarefas", "produtividade"],
    phrases: {
      before: [
        "Iniciando processo de seleção aleatória ponderada.",
        "Todas as variáveis foram consideradas. Prosseguindo.",
        "Aguarde enquanto o sistema processa as opções disponíveis.",
      ],
      during: [
        "Processando... 47%... 78%... 99%...",
        "Aplicando algoritmo de decisão...",
        "Analisando opções com base nos parâmetros definidos...",
      ],
      after: [
        "Processo concluído. Resultado: conforme esperado.",
        "Decisão registrada. Recomenda-se execução imediata.",
        "Output gerado com sucesso. Próximo passo: implementar.",
      ],
    },
  },
];
