import type { AiResult } from '@/shared/types'

export const mockAiResult: AiResult = {
  summary:
    'LinkNest es un portfolio web para developers hecho sobre todo en JavaScript y CSS. ' +
    'El repositorio tiene actividad constante en las últimas doce semanas, con picos claros de trabajo. ' +
    'Un contribuidor concentra más de la mitad de los commits, así que el proyecto depende mucho de una sola persona. ' +
    'La documentación cubre instalación y uso, pero faltan pruebas y guías para contribuir.',
  score: 3.7,
  strengths: [
    'Actividad regular: commits casi todas las semanas.',
    'README claro con pasos de instalación y uso.',
    'Licencia MIT definida, lista para reutilizarse.',
  ],
  improvements: [
    'Agregar pruebas automáticas y un workflow de CI en GitHub Actions.',
    'Incluir un CONTRIBUTING.md para repartir mejor el trabajo entre contribuidores.',
    'Migrar el código JavaScript restante a TypeScript para ganar mantenibilidad.',
  ],
}
