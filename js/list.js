// 월 변경 함수 
let currentMonthIndex = 0;  // 현재 월의 인덱스

// 월을 변경하는 함수
function changeMonth() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthElement = document.getElementById("currentMonth");

    // 현재 월 표시 업데이트
    currentMonthElement.textContent = months[currentMonthIndex];
}

// 이전 월로 이동하는 함수
function previousMonth() {
    if (currentMonthIndex > 0) {
        currentMonthIndex--;
        changeMonth();
    } else {
        currentMonthIndex = 12;
        previousMonth();
    }
}

// 다음 월로 이동하는 함수
function nextMonth() {
    if (currentMonthIndex < 11) {
        currentMonthIndex++;
        changeMonth();
    } else {
        currentMonthIndex = -1;
        nextMonth();
    }
}