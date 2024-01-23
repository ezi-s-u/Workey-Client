function createDropdown() {
  var newDiv = document.createElement('div');
  newDiv.classList.add('dropdown');

  var scoreBox = document.createElement('div');
  scoreBox.classList.add('score-box');

  var img = document.createElement('img');
  img.src = './img/state_good.svg';
  img.alt = '이미지 설명';

  var br = document.createElement('br');

  var span = document.createElement('span');
  span.classList.add('number');
  span.textContent = '3,500';

  // score-box에 img, br, span을 추가합니다.
  scoreBox.appendChild(img);
  scoreBox.appendChild(br);
  scoreBox.appendChild(span);

  // dropdown에 score-box를 추가합니다.
  newDiv.appendChild(scoreBox);

  return newDiv;
}

const rank = document.getElementsByClassName('rank-box');
console.log(rank);


function showDropdown(button) {
  const dropdown = document.getElementsByClassName('dropdown');
  console.log(dropdown);
  Array.from(rank).forEach(function(e, i) {
    if ( e === button ) {
      Array.from(dropdown)[i].style.display = 'block';
    } else {
      Array.from(dropdown)[i].style.display = '';
    }
  });
  
  // button.addEventListener('blur', () => {
  //   const dropdown = document.querySelector('.dropdown');
    
  //   // 0.2초 뒤에 실행
  //   // setTimeout(() => {
  //     dropdown.style.display = '';
  //   // }, 100);
  // });
}