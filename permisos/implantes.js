
({
  administrador: {
    menu: true,
    submenus: {
      'implantes-ingresos': true,
      'implantes-cargar': true,
      'implantes-pacientes': true,
      'implantes-referencias': true
    },
    containers: {
      'implantes-ingresos-formulario': true,
      'implantes-ingresos-tabla': true,
      'implantes-cargar-formulario': true,
      'implantes-cargar-tabla': true,
      'implantes-pacientes-formulario': true,
      'implantes-pacientes-tabla': true,
      'implantes-referencias-formulario': true,
      'implantes-referencias-tabla': true
    },
    elements: {
      'implantes-ingresos-formulario-campo-nombre': true,
      'implantes-ingresos-formulario-campo-rut': true,
      'implantes-ingresos-formulario-campo-fecha': true,
      'implantes-ingresos-formulario-boton-registrar': true,
      'implantes-ingresos-formulario-boton-limpiar': true,
      'implantes-ingresos-tabla-columna-id': true,
      'implantes-ingresos-tabla-columna-nombre': true,
      'implantes-ingresos-tabla-columna-rut': true,
      'implantes-ingresos-tabla-columna-fecha': true,
      'implantes-ingresos-tabla-paginacion': true,
      'implantes-ingresos-tabla-boton-descargar': true,
      'implantes-ingresos-tabla-boton-importar': true,
      'implantes-cargar-formulario-campo-archivo': true,
      'implantes-cargar-formulario-campo-descripcion': true,
      'implantes-cargar-formulario-boton-subir': true,
      'implantes-cargar-formulario-boton-limpiar': true,
      'implantes-cargar-tabla-columna-id': true,
      'implantes-cargar-tabla-columna-archivo': true,
      'implantes-cargar-tabla-columna-fecha': true,
      'implantes-cargar-tabla-paginacion': true,
      'implantes-cargar-tabla-boton-descargar': true,
      'implantes-cargar-tabla-boton-importar': true,
      'implantes-cargar-tabla-boton-editar': true,
      // Agrega más para pacientes y referencias
    }
  },
  operador: {
    menu: true,
    submenus: {
      'implantes-ingresos': false,
      'implantes-cargar': true,
      'implantes-pacientes': false,
      'implantes-referencias': false
    },
    containers: {
      'implantes-cargar-formulario': true,
      'implantes-cargar-tabla': true
    },
    elements: {
      'implantes-cargar-formulario-campo-archivo': true,
      'implantes-cargar-formulario-campo-descripcion': true,
      'implantes-cargar-formulario-boton-subir': true,
      'implantes-cargar-formulario-boton-limpiar': true,
      'implantes-cargar-tabla-columna-id': true,
      'implantes-cargar-tabla-columna-archivo': true,
      'implantes-cargar-tabla-columna-fecha': true,
      'implantes-cargar-tabla-paginacion': true,
      'implantes-cargar-tabla-boton-descargar': false, // Oculta descargar
      'implantes-cargar-tabla-boton-importar': true,
      'implantes-cargar-tabla-boton-editar': true
    }
  },
  gestor: {
    menu: true,
    submenus: {
      'implantes-ingresos': true,
      'implantes-cargar': true,
      'implantes-pacientes': true,
      'implantes-referencias': false
    },
    containers: {
      'implantes-ingresos-formulario': true,
      'implantes-ingresos-tabla': true,
      'implantes-cargar-formulario': true,
      'implantes-cargar-tabla': true,
      'implantes-pacientes-formulario': true,
      'implantes-pacientes-tabla': true
    },
    elements: {
      'implantes-ingresos-formulario-campo-nombre': true,
      'implantes-ingresos-formulario-campo-rut': true,
      'implantes-ingresos-formulario-campo-fecha': true,
      'implantes-ingresos-formulario-boton-registrar': true,
      'implantes-ingresos-formulario-boton-limpiar': true,
      'implantes-ingresos-tabla-columna-id': true,
      'implantes-ingresos-tabla-columna-nombre': true,
      'implantes-ingresos-tabla-columna-rut': true,
      'implantes-ingresos-tabla-columna-fecha': true,
      'implantes-ingresos-tabla-paginacion': true,
      'implantes-ingresos-tabla-boton-descargar': true,
      'implantes-ingresos-tabla-boton-importar': true,
      'implantes-cargar-formulario-campo-archivo': true,
      'implantes-cargar-formulario-campo-descripcion': true,
      'implantes-cargar-formulario-boton-subir': true,
      'implantes-cargar-formulario-boton-limpiar': true,
      'implantes-cargar-tabla-columna-id': true,
      'implantes-cargar-tabla-columna-archivo': true,
      'implantes-cargar-tabla-columna-fecha': true,
      'implantes-cargar-tabla-paginacion': true,
      'implantes-cargar-tabla-boton-descargar': true,
      'implantes-cargar-tabla-boton-importar': true,
      'implantes-cargar-tabla-boton-editar': true
    }
  },
  structure: {
    submenus: [
      {
        id: 'ingresos',
        text: 'Ingresos',
        containers: [
          {
            id: 'formulario',
            text: 'Formulario',
            elements: [
              { id: 'campo-nombre', text: 'Campo Nombre' },
              { id: 'campo-rut', text: 'Campo RUT' },
              { id: 'campo-fecha', text: 'Campo Fecha' },
              { id: 'boton-registrar', text: 'Botón Registrar' },
              { id: 'boton-limpiar', text: 'Botón Limpiar' }
            ]
          },
          {
            id: 'tabla',
            text: 'Tabla',
            elements: [
              { id: 'columna-id', text: 'Columna ID' },
              { id: 'columna-nombre', text: 'Columna Nombre' },
              { id: 'columna-rut', text: 'Columna RUT' },
              { id: 'columna-fecha', text: 'Columna Fecha' },
              { id: 'paginacion', text: 'Paginación' },
              { id: 'boton-descargar', text: 'Botón Descargar' },
              { id: 'boton-importar', text: 'Botón Importar' }
            ]
          }
        ]
      },
      {
        id: 'cargar',
        text: 'Cargar',
        containers: [
          {
            id: 'formulario',
            text: 'Formulario',
            elements: [
              { id: 'campo-archivo', text: 'Campo Archivo' },
              { id: 'campo-descripcion', text: 'Campo Descripción' },
              { id: 'boton-subir', text: 'Botón Subir' },
              { id: 'boton-limpiar', text: 'Botón Limpiar' }
            ]
          },
          {
            id: 'tabla',
            text: 'Tabla',
            elements: [
              { id: 'columna-id', text: 'Columna ID' },
              { id: 'columna-archivo', text: 'Columna Archivo' },
              { id: 'columna-fecha', text: 'Columna Fecha' },
              { id: 'paginacion', text: 'Paginación' },
              { id: 'boton-descargar', text: 'Botón Descargar' },
              { id: 'boton-importar', text: 'Botón Importar' },
              { id: 'boton-editar', text: 'Botón Editar' }
            ]
          }
        ]
      },
      {
        id: 'pacientes',
        text: 'Pacientes',
        containers: [
          {
            id: 'formulario',
            text: 'Formulario',
            elements: [
              { id: 'campo-nombre', text: 'Campo Nombre' },
              { id: 'campo-rut', text: 'Campo RUT' }
            ]
          },
          {
            id: 'tabla',
            text: 'Tabla',
            elements: [
              { id: 'columna-id', text: 'Columna ID' },
              { id: 'columna-nombre', text: 'Columna Nombre' }
            ]
          }
        ]
      },
      {
        id: 'referencias',
        text: 'Referencias',
        containers: [
          {
            id: 'formulario',
            text: 'Formulario',
            elements: [
              { id: 'campo-referencia', text: 'Campo Referencia' }
            ]
          },
          {
            id: 'tabla',
            text: 'Tabla',
            elements: [
              { id: 'columna-id', text: 'Columna ID' }
            ]
          }
        ]
      }
    ]
  }
})
