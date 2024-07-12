export function content<T>(data: T) {
  return `CONTENT ${JSON.stringify(data)}`;
}
