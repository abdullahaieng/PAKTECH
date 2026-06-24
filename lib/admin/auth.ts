export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("paktech-admin-token");
}

export function logout(): void {
  localStorage.removeItem("paktech-admin-token");
  localStorage.removeItem("paktech-admin-email");
}

export function saveAuth(token: string, email: string): void {
  localStorage.setItem("paktech-admin-token", token);
  localStorage.setItem("paktech-admin-email", email);
}
