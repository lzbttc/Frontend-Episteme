/**
 * Mock de dados acadêmicos para a tela Meu Perfil.
 *
 * Estes dados simulam informações que ainda não possuem endpoints dedicados
 * no backend, como: turno, semestre letivo atual, situação de matrícula,
 * integralização curricular, campus e contagens de disciplinas.
 *
 * TODO: Substituir por chamadas reais à API quando os endpoints estiverem disponíveis.
 *
 * Dados reais (via API):
 *   - nome, email, cpf, telefone, matricula, e_admin, data_nascimento, endereco → GET /usuarios/{id}
 *   - curso_id, matricula_id → GET /turma/alunos/usuario_id/{id}
 *   - media_geral, frequencia_geral, horas_complementares → GET /academico/alunos/me/resumo
 *   - nome do curso → GET /academico/cursos/{curso_id}
 */
export const MOCK_DADOS_ACADEMICOS = {
  campus: 'Campus II',
  turno: 'Matutino / Integral',
  semestreLetivo: '2026.2 · 4º Semestre',
  situacao: 'Ativo',
  // Integralização curricular
  cargaHorariaIntegralizada: 1200,
  cargaHorariaTotal: 3200,
  // Contagens de disciplinas (mock até endpoint de integralização existir)
  disciplinasConcluidas: 18,
  disciplinasEmAndamento: 4,
}
