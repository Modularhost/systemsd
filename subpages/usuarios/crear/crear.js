// Función para mostrar/ocultar sección de permisos basada en rol
function togglePermisos() {
  const rol = document.getElementById('rol').value;
  const permisosSection = document.getElementById('permisosSection');
  if (rol === 'administrador') {
    permisosSection.style.display = 'none';
  } else {
    permisosSection.style.display = 'block';
  }
}

// Evento para el formulario
document.getElementById('crearUsuarioForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = {
    nombreCompleto: document.getElementById('nombreCompleto').value,
    nombreUsuario: document.getElementById('nombreUsuario').value,
    rut: document.getElementById('rut').value,
    fechaNacimiento: document.getElementById('fechaNacimiento').value,
    correo: document.getElementById('correo').value,
    sexo: document.getElementById('sexo').value,
    rol: document.getElementById('rol').value,
    permisos: []
  };

  if (formData.rol !== 'administrador') {
    document.querySelectorAll('#permisosSection input[type="checkbox"]:checked').forEach(checkbox => {
      formData.permisos.push(checkbox.value);
    });
  } else {
    formData.permisos = 'all'; // Administrador tiene todos los permisos
  }

  // Simular guardado en localStorage (para maqueta)
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  usuarios.push(formData);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  alert('Usuario creado exitosamente!');
  // Limpiar formulario
  document.getElementById('crearUsuarioForm').reset();
  togglePermisos();
});