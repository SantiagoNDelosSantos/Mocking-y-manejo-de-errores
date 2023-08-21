// Iniciar Socket:
const socket = io();

// Capturas del DOM:
const chatTable = document.getElementById('chat-table');
const btnEnviar = document.getElementById('btnEnv');
const userInput = document.getElementById("usuario");
const messageInput = document.getElementById("message");

// Escucha el evento "messages" enviado por el servidor
socket.on("messages", (messageResult) => {
  
  if (messageResult !== null) {
    
    let htmlMessages = "";

    // Recorremos los mensajes y los mostramos en el HTML
    htmlMessages += `
      <thead>
        <tr>
            <th>Usuario</th>
            <th>Mensaje</th>
            <th>Eliminar</th>
        </tr>
      </thead>`;

    messageResult.forEach((message) => {
      htmlMessages += `
      <tbody>
        <tr>
          <td>${message.user}</td>
          <td>${message.message}</td>
          <td><button type="submit" class="btnDeleteSMS boton" id="Eliminar${message._id}">Eliminar</button></td>
        </tr>
      </tbody>`;
    });

    // Insertamos los mensajes en el HTML
    chatTable.innerHTML = htmlMessages;

    // Agregar evento click al botón de eliminar
    messageResult.forEach((message) => {
      const deleteButton = document.getElementById(`Eliminar${message._id}`);
      deleteButton.addEventListener("click", () => {
        deleteMessage(message._id);
      });
    });

  } else {
    let notMessages = "";
    notMessages += `<p style="margin-bottom: 1em;">No hay mensajes disponibles.</p>`;
    chatTable.innerHTML = notMessages;
    return;
  }

})

// Eliminar mensajes: 

function deleteMessage(messageId) {
  if (messageId) {
    fetch(`/api/chat/${messageId}`, {
      method: 'DELETE',
    })
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      title: `Mensaje eliminado.`,
      icon: 'error'
    });
  }
}

// Enviar Mensaje:

// Manejador para el evento de enviar mensaje
btnEnviar.addEventListener("click", () => {

  const user = userInput.value;
  const messageText = messageInput.value;

  // Crear el objeto de mensaje
  const message = {
    user: user,
    message: messageText,
  };

  // Enviar el mensaje al servidor
  enviarMensajeAlServidor(message);

  // Limpiar los campos de entrada
  userInput.value = "";
  messageInput.value = "";
});

// Función para enviar el mensaje al servidor
function enviarMensajeAlServidor(message) {

  fetch('/api/chat/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    title: `Mensaje enviado.`,
    icon: 'success'
  });

}