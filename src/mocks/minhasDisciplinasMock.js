export const minhasDisciplinasMock = {
  quickActions: [
    {
      id: 'horarios',
      title: 'Grade de Horários',
      subtitle: 'Cronograma semanal unificado',
      actionKey: 'grade-horarios',
      badge: 'Atualizada',
    },
    {
      id: 'boletim',
      title: 'Boletim Escolar Oficial',
      subtitle: 'Emitir histórico e notas com chave',
      actionKey: 'boletim-oficial',
      badge: 'PDF',
    },
    {
      id: 'ajuste',
      title: 'Ajuste de Matrícula',
      subtitle: 'Inclusão, dispensa e trancamento',
      actionKey: 'ajuste-matricula',
      badge: 'Aberto',
    },
  ],

  recentNotices: [
    {
      id: 'n1',
      discipline: 'Banco de Dados II',
      disciplineCode: 'BD002',
      timestamp: 'Hoje, 11:20',
      title: 'Material de apoio: Exercícios de Índices',
      description:
        'Foram adicionados os scripts SQL de benchmark e o slide da aula teórica.',
    },
    {
      id: 'n2',
      discipline: 'Engenharia de Software',
      disciplineCode: 'ES014',
      timestamp: 'Ontem, 16:45',
      title: 'Feedback dos entregáveis do Sprint 2',
      description:
        'Os apontamentos sobre diagramas de classe e arquitetura hexagonal já estão disponíveis.',
    },
  ],
}
