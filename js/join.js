const checkIcons = [...document.getElementsByClassName('check-icon')];
const divInput = [...document.getElementsByClassName('div-input')];

const warningIcon = document.getElementById('warning-icon')
const warningMessage = document.getElementById('warning-message')

// other 나라 input 나타내기
function changeCompanySelect() {
  const selectElement = document.getElementById('companies');
  const otherInput = document.getElementById('otherInput');

  otherInput.style.display = (selectElement.value === 'others') ? 'block' : 'none';

}

// First Name, Last Name, Password
function writeData(value, index) {
  if (value.trim() !== '') {
      checkIcons[index].style.display = 'block';
      divInput[index].style.borderBottom = '1px solid #9F57FB';
  } else {
    checkIcons[index].style.display = 'none';
    divInput[index].style.borderBottom = '1px solid #868686';
  }
}

// Email
function checkEmail(value) {
  if (value.trim() !== '') {
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(value)) {
      // 이메일 형식이 아닐 때
      warningIcon.style.display = 'block';
      warningMessage.style.display = 'block';
      checkIcons[2].style.display = 'none';
      divInput[2].style.borderBottom = '1px solid #C36C64';
    } else {
      // 이메일 형식이 맞을 때
      warningIcon.style.display = 'none';
      warningMessage.style.display = 'none';
      checkIcons[2].style.display = 'block';
      divInput[2].style.borderBottom = '1px solid #9F57FB';
    }
  } else {
    // 아무것도 적히지 않았을 때
    warningIcon.style.display = 'none';
    warningMessage.style.display = 'none';
    checkIcons[2].style.display = 'none';
    divInput[2].style.borderBottom = '1px solid #868686';
  }
}

// function regexEmail(str){                                                 
//   var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
//   if(!reg_email.test(str)) {                            
//     return false;         
//   }else {                       
//     return true;         
//   }                            
// }

// Check Password
function checkPassword(value) {
  const password = document.getElementById('password');
  if(value === password.value) {
    checkIcons[4].style.display = 'block';
    divInput[4].style.borderBottom = '1px solid #9F57FB';
  } else {
    checkIcons[4].style.display = 'none';
    divInput[4].style.borderBottom = '1px solid #868686';
  }
}