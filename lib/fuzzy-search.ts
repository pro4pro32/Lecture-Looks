export function createSearchTokens(parts: string[]): string[] {
  return parts
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9ąćęłńóśźż]+/i)
    .filter(Boolean);
}

function isSubsequence(query: string, target: string): boolean {
  let queryIndex = 0;

  for (let i = 0; i < target.length && queryIndex < query.length; i += 1) {
    if (target[i] === query[queryIndex]) {
      queryIndex += 1;
    }
  }

  return queryIndex === query.length;
}

export function fuzzyMatch(query: string, searchableTokens: string[]): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return searchableTokens.some((token) => token.includes(normalizedQuery) || isSubsequence(normalizedQuery, token));
}
