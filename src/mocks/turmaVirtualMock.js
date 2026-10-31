// Dados específicos de cada turma, indexados pelo id da disciplina.
// Os dados básicos da disciplina (nome, código, professor, horário) ficam em
// studentMock.disciplines, a mesma fonte usada pela página inicial.
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

    notices: [
      {
        id: 'notice-1',
        author: 'Prof. Ricardo Santos',
        date: 'Hoje, 11:20',
        title: 'Atualização do conteúdo',
        message:
          'Foram adicionados os scripts SQL de benchmark da aula teórica.',
      },
      {
        id: 'notice-2',
        author: 'Prof. Ricardo Santos',
        date: '10/Set',
        title: 'Atualização dos scripts SQL',
        message:
          'Atualização do script de teste postado no repositório com correções para compatibilidade no PostgreSQL v16.',
      },
      {
        id: 'notice-3',
        author: 'Prof. Ricardo Santos',
        date: '08/Set',
        title: 'Cronograma da disciplina',
        message:
          'Consulte o cronograma atualizado para acompanhar as próximas avaliações.',
      },
    ],

    resources: [
      {
        id: 'resource-1',
        title: 'Ementa e Bibliografia Básica',
        description: 'Date, Silberschatz & Navathe',
        type: 'document',
      },
      {
        id: 'resource-2',
        title: 'Repositório Git da Turma',
        description: 'github.com/dcomp-epis/bd2-2026-2',
        type: 'link',
      },
      {
        id: 'resource-3',
        title: 'Calendário de Provas & Aulas',
        description: 'Sincronizar com Google Agenda',
        type: 'calendar',
      },
    ],
  },
}
