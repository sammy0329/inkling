// JWT를 localStorage에 보관.
const KEY = 'inkling_token'

export function getToken(): string | null {
  return localStorage.getItem(KEY)
}
export function setToken(token: string): void {
  localStorage.setItem(KEY, token)
}
export function clearToken(): void {
  localStorage.removeItem(KEY)
}
export function isLoggedIn(): boolean {
  return getToken() !== null
}
