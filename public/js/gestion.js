// Lógica para eliminar productos duplicados
document.getElementById('clearDuplicatesBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('/productos/eliminar-duplicados', {
      method: 'GET'
    });

    const result = await response.json();

    if (result.success) {
      alert('Duplicados eliminados con éxito.');
      // Opcional: Recargar los productos después de eliminar duplicados
      location.reload();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Error al intentar eliminar duplicados.');
    console.error(error);
  }
});

// Lógica para eliminar duplicados de clientes
document.getElementById('clearClientsDuplicatesBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('/clientes/eliminar-duplicados', {
      method: 'GET'
    });

    const result = await response.json();

    if (result.success) {
      alert('Duplicados de clientes eliminados con éxito.');
      // Opcional: Recargar los clientes después de eliminar duplicados
      location.reload();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Error al intentar eliminar duplicados de clientes.');
    console.error(error);
  }
});

// Muestra el nombre del archivo seleccionado para Clientes
document.getElementById('uploadClientsExcel').addEventListener('change', function() {
  const fileName = this.files[0].name;
  document.getElementById('fileNameClient').textContent = `Archivo seleccionado: ${fileName}`;
});

// Muestra el nombre del archivo seleccionado para Productos
document.getElementById('uploadProductsExcel').addEventListener('change', function() {
  const fileName = this.files[0].name;
  document.getElementById('fileNameProduct').textContent = `Archivo seleccionado: ${fileName}`;
});

// Subir archivo de Clientes
document.getElementById('uploadClientsBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('uploadClientsExcel');
  const file = fileInput.files[0];

  if (!file) {
    alert('Por favor selecciona un archivo primero.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/upload-clients-excel', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      const notification = document.getElementById('notification');
      notification.textContent = `Archivo cargado con éxito: ${file.name}`;
      notification.classList.add('show');

      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Error al procesar el archivo.');
  }
});

// Subir archivo de Productos
document.getElementById('uploadProductsBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('uploadProductsExcel');
  const file = fileInput.files[0];

  if (!file) {
    alert('Por favor selecciona un archivo primero.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/upload-products-excel', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      const notification = document.getElementById('notification');
      notification.textContent = `Archivo cargado con éxito: ${file.name}`;
      notification.classList.add('show');

      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Error al procesar el archivo.');
  }
});

// Obtener y mostrar los clientes
fetch('/clientes')
  .then(response => response.json())
  .then(data => {
    const clientesList = document.getElementById('clientes-list');
    document.getElementById('clientes-count').textContent = `Cantidad de Clientes: ${data.length}`;
    data.forEach(cliente => {
      const li = document.createElement('li');
      li.textContent = `${cliente.name} - ${cliente.storeName}`;
      clientesList.appendChild(li);
    });
  })
  .catch(error => console.error('Error obteniendo los clientes:', error));

// Obtener y mostrar los productos
fetch('/productos')
  .then(response => response.json())
  .then(data => {
    const productosList = document.getElementById('productos-list');
    document.getElementById('productos-count').textContent = `Cantidad de Productos: ${data.length}`;
    data.forEach(producto => {
      const li = document.createElement('li');
      li.textContent = `${producto.Codigo} - ${producto.Descripcion} - ${producto.PrecioLista}`;
      productosList.appendChild(li);
    });
  })
  .catch(error => console.error('Error obteniendo los productos:', error));

// Obtener y mostrar los pedidos
fetch('/pedidos')
  .then(response => response.json())
  .then(data => {
    const pedidosList = document.getElementById('ordersView');
    document.getElementById('pedidos-count').textContent = `Cantidad de Pedidos: ${data.length}`;
    data.forEach(pedido => {
      const li = document.createElement('li');
      li.textContent = `Pedido de ${pedido.cliente} - Total: ${pedido.total}`;
      pedidosList.appendChild(li);
    });
  })
  .catch(error => console.error('Error obteniendo los pedidos:', error));
