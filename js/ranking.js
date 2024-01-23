function createDropdown() {
  var newDiv = document.createElement('div');
  newDiv.classList.add('dropdown');
  // newDiv.style.height = '17%';

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

// 드롭다운 이벤트
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function slide(dropdown) {
  // if (subToggle) {
    for (let i = 13; i < 17; i++) {
      dropdown.style.height = `${i}%`;
      await sleep(1);
    }
}

const rank = document.getElementsByClassName('rank-box');

function showDropdown(button) {
  const dropdown = document.getElementsByClassName('dropdown');
  Array.from(rank).forEach(function (e, i) {
    if (e === button) {
      Array.from(dropdown)[i].style.display = 'block';
      slide(Array.from(dropdown)[i]);
      // Array.from(dropdown)[i].style.transitionTimingFunction = 'ease-out';

    } else {
      Array.from(dropdown)[i].style.display = '';
    }
  });
}