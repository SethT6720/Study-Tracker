export function isTokenValid(token) {
    if (!token) return false;

    const parts = token.split('.');
    let payload = JSON.parse(atob(parts[1]));
    if (payload.exp * 1000 > Date.now()) {
        return true;
    }
    return false;
}