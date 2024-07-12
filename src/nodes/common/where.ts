export function where<T extends Array<unknown>>(statement: T) {
  let value: string;
  if (typeof statement[2] === 'object') {
    value = JSON.stringify(statement[2]);
  } else {
    value = `'${statement[2]}'`;
  }
  return `WHERE ${statement[0]} ${statement[1]} ${value}`;
}
