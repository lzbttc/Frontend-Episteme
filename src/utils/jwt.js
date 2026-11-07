export function decodificarPayloadJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function expiracaoDoToken(token) {
  const exp = decodificarPayloadJwt(token)?.exp
  return typeof exp === 'number' ? exp * 1000 : null
}

export function usuarioEhAdmin(token) {
  if (!token) return false
  const payload = decodificarPayloadJwt(token)
  return Boolean(payload?.e_admin)
}
