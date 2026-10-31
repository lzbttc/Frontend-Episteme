/**
 * Constantes centralizadas de rotas da aplicação.
 */
export const PATHS = {
  login: '/login',
  inicio: '/inicio',
  minhasDisciplinas: '/minhas-disciplinas',
  emBreve: '/em-breve',
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
