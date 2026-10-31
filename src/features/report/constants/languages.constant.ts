export const MAX_VISIBLE = 7 // el color 8 queda para "Otros"

// Colores de GitHub por lenguaje, aclarados donde hace falta para verse sobre fondo oscuro.
// Los lenguajes que no estén aquí caen a la paleta de gráficas.
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#F1E05A',
  TypeScript: '#3178C6',
  CSS: '#A371F7',
  SCSS: '#C6538C',
  HTML: '#E34C26',
  Shell: '#89E051',
  Python: '#4B8BBE',
  Dockerfile: '#0DB7ED',
  Makefile: '#C98A5E',
  Lua: '#6C7BFF',
  Java: '#E76F51',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Ruby: '#CC342D',
  PHP: '#777BB4',
  Swift: '#F05138',
  Kotlin: '#B58CFF',
  C: '#8C98A8',
  'C++': '#F34B7D',
  'C#': '#68B340',
  Vue: '#41B883',
}
