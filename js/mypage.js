// 드롭다운 이벤트
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function slide(dropdown) {
    for (let i = 100; i < 500; i++) {
        dropdown.style.height = `${i}px`;
        await sleep(1);
    }
}

const dropdown = document.getElementsByClassName('dropdown');
let count = 0;

function showDropdown() {
    if (count % 2 == 0) {
        count++;
        dropdown[0].style.display = 'block';
        slide(dropdown[0]);
    } else {
        count++;
        dropdown[0].style.display = '';
    }
}

// other 나라 input 나타내기
function changeCompanySelect(item) {
    const otherInput = document.getElementById('otherInput');

    otherInput.style.display = (item === 'Others') ? 'block' : 'none';

}

// SELECT 커스텀
const labels = document.querySelectorAll('.label'); // 0 = company, 1 = payday

const options = document.querySelectorAll('.optionItem');
// 클릭한 옵션의 텍스트를 라벨 안에 넣음
const handleSelect = function (item, i) {
    labels.forEach(function (label) {
        if (i < 8) {
            labels[0].innerHTML = item.textContent;
            changeCompanySelect(item.textContent);
        } else {
            labels[1].innerHTML = item.textContent;
        }
        label.parentNode.classList.remove('active');
    })
}

// 옵션 클릭시 클릭한 옵션을 넘김
for (let i = 0; i < options.length; i++) {
    options[i].addEventListener('click', function () {
        handleSelect(options[i], i);
    });
}

const paydayBox = document.getElementById('payday-box');

labels.forEach(function (label) {
    label.addEventListener('click', function () {
        if (label.parentNode.classList.contains('active')) {
            label.parentNode.classList.remove('active');
        } else {
            label.parentNode.classList.add('active');
            // paydayBox.style.marginTop = '250px';
            // paydayBox.parentNode.style.height = "1000px";
        }
    });
})