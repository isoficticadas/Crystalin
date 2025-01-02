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

  // Manejar envío del formulario
  const handleFormSubmit = (formId) => {
    const form = document.getElementById(formId);

    if (!form) {
      console.error(`Formulario con ID ${formId} no encontrado.`);
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.submit(); // Deja que el navegador maneje la redirección
    });
  };

  // Manejar los formularios
  ["dataForm", "dataForm2", "dataForm3"].forEach(handleFormSubmit);
});
