const checkIcon = document.getElementById('check-icon');
const divInput = [...document.querySelectorAll('.div-input')];
console.log(divInput);

const pw = document.getElementById('password');

const checkPw = document.getElementById('check-password');
// const visibleIcon = document.querySelector('.visible-btn');

// 비번 보이기 안보이기
function passwordVisible() {
  const visibleIcon = document.querySelector('.visible-btn');
  pw.classList.toggle('active');

  if (pw.classList.contains('active')) {
    visibleIcon.style.backgroundImage = 'url("../img/icon_visible.svg")';
    pw.type = "text";
  } else {
    visibleIcon.style.backgroundImage = 'url("../img/icon_invisible.svg")';
    pw.type = "password";
  }
}

// 비번 보이기 버튼
function writePw(value) {
  checkPassword(checkPw.value)
  const visibleIcon = document.querySelector('.visible-btn');
  console.log('writePw');
  if (value.trim() !== '') {
    visibleIcon.style.display = 'block';
    divInput[0].style.borderBottom = '1px solid #9F57FB';
  } else {
    visibleIcon.style.display = 'none';
    divInput[0].style.borderBottom = '1px solid #868686';
  }
}

// // First Name, Last Name, Password
// function writeData(value) {
//   console.log('writeData');
//   if (value.trim() !== '') {
//       divInput[0].style.borderBottom = '1px solid #9F57FB';
//   } else {
//   }
// }

// Check Password
function checkPassword(value) {
  console.log('checkPassword');
  const password = document.getElementById('password');
  if(value === password.value && value.trim() !== "") {
    checkIcon.style.display = 'block';
    divInput[1].style.borderBottom = '1px solid #9F57FB';
  } else {
    checkIcon.style.display = 'none';
    divInput[1].style.borderBottom = '1px solid #868686';
  }
}