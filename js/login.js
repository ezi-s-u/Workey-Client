const pw = document.getElementById('password');
const visibleIcon = document.querySelector('.visible-btn')

// 비번 보이기 안보이기
function passwordVisible() {
  pw.classList.toggle('active');
  console.log(visibleIcon);

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
  console.log('writePw');
  if (value.trim() !== '') {
    visibleIcon.style.display = 'block';
  } else {
    visibleIcon.style.display = 'none';
  }
}