// src/utilities/getServerSideURL.ts
export function getServerSideURL(): string {
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}
