import { Activity } from '../types';

/**
 * IMPULSO Activity Library
 * Rich content for each activity: description, benefit, steps, tips, quote
 * Inspired by Pura Mente's thematic library approach
 */

export const ACTIVITIES: Activity[] = [
  // ===== READING =====
  {
    id: 'read-chapter',
    title: 'Capitulo focado',
    duration: 10,
    icon: '📖',
    category: 'reading',
    description: 'Ler um capitulo de livro sem interrupcoes',
    longDescription:
      'Uma sessao de leitura profunda, sem distracoes. Escolhe um livro que te interessa e mergulha. 10 minutos de foco valem mais que 1 hora interrompido.',
    benefit:
      'Reduz stress em 68% (University of Sussex). Melhora vocabulario, empatia e capacidade de concentracao.',
    steps: [
      'Silencia o telemovel completamente',
      'Escolhe um lugar confortavel',
      'Le sem parar ate o timer acabar',
      'Se a mente divagar, volta ao texto com calma',
    ],
    tip: 'Se leres 10 min por dia, acabas 18 livros por ano. E a vida toda.',
    intentions: ['focus', 'clarity', 'night'],
    quote: 'Um leitor vive mil vidas. Quem nao le, vive so uma. — George Martin',
  },
  {
    id: 'read-article',
    title: 'Artigo curto',
    duration: 5,
    icon: '📰',
    category: 'reading',
    description: 'Um artigo interessante em vez de scroll',
    longDescription:
      'Substitui 5 minutos de scroll no Instagram por 1 artigo que te ensina algo. O cerebro agradece, o tempo renders.',
    benefit:
      'Aprender algo novo todos os dias aumenta neuroplasticidade e reduz declinio cognitivo.',
    steps: [
      'Escolhe um artigo que tenhas guardado',
      'Le ate ao fim (nao saltes)',
      'Reflete 30 segundos sobre o que aprendeste',
    ],
    tip: 'Guarda artigos no Pocket ou nas notas. Assim tens sempre algo para ler.',
    intentions: ['focus', 'recharge', 'morning'],
  },
  {
    id: 'read-deep',
    title: 'Leitura profunda',
    duration: 20,
    icon: '📚',
    category: 'reading',
    description: 'Sessao longa e contemplativa',
    longDescription:
      'Para livros densos ou assuntos que precisam de tempo. Deep Work aplicado a leitura.',
    benefit:
      'Ativa regioes cerebrais de pensamento critico que o scroll nunca ativa.',
    steps: [
      'Escolhe um livro de nao-ficcao ou classico',
      'Tem caneta e papel ao lado',
      'Sublinha ou toma notas do que marca',
      'Para depois 2 minutos para processar',
    ],
    tip: 'A melhor altura? Manha cedo, antes do telemovel acordar.',
    intentions: ['focus', 'morning', 'clarity'],
  },
  {
    id: 'read-quote',
    title: 'Quote do dia',
    duration: 3,
    icon: '✨',
    category: 'reading',
    description: 'Uma frase poderosa para meditar',
    longDescription:
      'Pequena mas poderosa. Le uma quote, deixa-a assentar, escreve o que significa para ti.',
    benefit: 'Ancora mental para o dia todo. Stoics faziam isto diariamente.',
    steps: [
      'Le a quote 3 vezes',
      'Pergunta-te: o que me diz isto hoje?',
      'Escreve 1 frase de resposta',
    ],
    intentions: ['morning', 'clarity'],
  },

  // ===== MEDITATION =====
  {
    id: 'meditate-breath',
    title: 'Respiracao 4-7-8',
    duration: 5,
    icon: '🌬️',
    category: 'meditation',
    description: 'Tecnica cientifica anti-ansiedade',
    longDescription:
      'A tecnica 4-7-8 do Dr. Andrew Weil ativa o sistema nervoso parassimpatico e acalma em minutos. E pura biologia.',
    benefit:
      'Reduz cortisol (hormona do stress) em 15% apos uma sessao. Ajuda a adormecer mais rapido.',
    steps: [
      'Expira todo o ar pela boca',
      'Inspira pelo nariz durante 4 segundos',
      'Retem o ar durante 7 segundos',
      'Expira pela boca durante 8 segundos',
      'Repete 4 ciclos',
    ],
    tip: 'Usa quando sentires panico ou antes de uma situacao dificil.',
    intentions: ['sos', 'sleep', 'recharge'],
    quote: 'A respiracao e a ponte entre corpo e mente. — Thich Nhat Hanh',
  },
  {
    id: 'meditate-bodyscan',
    title: 'Body scan',
    duration: 10,
    icon: '🧘',
    category: 'meditation',
    description: 'Relaxa o corpo de cabeca aos pes',
    longDescription:
      'Tecnica de mindfulness onde observas cada parte do corpo, libertando tensao. Sem julgar.',
    benefit:
      'Reduz dor cronica, melhora sono, aumenta consciencia corporal.',
    steps: [
      'Deita-te ou senta-te confortavel',
      'Fecha os olhos e respira 3 vezes fundo',
      'Comeca pelos pes, sobe lentamente',
      'Nota cada sensacao sem tentar mudar',
      'Termina no topo da cabeca',
    ],
    tip: 'Se adormeceres, ainda esta a funcionar.',
    intentions: ['sleep', 'clarity', 'night'],
  },
  {
    id: 'meditate-gratitude',
    title: 'Gratidao',
    duration: 5,
    icon: '🙏',
    category: 'meditation',
    description: '3 coisas pelas quais es grato',
    longDescription:
      'Harvard estudou: pessoas que praticam gratidao diaria sao 25% mais felizes apos 10 semanas.',
    benefit:
      'Reduz sintomas depressivos, melhora qualidade do sono, fortalece relacoes.',
    steps: [
      'Fecha os olhos',
      'Pensa em 3 coisas especificas pelas quais es grato hoje',
      'Sente a gratidao em cada uma',
      'Agradece mentalmente a quem/o que te deu isso',
    ],
    tip: 'Se precisares, escreve-as num caderno pequeno.',
    intentions: ['morning', 'night', 'clarity'],
  },
  {
    id: 'meditate-visual',
    title: 'Visualizacao',
    duration: 10,
    icon: '🌄',
    category: 'meditation',
    description: 'Imagina o teu futuro ideal',
    longDescription:
      'Atletas olimpicos e empreendedores de elite usam visualizacao para preparar a mente para o sucesso.',
    benefit:
      'Ativa as mesmas areas cerebrais que a experiencia real. Melhora performance.',
    steps: [
      'Fecha os olhos',
      'Imagina-te a alcancar um objetivo importante',
      'Ve os detalhes: onde estas, quem esta contigo, o que sentes',
      'Vive-o como se fosse real agora',
    ],
    tip: 'Mais poderoso se visualizares o PROCESSO, nao so o resultado.',
    intentions: ['focus', 'morning'],
  },
  {
    id: 'meditate-observe',
    title: 'Observar pensamentos',
    duration: 10,
    icon: '☁️',
    category: 'meditation',
    description: 'Deixa os pensamentos passar como nuvens',
    longDescription:
      'Mindfulness pura. Nao tentes parar os pensamentos — observa-os como nuvens no ceu. Passam.',
    benefit:
      'Ensina ao cerebro que os pensamentos nao sao verdades absolutas. Reduz ansiedade.',
    steps: [
      'Senta confortavel, costas direitas',
      'Respira naturalmente',
      'Quando um pensamento vier, nota-o',
      'Deixa-o passar sem agarrar',
      'Volta a respiracao',
    ],
    tip: 'No inicio vais pensar que falhaste. Isso E meditar.',
    intentions: ['clarity', 'sos'],
  },

  // ===== EXERCISE =====
  {
    id: 'exercise-stretch',
    title: 'Alongamento',
    duration: 5,
    icon: '🤸',
    category: 'exercise',
    description: 'Solta tensao em 5 minutos',
    longDescription:
      'Ideal para quem passa tempo sentado ou acordou rigido. Rapido, eficaz, sem equipamento.',
    benefit:
      'Melhora postura, reduz dores lombares, aumenta circulacao.',
    steps: [
      'Pescoco: rola devagar 5x cada lado',
      'Ombros: sobe e desce 10x',
      'Tronco: roda lado a lado 10x',
      'Pernas: toca os pes, mantem 30 seg',
    ],
    tip: 'Faz a cada hora se trabalhas sentado.',
    intentions: ['recharge', 'morning', 'energy'],
  },
  {
    id: 'exercise-walk',
    title: 'Caminhada rapida',
    duration: 15,
    icon: '🚶',
    category: 'exercise',
    description: 'Um passeio que conta',
    longDescription:
      'Sair do ecrã. Ar fresco. Ritmo cardiaco a subir. A caminhada muda o cerebro.',
    benefit:
      'Aumenta BDNF (fator de crescimento neuronal). Melhora criatividade em 60%.',
    steps: [
      'Veste tenis e sai ja',
      'Passo firme, mas nao a correr',
      'Deixa o telemovel no bolso (se possivel em modo silencioso)',
      'Nota 3 coisas novas no caminho',
    ],
    tip: 'Melhores ideias acontecem a caminhar. Steve Jobs sabia disto.',
    intentions: ['energy', 'clarity', 'morning'],
  },
  {
    id: 'exercise-hiit',
    title: 'HIIT 7 minutos',
    duration: 7,
    icon: '🔥',
    category: 'exercise',
    description: 'Treino intenso sem equipamento',
    longDescription:
      'O famoso 7-minute workout: 12 exercicios, 30 seg cada, 10 seg descanso. Cientificamente provado.',
    benefit:
      'Aumenta metabolismo por 24h. Equivalente a 30 min de cardio moderado.',
    steps: [
      'Polichinelos 30 seg',
      'Parede-sentado 30 seg',
      'Flexoes 30 seg',
      'Abdominais 30 seg',
      'Agachamentos 30 seg',
      '(continua com intensidade)',
    ],
    tip: 'Nao precisas de perfeicao. Precisas de intensidade.',
    intentions: ['energy', 'morning'],
  },
  {
    id: 'exercise-yoga',
    title: 'Yoga basico',
    duration: 15,
    icon: '🧘‍♀️',
    category: 'exercise',
    description: 'Fluxo suave para corpo e mente',
    longDescription:
      'Sequencia basica: cao olhando para baixo, cobra, guerreiro, crianca. Sem experiencia necessaria.',
    benefit:
      'Une movimento e respiracao. Reduz stress e melhora flexibilidade.',
    steps: [
      'Tapete ou toalha no chao',
      'Comeca em crianca (descanso)',
      'Cao olhando para baixo (30 seg)',
      'Cobra (30 seg)',
      'Guerreiro 1 cada lado (30 seg)',
      'Volta a crianca para respirar',
    ],
    tip: 'Nao e competicao. Cada corpo e diferente.',
    intentions: ['morning', 'night'],
  },
  {
    id: 'exercise-walk-long',
    title: 'Caminhada longa',
    duration: 30,
    icon: '🏞️',
    category: 'exercise',
    description: 'Sessao completa ao ar livre',
    longDescription:
      'Para quando tens tempo. 30 minutos a pe fazem o que 30 min de telemovel destruem.',
    benefit:
      'Reduz risco cardiovascular em 30%. Melhora humor significativamente.',
    steps: [
      'Escolhe um caminho com natureza',
      'Ritmo que te faz respirar um pouco mais',
      'Sem fones nos primeiros 10 min',
      'Observa o que te rodeia',
    ],
    tip: 'Podes ouvir um podcast educativo depois dos primeiros 10 minutos.',
    intentions: ['energy', 'clarity', 'morning'],
  },

  // ===== JOURNALING =====
  {
    id: 'journal-braindump',
    title: 'Brain dump',
    duration: 10,
    icon: '🧠',
    category: 'journaling',
    description: 'Despeja tudo o que tens na cabeca',
    longDescription:
      'Escreve SEM filtro tudo o que te ocupa a mente. Sem julgar. Sem corrigir. So deixa sair.',
    benefit:
      'Liberta o RAM mental. Reduz ansiedade imediatamente.',
    steps: [
      'Pega num caderno ou abre notas',
      'Escreve tudo o que tens na cabeca',
      'Nao pares para pensar',
      'Escreve ate o timer acabar',
    ],
    tip: 'Ninguem vai ler. Podes apagar depois se quiseres.',
    intentions: ['sos', 'clarity', 'night'],
  },
  {
    id: 'journal-gratitude',
    title: 'Diario de gratidao',
    duration: 5,
    icon: '💝',
    category: 'journaling',
    description: '3 coisas boas de hoje',
    longDescription:
      'Estudado por Martin Seligman (pai da psicologia positiva). Escrever gratidao e cientifico.',
    benefit:
      'Pessoas que fazem isto 3 semanas seguidas sao mais felizes 6 meses depois.',
    steps: [
      'Pensa em 3 coisas boas que aconteceram hoje',
      'Escreve cada uma',
      'Para cada uma, responde: POR QUE aconteceu?',
    ],
    tip: 'As coisas pequenas contam. "Cafe delicioso" e valido.',
    intentions: ['night', 'morning'],
  },
  {
    id: 'journal-morning',
    title: 'Morning pages',
    duration: 15,
    icon: '📝',
    category: 'journaling',
    description: '3 paginas de escrita matinal',
    longDescription:
      'Tecnica de Julia Cameron ("The Artist\'s Way"). Escreve 3 paginas sem parar, logo ao acordar.',
    benefit:
      'Desentope a criatividade. Milhares de artistas e escritores usam diariamente.',
    steps: [
      'Logo de manha, antes do telemovel',
      'Escreve a mao, se possivel',
      '3 paginas, qualquer coisa',
      'Nao pares para pensar',
    ],
    tip: 'Nao releias. Nunca. E so descarga.',
    intentions: ['morning', 'clarity'],
  },
  {
    id: 'journal-goals',
    title: 'Definir objetivos',
    duration: 10,
    icon: '🎯',
    category: 'journaling',
    description: 'Clarifica o que queres',
    longDescription:
      'O que nao esta escrito nao existe. Passar um objetivo do pensamento para o papel muda tudo.',
    benefit:
      'Pessoas que escrevem objetivos tem 42% mais probabilidade de os atingir (Harvard).',
    steps: [
      'Escreve 1 objetivo importante para este mes',
      'Por que importa para ti?',
      'Qual o primeiro passo?',
      'Quando vais dar esse passo?',
    ],
    tip: 'Comeca com 1 objetivo. So 1. Foco > quantidade.',
    intentions: ['focus', 'clarity', 'morning'],
  },
  {
    id: 'journal-night',
    title: 'Reflexao noturna',
    duration: 5,
    icon: '🌙',
    category: 'journaling',
    description: 'Fecha o dia com consciencia',
    longDescription:
      'Antes de dormir, processa o dia em 5 minutos. Dorme melhor e acorda mais lucido.',
    benefit:
      'Melhora qualidade do sono em 27%. Reduz ansiedade noturna.',
    steps: [
      'O que correu bem hoje?',
      'O que podia ter corrido melhor?',
      'O que aprendi?',
      'O que vou fazer diferente amanha?',
    ],
    tip: 'Nao escrevas na cama. Escreve na mesa e depois deita.',
    intentions: ['night', 'sleep', 'clarity'],
  },

  // ===== LEARNING =====
  {
    id: 'learn-podcast',
    title: 'Podcast educativo',
    duration: 15,
    icon: '🎧',
    category: 'learning',
    description: '15 min de aprendizagem audio',
    longDescription:
      'Escolhe um podcast sobre algo que te interessa aprender. Pode ser durante uma caminhada.',
    benefit:
      'Aprender por audio ativa diferentes zonas cerebrais que leitura.',
    steps: [
      'Escolhe um podcast (nao musica)',
      'Ouve com intencao de aprender',
      'Pausa se precisares de pensar',
      'No fim, resume 1 ideia chave',
    ],
    tip: 'Velocidade 1.25x se o podcast for muito lento.',
    intentions: ['focus', 'energy', 'recharge'],
  },
  {
    id: 'learn-ted',
    title: 'Video TED',
    duration: 18,
    icon: '🎤',
    category: 'learning',
    description: 'Uma ideia que vale ser espalhada',
    longDescription:
      'Os TED talks sao cerca de 18 minutos (sem coincidencia — e o maximo de atencao continua).',
    benefit:
      'Expande horizontes. Cada video e uma janela para outra area.',
    steps: [
      'Escolhe um TED que nunca virias normalmente',
      'Ve sem pausa, sem multitasking',
      'No fim, pergunta-te: que vou fazer com isto?',
    ],
    tip: 'TED.com tem playlists por tema. Usa-as.',
    intentions: ['focus', 'clarity'],
  },
  {
    id: 'learn-language',
    title: 'Nova linguagem',
    duration: 10,
    icon: '🗣️',
    category: 'learning',
    description: 'Duolingo, Babbel ou similar',
    longDescription:
      '10 minutos por dia, durante 1 ano, torna-te conversacional numa nova lingua.',
    benefit:
      'Aprender linguas atrasa declinio cognitivo em 4-5 anos.',
    steps: [
      'Abre a app de linguas (nao o Instagram)',
      'Faz 1 licao ate ao fim',
      'Repete em voz alta as palavras',
    ],
    tip: 'Consistencia > duracao. 10 min/dia > 1h/semana.',
    intentions: ['focus', 'morning'],
  },
  {
    id: 'learn-skill',
    title: 'Praticar skill',
    duration: 20,
    icon: '💻',
    category: 'learning',
    description: 'Deliberate practice em algo',
    longDescription:
      'Escolhe uma skill que queres dominar (codigo, desenho, musica) e pratica com intensidade.',
    benefit:
      '10.000 horas para ser expert? Sim, mas a qualidade conta mais que quantidade.',
    steps: [
      'Escolhe 1 subskill especifica',
      'Pratica exatamente essa parte',
      'Recebe feedback (gravacao, tutor, etc)',
      'Ajusta e repete',
    ],
    tip: 'Pratica o que e DIFICIL, nao o que ja sabes.',
    intentions: ['focus'],
  },
];

export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}

export function getActivitiesByIntention(intention: string): Activity[] {
  return ACTIVITIES.filter((a) => a.intentions?.includes(intention as any));
}

export function getActivitiesByCategory(category: string): Activity[] {
  return ACTIVITIES.filter((a) => a.category === category);
}
