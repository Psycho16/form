'use strict';
(function () {
  function validateNumber(value, min, max) {
    value = parseInt(value);
    if (isNaN(value) || value < parseInt(min) || value > parseInt(max)) {
        return false;
    }
    return true;
}

function validateRegExp(value, pattern, flags) {
    let regExp = new RegExp(pattern, flags);

    return regExp.test(value);
}

function validateValue(value, dataset) {
    switch(dataset.validator) {
        case 'letters': 
            return validateRegExp(value, '^[a-zа-яё]+$', 'i');
        case 'number': 
            return validateNumber(value, dataset.validatorMin, dataset.validatorMax);
        case 'regexp': 
            return validateRegExp(value, dataset.validatorPattern);
        default: 
            return true;
    };
}

function checkInput(element) {
    let value = element.value;

    if (element.dataset.hasOwnProperty('required') && !value) {
        return false;
    }

    let validator = element.dataset.validator;
    return (validator && value) ? validateValue(value, element.dataset) : true;
};

  //Код валидации формы
  window.validateForm = function (options) {
    const form = document.querySelector('.form');
    let inputs = Array.from(form.querySelectorAll('input'));

    form.addEventListener('focus', (event) => {
      let target = event.target;
      if (target.tagName === 'INPUT') {
        target.classList.remove(options.inputErrorClass);
      }
    }, true);

    form.addEventListener('blur', (event) => {
      let target = event.target;
      if (target.tagName === 'INPUT') {
        if (!checkInput(target)){
          target.classList.add(options.inputErrorClass);
        }
      }
    }, true);

    form.addEventListener('submit', (event) => {
      // let target = event.target;
      event.preventDefault();
      form.classList.remove(options.formValidClass);
      form.classList.remove(options.formInvalidClass);

        let hasError = false;
        inputs.forEach((currentInput) => {
          if(!checkInput(currentInput)) {
            currentInput.classList.add(options.inputErrorClass);
            hasError = true;
          }
        });

        hasError ? form.classList.add(options.formInvalidClass) : form.classList.add(options.formValidClass);
  
    });
  }
}
())
