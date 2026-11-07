/**
 * Mock de dados da Central de Ajuda — EPIS.
 *
 * Estrutura preparada para substituição futura por chamada a API REST / GraphQL,
 * separando os dados da camada de apresentação.
 */

export const PERFIS = {
  ALUNO: 'aluno',
  PROFESSOR: 'professor',
  COORDENACAO: 'coordenacao',
}

export const PERFIS_LABELS = {
  [PERFIS.ALUNO]: 'Aluno',
  [PERFIS.PROFESSOR]: 'Professor',
  [PERFIS.COORDENACAO]: 'Coordenação',
}

export const CATEGORIAS_AJUDA = [
  {
    id: 'perfil',
    nome: 'Perfil',
    descricao:
      'Gestão de dados cadastrais, credenciais de acesso, foto de identificação e preferências.',
    icone: 'user',
  },
  {
    id: 'matricula',
    nome: 'Matrícula',
    descricao:
      'Solicitações de matrícula, ajuste de disciplinas, trancamento, requisitos e prazos regimentais.',
    icone: 'academic',
  },
  {
    id: 'turmas',
    nome: 'Turmas',
    descricao:
      'Acesso à Turma Virtual, plano de ensino, materiais didáticos, diário de classe e frequência.',
    icone: 'book',
  },
  {
    id: 'grade_horarios',
    nome: 'Grade de horários',
    descricao:
      'Cronograma semanal unificado, distribuição de salas, blocos e horários de aulas e atendimento.',
    icone: 'calendar',
  },
  {
    id: 'noticias',
    nome: 'Notícias',
    descricao:
      'Comunicados oficiais, editais, notícias acadêmicas da coordenação e avisos institucionais.',
    icone: 'megaphone',
  },
  {
    id: 'notificacoes',
    nome: 'Notificações',
    descricao:
      'Central de avisos, alertas de prazos, notificações de notas e preferências de envio.',
    icone: 'bell',
  },
]

export const ORIENTACOES_AJUDA = [
  // --- PERFIL ---
  {
    id: 'ori-perfil-aluno',
    categoriaId: 'perfil',
    titulo: 'Guia do Perfil Discente',
    resumo:
      'Como conferir sua matrícula, curso ativo e manter seus dados de contato e acesso atualizados.',
    perfis: [PERFIS.ALUNO],
    passos: [
      'Acesse o menu do usuário no canto superior direito para conferir seu nome completo e número de matrícula.',
      'Verifique regularmente se seu e-mail institucional está correto para não perder avisos importantes.',
      'Para alteração de dados sensíveis (nome civil/social ou CPF), encaminhe solicitação formal à secretaria acadêmica.',
      'Mantenha sua senha em segurança e realize logout ao utilizar computadores compartilhados da universidade.',
    ],
    tags: [
      'perfil',
      'dados',
      'matricula',
      'email',
      'senha',
      'aluno',
      'seguranca',
    ],
  },
  {
    id: 'ori-perfil-professor',
    categoriaId: 'perfil',
    titulo: 'Identificação Docente e Vínculo',
    resumo:
      'Visualização das informações do corpo docente, departamento e atribuição acadêmica.',
    perfis: [PERFIS.PROFESSOR],
    passos: [
      'Confira sua matrícula docente e departamento de lotação vinculados ao sistema.',
      'Certifique-se de que o e-mail de contato cadastrado corresponde ao correio funcional institucional.',
      'Em caso de divergência de carga horária ou departamento, informe à coordenação acadêmica de sua unidade.',
    ],
    tags: [
      'perfil',
      'docente',
      'professor',
      'departamento',
      'vinculo',
      'contato',
    ],
  },
  {
    id: 'ori-perfil-coordenacao',
    categoriaId: 'perfil',
    titulo: 'Painel da Gestão e Coordenação',
    resumo:
      'Visão geral das credenciais administrativas e controle de acessos da coordenação.',
    perfis: [PERFIS.COORDENACAO],
    passos: [
      'Verifique os privilégios administrativos concedidos ao seu perfil funcional.',
      'Gerencie as autorizações e auditoria de ações acadêmicas realizadas no período letivo.',
      'Mantenha os canais diretos de contato do colegiado atualizados no portal.',
    ],
    tags: ['perfil', 'coordenacao', 'administracao', 'gestao', 'permissoes'],
  },

  // --- MATRÍCULA ---
  {
    id: 'ori-matricula-aluno',
    categoriaId: 'matricula',
    titulo: 'Processo de Matrícula e Ajustes',
    resumo:
      'Orientações completas sobre períodos de solicitação, ajuste de grade, inclusão e trancamento.',
    perfis: [PERFIS.ALUNO],
    passos: [
      'Consulte o calendário acadêmico para identificar as datas de início e fim da matrícula regular e ajuste.',
      'Analise a lista de disciplinas ofertadas e confira se você atende aos pré-requisitos obrigatórios.',
      'Em caso de conflito de horários ou turmas lotadas, utilize o período de Ajuste de Matrícula para novas opções.',
      'O trancamento de matrícula pode ser total ou parcial, respeitando o número mínimo de créditos exigidos.',
    ],
    tags: [
      'matricula',
      'ajuste',
      'disciplinas',
      'trancamento',
      'requisitos',
      'prazos',
      'creditos',
    ],
  },
  {
    id: 'ori-matricula-professor',
    categoriaId: 'matricula',
    titulo: 'Acompanhamento de Enturmação',
    resumo:
      'Como verificar a lista de matriculados e demanda de vagas nas suas turmas ofertadas.',
    perfis: [PERFIS.PROFESSOR],
    passos: [
      'Acesse a lista de turmas para acompanhar a quantidade de alunos enturmados no período de matrícula.',
      'Monitore solicitações especiais de quebra de pré-requisito encaminhadas pela coordenação.',
      'Ao término do período de ajuste, verifique a lista final consolidada antes de aplicar avaliações.',
    ],
    tags: ['matricula', 'turmas', 'vagas', 'professor', 'enturmacao', 'alunos'],
  },
  {
    id: 'ori-matricula-coordenacao',
    categoriaId: 'matricula',
    titulo: 'Gestão e Deferimento de Matrículas',
    resumo:
      'Fluxos de homologação, liberação de vagas excedentes e ajuste extraordinário de grade.',
    perfis: [PERFIS.COORDENACAO],
    passos: [
      'Analise e homologue os pedidos de quebra de pré-requisito e aproveitamento de estudos.',
      'Monitore a ocupação de turmas críticas e redistribua vagas conforme a demanda do colegiado.',
      'Execute o processamento das solicitações de ajuste extraordinário dentro do prazo regulamentar.',
    ],
    tags: [
      'matricula',
      'coordenacao',
      'deferimento',
      'vagas',
      'aproveitamento',
      'homologacao',
    ],
  },

  // --- TURMAS ---
  {
    id: 'ori-turmas-aluno',
    categoriaId: 'turmas',
    titulo: 'Explorando a Turma Virtual',
    resumo:
      'Acesse aulas, materiais, envie atividades e acompanhe notas parciais e frequência.',
    perfis: [PERFIS.ALUNO],
    passos: [
      'Na página "Minhas Disciplinas", selecione a disciplina desejada para ingressar na Turma Virtual correspondente.',
      'Utilize as abas "Aulas e Conteúdo", "Tarefas e Trabalhos", "Materiais" e "Participantes" para navegar.',
      'Envie trabalhos antes do horário limite estipulado pelo professor para evitar penalidades de atraso.',
      'Acompanhe seu percentual de frequência — o regimento exige no mínimo 75% de presença para aprovação.',
    ],
    tags: [
      'turmas',
      'turma virtual',
      'aulas',
      'tarefas',
      'frequencia',
      'materiais',
      'notas',
    ],
  },
  {
    id: 'ori-turmas-professor',
    categoriaId: 'turmas',
    titulo: 'Administração da Turma Virtual',
    resumo:
      'Publicação de conteúdo programático, registro de presenças e lançamento de notas.',
    perfis: [PERFIS.PROFESSOR],
    passos: [
      'Organize o plano de ensino em módulos temáticos com cronograma de tópicos e bibliografia.',
      'Disponibilize PDFs, apresentações e referências bibliográficas na aba de materiais.',
      'Cadastre atividades e tarefas com critérios de avaliação, peso e prazos claros para a turma.',
      'Lance a frequência aula a aula e preencha o diário acadêmico dentro dos prazos estabelecidos.',
    ],
    tags: [
      'turmas',
      'plano de ensino',
      'diario',
      'frequencia',
      'professor',
      'notas',
      'conteudo',
    ],
  },
  {
    id: 'ori-turmas-coordenacao',
    categoriaId: 'turmas',
    titulo: 'Supervisão de Diários e Turmas',
    resumo:
      'Supervisão do cumprimento de planos de ensino, fechamento de períodos e relatórios.',
    perfis: [PERFIS.COORDENACAO],
    passos: [
      'Acompanhe o preenchimento de diários de classe e cumprimento da carga horária das disciplinas.',
      'Verifique se os planos de ensino foram homologados e publicados conforme as diretrizes pedagógicas.',
      'Ao final do semestre, gerencie a consolidação de notas e encerramento de turmas pelo colegiado.',
    ],
    tags: [
      'turmas',
      'supervisao',
      'coordenacao',
      'diario de classe',
      'plano de ensino',
      'fechamento',
    ],
  },

  // --- GRADE DE HORÁRIOS ---
  {
    id: 'ori-grade-aluno',
    categoriaId: 'grade_horarios',
    titulo: 'Consulta da Grade Horária Semanal',
    resumo:
      'Localize salas, blocos e horários de aula para organizar sua rotina acadêmica.',
    perfis: [PERFIS.ALUNO],
    passos: [
      'Consulte sua grade unificada no portal para checar a distribuição dos dias da semana.',
      'Observe os números de sala e bloco indicados no cartão de cada disciplina.',
      'Fique atento a aulas quinzenais ou práticas laboratoriais que possam ter horários específicos.',
      'Caso encontre sobreposição de horários, solicite ajuste imediato junto à coordenação.',
    ],
    tags: [
      'grade',
      'horarios',
      'salas',
      'blocos',
      'cronograma',
      'semanal',
      'choque',
    ],
  },
  {
    id: 'ori-grade-professor',
    categoriaId: 'grade_horarios',
    titulo: 'Horários Docentes e Salas de Aula',
    resumo:
      'Organização de horários de aula, disponibilidade de laboratórios e horários de atendimento.',
    perfis: [PERFIS.PROFESSOR],
    passos: [
      'Verifique sua grade de aulas nos diferentes dias da semana e os espaços físicos alocados.',
      'Informe horários fixos de atendimento extraclasse ao estudante para constar no plano da disciplina.',
      'Em caso de necessidade de reserva de laboratório especial, informe com antecedência ao setor de infraestrutura.',
    ],
    tags: [
      'grade',
      'horarios',
      'professor',
      'laboratorios',
      'atendimento',
      'salas',
    ],
  },
  {
    id: 'ori-grade-coordenacao',
    categoriaId: 'grade_horarios',
    titulo: 'Planejamento e Otimização de Horários',
    resumo:
      'Construção da malha horária do curso, alocação de salas e mitigação de choques.',
    perfis: [PERFIS.COORDENACAO],
    passos: [
      'Planeje os horários das turmas para evitar conflito entre disciplinas obrigatórias do mesmo período.',
      'Otimize a alocação de salas de aula e laboratórios considerando a capacidade física e recursos exigidos.',
      'Ajuste trocas de salas ou horários pontuais em conjunto com o setor de ensalamento.',
    ],
    tags: [
      'grade',
      'horarios',
      'coordenacao',
      'ensalamento',
      'conflito',
      'planejamento',
    ],
  },

  // --- NOTÍCIAS ---
  {
    id: 'ori-noticias-aluno',
    categoriaId: 'noticias',
    titulo: 'Acompanhando Notícias e Editais',
    resumo:
      'Mantenha-se informado sobre oportunidades de iniciação científica, bolsas, eventos e avisos gerais.',
    perfis: [PERFIS.ALUNO],
    passos: [
      'Consulte a seção de Notícias e Comunicados na Página Inicial para novidades institucionais.',
      'Fique atento a editais de auxílio estudantil, monitoria, intercâmbio e pesquisa.',
      'Leia com atenção as instruções de cada comunicado oficial publicado pela reitoria ou coordenação.',
    ],
    tags: [
      'noticias',
      'comunicados',
      'editais',
      'bolsas',
      'eventos',
      'informes',
    ],
  },
  {
    id: 'ori-noticias-professor',
    categoriaId: 'noticias',
    titulo: 'Divulgação de Projetos e Avisos',
    resumo:
      'Como veicular avisos acadêmicos, seminários de pesquisa e informações para o corpo estudantil.',
    perfis: [PERFIS.PROFESSOR],
    passos: [
      'Acesse os canais de notícias para acompanhar convocações departamentais e editais de fomento.',
      'Encaminhe à coordenação sugestões de notícias sobre publicações ou eventos do grupo de pesquisa.',
      'Utilize o mural de avisos da turma para comunicados específicos voltados apenas aos seus alunos.',
    ],
    tags: [
      'noticias',
      'divulgacao',
      'pesquisa',
      'editais',
      'professor',
      'avisos',
    ],
  },
  {
    id: 'ori-noticias-coordenacao',
    categoriaId: 'noticias',
    titulo: 'Publicação de Comunicados Oficiais',
    resumo:
      'Criação e gerenciamento de notícias, circulares e comunicados para o curso.',
    perfis: [PERFIS.COORDENACAO],
    passos: [
      'Elabore comunicados com linguagem clara, informando prazos, documentos e canais de atendimento.',
      'Defina o público-alvo (geral, discente ou docente) para garantir assertividade na comunicação.',
      'Mantenha o histórico de editais e notas oficiais acessível para consulta pública.',
    ],
    tags: [
      'noticias',
      'publicacao',
      'comunicados',
      'coordenacao',
      'editais',
      'gestao',
    ],
  },

  // --- NOTIFICAÇÕES ---
  {
    id: 'ori-notificacoes-aluno',
    categoriaId: 'notificacoes',
    titulo: 'Central de Alertas e Notificações',
    resumo:
      'Gerenciamento de alertas no sino superior para tarefas, prazos e notas publicadas.',
    perfis: [PERFIS.ALUNO],
    passos: [
      'O ícone de sino no topo da tela indica quando há mensagens ou prazos não lidos.',
      'Receba alertas sempre que um professor postar novo material, atividade ou lançamento de nota.',
      'Marque notificações importantes como lidas para manter sua central sempre organizada.',
    ],
    tags: ['notificacoes', 'alertas', 'sino', 'prazos', 'mensagens', 'notas'],
  },
  {
    id: 'ori-notificacoes-professor',
    categoriaId: 'notificacoes',
    titulo: 'Alertas de Atividades e Interações',
    resumo:
      'Recebimento de notificações de entregas de trabalhos, dúvidas e prazos do calendário acadêmico.',
    perfis: [PERFIS.PROFESSOR],
    passos: [
      'Acompanhe lembretes de prazos para encerramento de prazos de lançamento de notas.',
      'Receba notificações quando estudantes enviarem solicitações de revisão ou justificativas.',
      'Configure a frequência de alertas para otimizar sua rotina de trabalho.',
    ],
    tags: [
      'notificacoes',
      'professor',
      'entregas',
      'alertas',
      'prazos',
      'diario',
    ],
  },
  {
    id: 'ori-notificacoes-coordenacao',
    categoriaId: 'notificacoes',
    titulo: 'Disparo de Alertas e Monitoramento',
    resumo:
      'Emissão de avisos importantes e acompanhamento de alertas de prazos regimentais.',
    perfis: [PERFIS.COORDENACAO],
    passos: [
      'Dispare alertas urgentes para o corpo docente e discente sobre prazos de matrícula ou cancelamento de aulas.',
      'Monitore pendências sistêmicas como turmas sem professor alocado ou diários não consolidados.',
      'Verifique o status de entrega das notificações enviadas.',
    ],
    tags: [
      'notificacoes',
      'coordenacao',
      'disparo',
      'alertas',
      'monitoramento',
      'urgente',
    ],
  },
]

export const FAQS_AJUDA = [
  // --- PERFIL ---
  {
    id: 'faq-perfil-1',
    categoriaId: 'perfil',
    pergunta: 'Como consulto e atualizo meus dados pessoais e de contato?',
    resposta:
      'No canto superior direito, clique sobre o seu avatar ou nome. Suas informações acadêmicas (nome, matrícula e curso) são exibidas no cabeçalho. Para atualizar telefone ou e-mail secundário, consulte o suporte da secretaria acadêmica.',
    perfis: [PERFIS.ALUNO, PERFIS.PROFESSOR, PERFIS.COORDENACAO],
    destaque: true,
    tags: ['perfil', 'dados cadastrais', 'matricula', 'contato', 'atualizar'],
  },
  {
    id: 'faq-perfil-2',
    categoriaId: 'perfil',
    pergunta: 'Esqueci minha senha de acesso ao EPIS. O que devo fazer?',
    resposta:
      'Na tela de login do sistema, utilize a opção "Esqueceu a senha?". Você receberá um link de recuperação no e-mail institucional cadastrado. Caso não tenha mais acesso ao e-mail, compareça à secretaria com documento oficial de identificação.',
    perfis: [PERFIS.ALUNO, PERFIS.PROFESSOR, PERFIS.COORDENACAO],
    destaque: true,
    tags: ['senha', 'recuperacao', 'esqueci', 'acesso', 'login'],
  },
  {
    id: 'faq-perfil-3',
    categoriaId: 'perfil',
    pergunta:
      'Como professor, como verifico meu vínculo institucional e departamento?',
    resposta:
      'O perfil docente exibe a matrícula funcional iniciada pelo identificador correspondente. Suas turmas e departamentos vinculados podem ser consultados diretamente no painel de turmas e na relação departamental.',
    perfis: [PERFIS.PROFESSOR],
    destaque: false,
    tags: ['professor', 'vinculo', 'departamento', 'perfil', 'matricula'],
  },
  {
    id: 'faq-perfil-4',
    categoriaId: 'perfil',
    pergunta:
      'Quais permissões estão disponíveis para o perfil da Coordenação?',
    resposta:
      'O perfil de Coordenação possui privilégios para gerenciamento acadêmico, deferimento de matrículas, alocação de salas e professores, publicação de comunicados oficiais e homologação de fechamento de turmas.',
    perfis: [PERFIS.COORDENACAO],
    destaque: false,
    tags: [
      'coordenacao',
      'permissoes',
      'administracao',
      'privilegios',
      'gestao',
    ],
  },

  // --- MATRÍCULA ---
  {
    id: 'faq-mat-1',
    categoriaId: 'matricula',
    pergunta: 'Como funciona o período de matrícula e o ajuste online?',
    resposta:
      'A matrícula ocorre semestralmente de acordo com o calendário acadêmico. Na fase de matrícula regular, o aluno seleciona as turmas pretendidas. Após o primeiro processamento, abre-se a etapa de Ajuste de Matrícula, permitindo inclusão em turmas com vagas remanescentes ou troca de turnos.',
    perfis: [PERFIS.ALUNO],
    destaque: true,
    tags: ['matricula', 'ajuste', 'prazos', 'calendario', 'inclusao', 'vagas'],
  },
  {
    id: 'faq-mat-2',
    categoriaId: 'matricula',
    pergunta: 'Como solicitar trancamento de matrícula ou de disciplina?',
    resposta:
      'O trancamento pode ser total (do semestre letivo) ou parcial (de disciplinas específicas). Ambas as solicitações devem ser realizadas dentro do prazo estabelecido no calendário acadêmico e respeitar o limite mínimo de créditos e o limite máximo de trancamentos regimentais.',
    perfis: [PERFIS.ALUNO, PERFIS.COORDENACAO],
    destaque: true,
    tags: [
      'trancamento',
      'matricula',
      'cancelamento',
      'creditos',
      'solicitacao',
    ],
  },
  {
    id: 'faq-mat-3',
    categoriaId: 'matricula',
    pergunta:
      'Como a coordenação processa quebras de pré-requisito e vagas adicionais?',
    resposta:
      'A coordenação acessa o módulo de homologação acadêmica, avalia o histórico do discente e a disponibilidade física de espaço na turma. O deferimento é registrado no sistema e reflete imediatamente na enturmação do estudante.',
    perfis: [PERFIS.COORDENACAO],
    destaque: true,
    tags: [
      'coordenacao',
      'pre-requisito',
      'vagas',
      'homologacao',
      'deferimento',
    ],
  },
  {
    id: 'faq-mat-4',
    categoriaId: 'matricula',
    pergunta:
      'O professor pode autorizar inclusão de aluno em sua turma diretamente?',
    resposta:
      'O professor pode emitir parecer favorável à solicitação de quebra de pré-requisito ou vaga excedente, mas a inclusão efetiva no diário eletrônico deve ser homologada pela coordenação do curso para validade acadêmica.',
    perfis: [PERFIS.PROFESSOR],
    destaque: false,
    tags: ['professor', 'inclusao', 'parecer', 'turmas', 'vagas'],
  },
  {
    id: 'faq-mat-5',
    categoriaId: 'matricula',
    pergunta:
      'O que fazer caso uma disciplina obrigatória esteja sem vagas disponíveis?',
    resposta:
      'Nesse caso, registre o interesse no período de ajuste e entre em contato imediatamente com a Coordenação de Curso através do canal institucional para avaliação de abertura de nova turma ou expansão de vagas.',
    perfis: [PERFIS.ALUNO],
    destaque: false,
    tags: ['sem vagas', 'obrigatoria', 'coordenacao', 'ajuste', 'ampliacao'],
  },

  // --- TURMAS ---
  {
    id: 'faq-turma-1',
    categoriaId: 'turmas',
    pergunta:
      'Como acessar os materiais de aula e plano de ensino na Turma Virtual?',
    resposta:
      'Acesse a página "Minhas Disciplinas" e clique no cartão da disciplina para entrar na Turma Virtual. Navegue pelas abas "Aulas e Conteúdo" para ver o cronograma e "Materiais" para baixar apresentações, apostilas e listas de exercícios.',
    perfis: [PERFIS.ALUNO],
    destaque: true,
    tags: [
      'turma virtual',
      'materiais',
      'plano de ensino',
      'conteudo',
      'download',
    ],
  },
  {
    id: 'faq-turma-2',
    categoriaId: 'turmas',
    pergunta:
      'Como o professor realiza o lançamento de notas e controle de frequência?',
    resposta:
      'Dentro do diário eletrônico da turma, o docente tem acesso às planilhas de frequência diária e lançamento de avaliações. As notas podem ser salvas provisoriamente e consolidadas antes do término do prazo semestral.',
    perfis: [PERFIS.PROFESSOR],
    destaque: true,
    tags: [
      'professor',
      'notas',
      'frequencia',
      'diario',
      'lancamento',
      'prazos',
    ],
  },
  {
    id: 'faq-turma-3',
    categoriaId: 'turmas',
    pergunta:
      'Qual o limite de faltas permitido antes de reprovar por infrequência?',
    resposta:
      'Conforme as normas regimentais da universidade, o estudante deve cumprir no mínimo 75% de frequência da carga horária total da disciplina. Faltas acima de 25% resultam em reprovação por falta (RF), independentemente das notas obtidas.',
    perfis: [PERFIS.ALUNO],
    destaque: true,
    tags: ['faltas', 'frequencia', 'reprovacao', 'limite', 'presenca', '75%'],
  },
  {
    id: 'faq-turma-4',
    categoriaId: 'turmas',
    pergunta:
      'Como a coordenação aloca professores em turmas e acompanha os diários?',
    resposta:
      'Pelo painel administrativo de gestão de turmas, a coordenação associa os docentes responsáveis por cada código de turma, define horários e acompanha o percentual de preenchimento dos diários durante o semestre.',
    perfis: [PERFIS.COORDENACAO],
    destaque: true,
    tags: ['coordenacao', 'alocacao', 'docentes', 'diario', 'supervisao'],
  },
  {
    id: 'faq-turma-5',
    categoriaId: 'turmas',
    pergunta:
      'Como enviar atividades avaliativas dentro do prazo na Turma Virtual?',
    resposta:
      'Na aba "Tarefas e Trabalhos", localize a atividade desejada, anexe o arquivo no formato solicitado (como PDF) e clique em "Enviar Tarefa". O sistema gera um comprovante digital de submissão com data e horário.',
    perfis: [PERFIS.ALUNO],
    destaque: false,
    tags: ['atividades', 'envio', 'tarefas', 'submissao', 'prazos', 'pdf'],
  },

  // --- GRADE DE HORÁRIOS ---
  {
    id: 'faq-grade-1',
    categoriaId: 'grade_horarios',
    pergunta:
      'Onde encontro minha grade de horários completa e as salas de aula?',
    resposta:
      'Sua grade unificada está disponível na área de disciplinas e no cronograma do portal. Cada disciplina informa os dias da semana, horários (início e término) e a localização física (bloco e número da sala).',
    perfis: [PERFIS.ALUNO, PERFIS.PROFESSOR],
    destaque: true,
    tags: ['grade', 'horarios', 'salas', 'blocos', 'cronograma', 'semanal'],
  },
  {
    id: 'faq-grade-2',
    categoriaId: 'grade_horarios',
    pergunta:
      'O que fazer caso ocorra choque ou sobreposição de horários entre disciplinas?',
    resposta:
      'O sistema impede a matrícula regular em disciplinas com horários coincidentes. Caso ocorra alguma inconsistência ou alteração posterior de horário pela instituição, contate a coordenação para remanejamento de turma.',
    perfis: [PERFIS.ALUNO, PERFIS.COORDENACAO],
    destaque: true,
    tags: ['choque', 'conflito', 'sobreposicao', 'ajuste', 'coordenacao'],
  },
  {
    id: 'faq-grade-3',
    categoriaId: 'grade_horarios',
    pergunta:
      'Como o professor solicita alteração de sala de aula ou reserva de laboratório?',
    resposta:
      'Solicitações de permuta de sala ou reserva especial de laboratórios didáticos devem ser cadastradas com antecedência junto ao setor de infraestrutura e comunicadas à coordenação do curso.',
    perfis: [PERFIS.PROFESSOR],
    destaque: false,
    tags: ['professor', 'sala', 'laboratorio', 'reserva', 'infraestrutura'],
  },
  {
    id: 'faq-grade-4',
    categoriaId: 'grade_horarios',
    pergunta:
      'Como a coordenação define a distribuição de salas e horários do curso?',
    resposta:
      'A definição é realizada na fase de planejamento semestral, priorizando a compatibilidade entre as disciplinas obrigatórias do mesmo período e dimensionando os espaços conforme a quantidade de matriculados.',
    perfis: [PERFIS.COORDENACAO],
    destaque: false,
    tags: [
      'coordenacao',
      'distribuicao',
      'planejamento',
      'salas',
      'ensalamento',
    ],
  },

  // --- NOTÍCIAS ---
  {
    id: 'faq-not-1',
    categoriaId: 'noticias',
    pergunta: 'Onde são publicados os comunicados e editais acadêmicos?',
    resposta:
      'Os comunicados oficiais são exibidos na Página Inicial na seção "Notícias & Comunicados" e também nos murais digitais das turmas virtuais quando publicados por professores específicos.',
    perfis: [PERFIS.ALUNO, PERFIS.PROFESSOR],
    destaque: true,
    tags: ['noticias', 'comunicados', 'editais', 'pagina inicial', 'mural'],
  },
  {
    id: 'faq-not-2',
    categoriaId: 'noticias',
    pergunta:
      'Como a coordenação publica uma notícia ou comunicado urgente para os alunos?',
    resposta:
      'A coordenação utiliza a ferramenta institucional de comunicados, selecionando o título, texto, anexos e o público-alvo (por exemplo: alunos do 1º período ou todo o curso). O aviso passa a ser exibido de imediato no portal.',
    perfis: [PERFIS.COORDENACAO],
    destaque: true,
    tags: ['coordenacao', 'publicar', 'noticias', 'urgente', 'comunicado'],
  },
  {
    id: 'faq-not-3',
    categoriaId: 'noticias',
    pergunta:
      'Como encontrar oportunidades de bolsas de monitoria e iniciação científica?',
    resposta:
      'Editais de pesquisa, extensão e monitoria são veiculados periodicamente na área de notícias. Cada edital contém os pré-requisitos, documentação necessária e o cronograma de inscrição e entrevistas.',
    perfis: [PERFIS.ALUNO],
    destaque: false,
    tags: [
      'bolsas',
      'monitoria',
      'pesquisa',
      'iniciacao cientifica',
      'editais',
    ],
  },
  {
    id: 'faq-not-4',
    categoriaId: 'noticias',
    pergunta:
      'Professores podem divulgar eventos científicos ou palestras no portal?',
    resposta:
      'Sim. O docente pode solicitar a inclusão da notícia ou chamada de trabalhos à assessoria do colegiado ou publicar diretamente avisos específicos nas turmas virtuais correspondentes.',
    perfis: [PERFIS.PROFESSOR],
    destaque: false,
    tags: ['professor', 'eventos', 'palestras', 'divulgacao', 'colegiado'],
  },

  // --- NOTIFICAÇÕES ---
  {
    id: 'faq-noti-1',
    categoriaId: 'notificacoes',
    pergunta: 'Como funcionam os alertas no ícone de sino do cabeçalho?',
    resposta:
      'O sino no cabeçalho sinaliza alertas importantes do sistema, como novos materiais compartilhados, notas divulgadas, avisos de prazos de entrega próximos e comunicados urgentes da coordenação.',
    perfis: [PERFIS.ALUNO, PERFIS.PROFESSOR, PERFIS.COORDENACAO],
    destaque: true,
    tags: ['notificacoes', 'sino', 'alertas', 'mensagens', 'prazos'],
  },
  {
    id: 'faq-noti-2',
    categoriaId: 'notificacoes',
    pergunta: 'Posso receber avisos de notas e faltas por e-mail?',
    resposta:
      'Sim. O EPIS envia notificações automáticas para o e-mail institucional cadastrado em eventos críticos, tais como lançamento de notas de avaliações, homologação de matrícula e comunicados gerais.',
    perfis: [PERFIS.ALUNO],
    destaque: true,
    tags: ['email', 'alertas', 'notas', 'faltas', 'configuracoes'],
  },
  {
    id: 'faq-noti-3',
    categoriaId: 'notificacoes',
    pergunta:
      'Como a coordenação monitora o envio de notificações de prazos regimentais?',
    resposta:
      'O sistema administrativo permite auditar disparos automatizados de lembretes aos professores sobre encerramento de prazos de diários e aos discentes sobre encerramento de matrícula e trancamento.',
    perfis: [PERFIS.COORDENACAO],
    destaque: false,
    tags: [
      'coordenacao',
      'disparo',
      'auditoria',
      'lembretes',
      'prazos regimentais',
    ],
  },
  {
    id: 'faq-noti-4',
    categoriaId: 'notificacoes',
    pergunta:
      'O professor é notificado quando um aluno submete um trabalho em atraso?',
    resposta:
      'Sim. Ao acessar a Turma Virtual ou receber a notificação no sistema, o professor visualiza a indicação de submissão com a data/hora exata e o selo informativo de envio com atraso.',
    perfis: [PERFIS.PROFESSOR],
    destaque: false,
    tags: ['professor', 'atraso', 'submissao', 'alertas', 'trabalhos'],
  },
]
