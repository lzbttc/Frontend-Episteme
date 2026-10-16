export const turmaVirtualMock = {
  discipline: {
    code: 'BD002',
    name: 'Banco de Dados II: Modelagem e Otimização',
    professor: 'Prof. Dr. Rafael Oliveira',
    department: 'DCC',
    campus: 'Campus Central',
    schedule: 'Seg & Qua • 14:00 - 16:00',
    room: 'Sala 204, Bloco B',
    semester: '2026.2',
  },

  metrics: [
    {
      id: 'average',
      value: '8,8',
      label: 'MÉDIA GERAL',
      percentage: 88,
      color: '#3b82f6',
    },
    {
      id: 'frequency',
      value: '96%',
      label: 'FREQUÊNCIA',
      percentage: 96,
      color: '#3b82f6',
    },
    {
      id: 'pending',
      value: '4',
      label: 'PENDÊNCIAS',
      percentage: 80,
      color: '#3b82f6',
    },
  ],



  modules: [
    {
      id: 'module-1',
      title: 'Módulo 01: Álgebra Relacional e Otimização Heurística',
      status: 'Concluído',
      description: 'Concluído • 2 arquivos disponíveis',
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
      status: 'Pendente',
      description: 'Em andamento • 2 arquivos disponíveis',
      items: [
        {
          id: 'material-5',
          title: 'Script Prático SQL: Criação de índices e benchmark',
          description: 'Exercício de Laboratório • SQL (28 KB)',
          type: 'file',
        },
        {
          id: 'material-6',
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
      deadline: 'Prazo: 16/Set',
      details: 'PDF Externo (18 págs)',
      status: 'Concluído',
      action: 'Abrir',
    },
    {
      id: 'activity-2',
      type: 'exercise',
      category: 'Lista de Exercícios',
      points: 2.5,
      title: 'Lista de Exercícios 02 – Normalização e Índices',
      deadline: 'Prazo: 22/Set às 23:59',
      details: 'Tentativas: 2 restantes',
      status: 'Pendente',
      action: 'Abrir',
    },
    {
      id: 'activity-3',
      type: 'practical',
      category: 'Atividade Prática',
      points: 3.0,
      title: 'Atividade prática de otimização SQL',
      deadline: 'Prazo: 29/Set às 23:59',
      details: null,
      status: 'Pendente',
      action: 'Abrir',
    },
    {
      id: 'activity-4',
      type: 'forum',
      category: 'Fórum',
      points: null,
      title: 'Discussão: Estratégias de Indexação',
      deadline: null,
      details: null,
      status: 'Pendente',
      action: 'Acessar',
    },
    {
      id: 'activity-5',
      type: 'quiz',
      category: 'Questionário',
      points: null,
      title: 'Revisão de Modelagem Relacional',
      deadline: 'Prazo: 20/Set às 23:59',
      details: null,
      status: 'Pendente',
      action: 'Abrir',
    },
  ],

  notices: [
    {
      id: 'notice-1',
      author: 'Prof. Rafael Oliveira',
      date: 'Hoje, 11:20',
      title: 'Atualização do conteúdo',
      message:
        'Foram adicionados os scripts SQL de benchmark da aula teórica.',
    },
    {
      id: 'notice-2',
      author: 'Prof. Rafael Oliveira',
      date: '10/Set',
      title: 'Atualização dos scripts SQL',
      message:
        'Atualização do script de teste postado no repositório com correções para compatibilidade no PostgreSQL v16.',
    },
    {
      id: 'notice-3',
      author: 'Prof. Rafael Oliveira',
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
      description: 'github.com/dcc-epis/bd002-2025',
      type: 'link',
    },
    {
      id: 'resource-3',
      title: 'Calendário de Provas & Aulas',
      description: 'Sincronizar com Google Agenda',
      type: 'calendar',
    },
  ],
}