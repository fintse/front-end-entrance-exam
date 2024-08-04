import "../css/style.css";
// import 'jspdf/dist/jspdf.plugin.html2pdf';
import html2pdf from 'html2pdf.js';

document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('.section-item');

  sections.forEach((section, sectionIndex) => {
    const editableElements = section.querySelectorAll('.editable');
    editableElements.forEach((element, elementIndex) => {
      const key = `section-${sectionIndex + 1}-element-${elementIndex + 1}`;
      element.setAttribute('data-key', key);
      
      if (localStorage.getItem(key)) {
        element.textContent = localStorage.getItem(key);
      }
    });
  });

  sections.forEach(section => {
    const editIcon = section.querySelector('.edit-icon');
    const saveIcon = section.querySelector('.save-icon');
    const cancelIcon = section.querySelector('.cancel-icon');
    const editableElements = section.querySelectorAll('.editable');
    const saveCancelWrapper = section.querySelector('.section-item__buttons.save');
    const editIconWrapper = section.querySelector('.section-item__buttons.edit');

    let initialContent = [];
    let isEditing = false;

    function endEditing() {
      editableElements.forEach((element, index) => {
        element.removeAttribute('contenteditable');
        element.classList.remove('editing');
      });
      saveCancelWrapper.classList.remove('visible');
      saveCancelWrapper.classList.add('hidden');
      editIconWrapper.classList.remove('hidden');
      isEditing = false;
    }

    function triggerRippleEffect(parent, event, color) {
      const rippleWrapper = parent.querySelector('.ripple-wrapper');
      const rect = rippleWrapper.getBoundingClientRect();
      const ripple = document.createElement('span');

      const rippleSize = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = rippleSize + 'px';
      ripple.style.left = event.clientX - rect.left - rippleSize / 2 + 'px';
      ripple.style.top = event.clientY - rect.top - rippleSize / 2 + 'px';
      ripple.className = `ripple ${color}`;

      rippleWrapper.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    }

    document.addEventListener('click', function (event) {
      if (isEditing && !section.contains(event.target)) {
        triggerRippleEffect(section, event, 'red');
        editableElements.forEach((element, index) => {
          element.textContent = initialContent[index];
        });
        endEditing();
      }
    });

    if (editIcon) {
      editIcon.addEventListener('click', function () {
        initialContent = Array.from(editableElements).map(element => element.textContent);
        editableElements.forEach(element => {
          element.setAttribute('contenteditable', 'true');
          element.classList.add('editing');
          saveCancelWrapper.classList.remove('hidden');
          saveCancelWrapper.classList.add('visible');
          editIconWrapper.classList.add('hidden');
        });
        isEditing = true;
      });
    }

    if (saveIcon) {
      saveIcon.addEventListener('click', function (event) {
        editableElements.forEach(element => {
          const key = element.getAttribute('data-key');
          localStorage.setItem(key, element.textContent);
        });
        triggerRippleEffect(section, event, 'green');
        endEditing();
      });
    }

    if (cancelIcon) {
      cancelIcon.addEventListener('click', function (event) {
        triggerRippleEffect(section, event, 'red');
        editableElements.forEach((element, index) => {
          element.textContent = initialContent[index];
        });
        endEditing();
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('downloadPDF');

  button.addEventListener('click', function (event) {
    // Удаление предыдущих риппл элементов
    const existingRipples = button.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());

    // Создание риппл элемента
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    // Вычисление размеров и положения риппл элемента
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    // Добавление риппл элемента на кнопку
    button.appendChild(ripple);
  });
});

const button = document.getElementById('downloadPDF');

function generatePDF() {
  const element = document.querySelector('.resume');
  html2pdf().from(element).save();
}

button.addEventListener('click', generatePDF);
