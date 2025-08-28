
({
  administrador: {
    menu: true,
    submenus: {
      'laboratorio-analisis': true,
      'laboratorio-resultados': true
    },
    containers: {
      'laboratorio-analisis-formulario': true,
      'laboratorio-analisis-tabla': true,
      'laboratorio-resultados-formulario': true,
      'laboratorio-resultados-tabla': true
    },
    elements: {
      'laboratorio-analisis-formulario-campo-muestra': true,
      'laboratorio-analisis-formulario-campo-tipo': true,
      'laboratorio-analisis-formulario-boton-analizar': true,
      'laboratorio-analisis-tabla-columna-id': true,
      'laboratorio-analisis-tabla-columna-resultado': true,
      'laboratorio-analisis-tabla-paginacion': true,
      'laboratorio-analisis-tabla-boton-exportar': true,
      'laboratorio-resultados-tabla-columna-id': true,
      'laboratorio-resultados-tabla-columna-resultado': true
    }
  },
  operador: {
    menu: true,
    submenus: {
      'laboratorio-analisis': true,
      'laboratorio-resultados': false
    },
    containers: {
      'laboratorio-analisis-formulario': true,
      'laboratorio-analisis-tabla': true
    },
    elements: {
      'laboratorio-analisis-formulario-campo-muestra': true,
      'laboratorio-analisis-formulario-campo-tipo': true,
      'laboratorio-analisis-formulario-boton-analizar': true,
      'laboratorio-analisis-tabla-columna-id': true,
      'laboratorio-analisis-tabla-columna-resultado': true,
      'laboratorio-analisis-tabla-paginacion': true,
      'laboratorio-analisis-tabla-boton-exportar': false
    }
  },
  gestor: {
    menu: true,
    submenus: {
      'laboratorio-analisis': true,
      'laboratorio-resultados': true
    },
    containers: {
      'laboratorio-analisis-formulario': true,
      'laboratorio-analisis-tabla': true,
      'laboratorio-resultados-formulario': true,
      'laboratorio-resultados-tabla': true
    },
    elements: {
      'laboratorio-analisis-formulario-campo-muestra': true,
      'laboratorio-analisis-formulario-campo-tipo': true,
      'laboratorio-analisis-formulario-boton-analizar': true,
      'laboratorio-analisis-tabla-columna-id': true,
      'laboratorio-analisis-tabla-columna-resultado': true,
      'laboratorio-analisis-tabla-paginacion': true,
      'laboratorio-analisis-tabla-boton-exportar': true,
      'laboratorio-resultados-tabla-columna-id': true,
      'laboratorio-resultados-tabla-columna-resultado': true
    }
  },
  structure: {
    submenus: [
      {
        id: 'analisis',
        text: 'Análisis',
        containers: [
          {
            id: 'formulario',
            text: 'Formulario',
            elements: [
              { id: 'campo-muestra', text: 'Campo Muestra' },
              { id: 'campo-tipo', text: 'Campo Tipo' },
              { id: 'boton-analizar', text: 'Botón Analizar' }
            ]
          },
          {
            id: 'tabla',
            text: 'Tabla',
            elements: [
              { id: 'columna-id', text: 'Columna ID' },
              { id: 'columna-resultado', text: 'Columna Resultado' },
              { id: 'paginacion', text: 'Paginación' },
              { id: 'boton-exportar', text: 'Botón Exportar' }
            ]
          }
        ]
      },
      {
        id: 'resultados',
        text: 'Resultados',
        containers: [
          {
            id: 'formulario',
            text: 'Formulario',
            elements: [
              { id: 'campo-resultado', text: 'Campo Resultado' }
            ]
          },
          {
            id: 'tabla',
            text: 'Tabla',
            elements: [
              { id: 'columna-id', text: 'Columna ID' },
              { id: 'columna-resultado', text: 'Columna Resultado' }
            ]
          }
        ]
      }
    ]
  }
})
