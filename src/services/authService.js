import { studentMock } from '../mocks/studentMock'

/**
 * Realiza autenticação do usuário.
 *
 * TODO(API): Quando a API real for integrada, este endpoint fará um POST HTTPS para /auth/login.
 * A sessão deverá utilizar cookies HttpOnly + SameSite do backend.
 * Nunca persistir a senha no cliente.
 *
 * @param {{ matricula: string, senha: string }} credenciais
 * @returns {Promise<{ student: Object }>}
 */
export async function login({ matricula, senha }) {
  if (!matricula?.trim() || !senha?.trim()) {
    throw new Error('Matrícula e senha são obrigatórias.')
  }

  // Simulação assíncrona de requisição de login
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    student: {
      ...studentMock.student,
      matricula: matricula.trim(),
    },
  }
}
