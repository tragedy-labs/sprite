export const endpoints = {
  query: '/api/v1/query',
  command: '/api/v1/command',
  beginTransaction: '/api/v1/begin',
  commitTransaction: '/api/v1/commit',
  rollbackTransaction: '/api/v1/rollback'
} as const;
