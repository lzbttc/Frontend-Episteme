// Dados específicos de cada turma, indexados pelo id da disciplina.
// Os dados básicos da disciplina (nome, código, professor, horário) ficam em
// disciplinas.js, a mesma fonte usada pelos serviços.
export const turmaVirtualMock = {
  bd002: {
    metrics: {
      average: 8.8,
      attendance: 96,
    },

    modules: [
      {
        id: 'module-1',
        title: 'Módulo 01: Álgebra Relacional e Otimização Heurística',
        status: 'completed',
        items: [
          {
            id: 'material-1',
            title: 'Resumo de Álgebra Relacional',
            description: 'Material de estudo • PDF',
            type: 'file',
          },
          {
            id: 'material-2',
            title: 'Gravação da aula',
            description: 'Aula gravada • Vídeo',
            type: 'video',
          },
        ],
      },
      {
        id: 'module-2',
        title: 'Módulo 02: Índices e Otimizador de Consultas',
        status: 'in_progress',
        items: [
          {
            id: 'material-3',
            title: 'Script Prático SQL: Criação de índices e benchmark',
            description: 'Exercício de Laboratório • SQL (28 KB)',
            type: 'file',
          },
          {
            id: 'material-4',
            title: 'Gravação da aula síncrona: Estratégias de Indexação',
            description: 'Transmissão • Vídeo (52 min)',
            type: 'video',
          },
        ],
      },
    ],

    activities: [
      {
        id: 'activity-1',
        type: 'reading',
        category: 'Leitura Complementar',
        points: null,
        title: 'Leitura Preparatória: Artigo VLDB sobre Armazenamento Colunar',
        dueAt: '2026-09-16T23:59:00',
        details: 'PDF Externo (18 págs)',
        status: 'completed',
        action: 'Abrir',
      },
      {
        id: 'activity-2',
        type: 'exercise',
        category: 'Lista de Exercícios',
        points: 2.5,
        title: 'Lista de Exercícios 02 – Normalização e Índices',
        dueAt: '2026-09-22T23:59:00',
        status: 'pending',
        action: 'Abrir',
      },
      {
        id: 'activity-3',
        type: 'practical',
        category: 'Atividade Prática',
        points: 3.0,
        title: 'Atividade prática de otimização SQL',
        dueAt: '2026-09-29T23:59:00',
        details: null,
        status: 'pending',
        action: 'Abrir',
      },
      {
        id: 'activity-4',
        type: 'forum',
        category: 'Fórum',
        points: null,
        title: 'Discussão: Estratégias de Indexação',
        dueAt: '2026-10-30T23:59:00',
        details: null,
        status: 'pending',
        action: 'Abrir',
      },
      {
        id: 'activity-5',
        type: 'quiz',
        category: 'Questionário',
        points: null,
        title: 'Revisão de Modelagem Relacional',
        dueAt: '2026-09-20T23:59:00',
        details: 'Tentativas: 2 restantes',
        status: 'pending',
        action: 'Abrir',
      },
    ],
  },
}
