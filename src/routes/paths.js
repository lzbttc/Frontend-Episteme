
/**
 * Constantes centralizadas de rotas da aplicação.
 */
export const PATHS = {
  login: '/login',
  inicio: '/inicio',
  noticias: '/noticias',
  minhasDisciplinas: '/minhas-disciplinas',
  ajuda: '/ajuda',
  emBreve: '/em-breve',
  gerenciamentoNoticias: '/gerenciamento-noticias',
  notificacoes: '/notificacoes',
  meuPerfil: '/meu-perfil',
  matricula: '/matricula',
  matriculaRevisao: '/matricula/revisao',
  matriculaComprovante: '/matricula/comprovante/:protocolo',
  matriculaSolicitacoes: '/matricula/solicitacoes',
}

/**
 * Retorna o caminho para o comprovante de uma solicitação específica.
 *
 * @param {string} protocolo - UUID do protocolo
 * @returns {string}
 */
export function matriculaComprovantePath(protocolo) {
  return `/matricula/comprovante/${protocolo}`
}

/**
 * Retorna o caminho da turma virtual para uma disciplina específica.
 *
 * @param {string} id - Identificador da disciplina (ex.: "bd002")
 * @returns {string} Rota dinâmica da turma virtual
 */
export function turmaPath(id) {
  return `/turma-virtual/${id}`
}
