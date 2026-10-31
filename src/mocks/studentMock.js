export const studentMock = {
  student: {
    name: 'Lucas Costa',
    matricula: '2023108420',
    course: 'Ciência da Computação',
  },
  metrics: [
    {
      id: 'media',
      value: '8,4',
      percentage: 84,
      label: 'MÉDIA GERAL',
    },
    {
      id: 'frequencia',
      value: '94%',
      percentage: 94,
      label: 'FREQUÊNCIA',
    },
    {
      id: 'atividades',
      value: '100h',
      percentage: 83,
      label: 'ATIVIDADES C.',
    },
  ],
  upcomingEvents: [
    {
      id: 'e1',
      dateDay: '16',
      dateMonth: 'SET',
      title: 'Prova de Banco de Dados II',
      topic: 'Modelagem Relacional e Álgebra',
      time: '14:00 - 16:00',
      location: 'Sala 204, Bloco B',
      type: 'Avaliação',
    },
    {
      id: 'e2',
      dateDay: '18',
      dateMonth: 'SET',
      title: 'Entrega do Projeto de Eng. de Software',
      topic: 'Documento de Requisitos e Diagramas UML',
      time: 'Até 23:59',
      location: 'Ambiente Virtual (Moodle)',
      type: 'Trabalho',
    },
  ],
  quickActions: [
    {
      id: 'qa1',
      title: 'Solicitar matrícula',
      description: 'Ajuste e trancamento',
      icon: 'academic',
    },
    {
      id: 'qa2',
      title: 'Ajuste e trancamento',
      description: 'Solicitações administrativas de matrícula',
      icon: 'file-text',
    },
    {
      id: 'qa3',
      title: 'Coordenação',
      description: 'Canal direto e dúvidas',
      icon: 'message',
    },
    {
      id: 'qa4',
      title: 'Histórico Acadêmico',
      description: 'Emissão de comprovantes e boletim',
      icon: 'award',
    },
  ],
  latestNews: [
    {
      id: 'n1',
      dateDay: '15',
      dateMonth: 'SET',
      title: 'Período de matrículas e ajustes 2026.2 aberto',
      summary:
        'O processo de ajustes e inclusão de disciplinas estará disponível até 22 de setembro.',
    },
    {
      id: 'n2',
      dateDay: '10',
      dateMonth: 'SET',
      title: 'Edital de monitoria acadêmica para o semestre',
      summary:
        'Inscrições abertas para as vagas de monitor bolsista e voluntário no DComp.',
    },
    {
      id: 'n3',
      dateDay: '04',
      dateMonth: 'SET',
      title: 'Biblioteca Central: Novo horário estendido até as 22h',
      summary:
        'Salas de estudo em grupo e acervo geral passam a operar com atendimento estendido.',
    },
  ],
}
