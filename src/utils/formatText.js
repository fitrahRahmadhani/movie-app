const BASE_URL = 'https://image.tmdb.org/t/p'

export function tmdbImage(path, size = 'w500') {
  if (!path) return ''
  return `${BASE_URL}/${size}${path}`
}

export function formatYear(date) {
  return date.slice(0, 4)
}

export function formatImdb(vote) {
  if (typeof vote !== 'number') return '-'
  return vote.toFixed(1)
}
