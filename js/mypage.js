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