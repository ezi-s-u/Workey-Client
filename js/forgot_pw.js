const checkIcon = document.getElementByClassName('check-icon');
const divInput = [...document.getElementById('div-input')];

// First Name, Last Name, Password
function writeData(value) {
  if (value.trim() !== '') {
      divInput[0].style.borderBottom = '1px solid #9F57FB';
  } else {
    divInput[0].style.borderBottom = '1px solid #868686';
  }
}

// Check Password
function checkPassword(value) {
  const password = document.getElementById('password');
  if(value === password.value) {
    checkIcon.style.display = 'block';
    divInput[1].style.borderBottom = '1px solid #9F57FB';
  } else {
    checkIcon.style.display = 'none';
    divInput[1].style.borderBottom = '1px solid #868686';
  }
}