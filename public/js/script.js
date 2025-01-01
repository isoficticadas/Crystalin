document.addEventListener("DOMContentLoaded", () => {
    // Mostrar y ocultar la ventana emergente
    const feedbackButton = document.querySelector(".feedback");
    const popupWindow = document.querySelector(".popup-window");
    const closePopupButton = document.querySelector(".close-popup");
  
    if (feedbackButton) {
      feedbackButton.addEventListener("click", () => {
        popupWindow.style.display = "block";
      });
    }
  
    if (closePopupButton) {
      closePopupButton.addEventListener("click", () => {
        popupWindow.style.display = "none";
      });
    }
  
    // Validar formulario
    const validateForm = (nameInput, phoneInput) => {
      if (!nameInput || !phoneInput) {
        console.error("Uno o más campos del formulario no existen.");
        return false;
      }
  
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const namePattern = /^[A-Za-z\s]+$/;
      const phonePattern = /^\+593\d{9}$/;
  
      if (!name || !namePattern.test(name)) {
        alert("Por favor, ingrese un nombre válido. Solo se permiten letras y espacios.");
        nameInput.focus();
        return false;
      }
  
      if (!phonePattern.test(phone)) {
        alert("Por favor, ingrese un número de teléfono válido. Ejemplo: +593933543342");
        phoneInput.focus();
        return false;
      }
  
      return true;
    };
  
    // Manejar envío del formulario
    const handleFormSubmit = (formId) => {
      const form = document.getElementById(formId);
  
      if (!form) {
        console.error(`Formulario con ID ${formId} no encontrado.`);
        return;
      }
  
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        const nameInput = form.querySelector("input[name='name']");
        const phoneInput = form.querySelector("input[name='phone']");
  
        if (!validateForm(nameInput, phoneInput)) {
          return;
        }
  
        const requestData = {
          name: nameInput.value.trim(),
          phone: phoneInput.value.trim(),
        };
  
        try {
          const response = await fetch("/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });
  
          if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
          }
  
          alert("Sus datos fueron enviados y un agente se comunicará con usted dentro de 1 a 5 minutos.");
          form.reset();
        } catch (error) {
          alert("Error al enviar los datos. Por favor, inténtelo de nuevo.");
          console.error("Error al enviar los datos:", error);
        }
      });
    };
  
    // Manejar los formularios
    ["dataForm", "dataForm2", "dataForm3"].forEach(handleFormSubmit);
  });
  