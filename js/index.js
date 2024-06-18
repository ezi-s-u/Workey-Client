let user_id
// getUserInform()
var progressInterval
var rotation = 8;

let character = document.getElementById("illust") // 캐릭터
let timeBar = document.getElementById("working-time-bar") // 바
let comment1 = document.getElementById("comment1"); // 노란 말풍선 말
let comment2 = document.getElementById("comment2"); // 하얀 말풍선 말
let illustrationState = document.getElementById("illustration-state");// rest or real
// let barWidth = workingTimeBar.clientWidth; // 바 길이

let state = document.getElementById("current-state");

const spanPayday = $('#until-payday');

const spanStartTime = $('#start-time');
const spanEndTime = $('#end-time');

let startTimestamp
let endTimestamp

document.addEventListener('DOMContentLoaded', () => {
  user_id = Cookies.get("user_id");
  axios.get(`http://localhost:3000/main/${user_id}`)
    .then((result) => {
      const startTime = result.data.startTime
      // console.log(parseInt(startTime))
      const endTime = result.data.endTime
      const payday = result.data.payday

      /* 월급날 계산 */
      const todayDate = moment();
      const paydayDate = moment().year(todayDate.year()).month(todayDate.month()).date(payday);
      // 만약 현재 날짜가 이미 월급날이 지났다면 다음 달의 월급날로 설정
      if (todayDate.isAfter(paydayDate)) {
        paydayDate.add(1, 'months');
      }

      const untilPayday = paydayDate.diff(todayDate, "days");
      // ajax innerHTML
      if(untilPayday === 0) {
        spanPayday.html("Day");
      } else {
      spanPayday.html(untilPayday);
      }

      spanStartTime.html(convertTimeFormat(startTime)) // 화면에 출근 시간 출력
      spanEndTime.html(convertTimeFormat(endTime)) // 화면에 출근 시간 출력

      // console.log(startTime)
      // console.log(endTime)

      /* 애니메이션 */
      startTimestamp = new Date().setHours(parseInt(startTime), 0, 0, 0);
      endTimestamp = new Date().setHours(parseInt(endTime), 0, 0, 0);

      increaseProgressBar(startTimestamp, endTimestamp) // 페이지 로드 시 첫 번째 실행

      // 1초마다 increaseProgressBar 함수 호출
      progressInterval = setInterval(() => increaseProgressBar(startTimestamp, endTimestamp), 1000);
    }).catch((err) => {
      console.error(err);
    });
})

// 바의 너비를 조절하는 함수
function increaseProgressBar(startTimestamp, endTimestamp) {
  const now = new Date();

  state.textContent = "Real-time";

  timeBar.style.backgroundColor = "#813CEE";
  timeBar.style.backgroundImage = "";
  illustrationState.style.paddingTop = "0px"

  // 현재 일하고 있는 시간인지
  function isWorkingTime() {
    return now >= startTimestamp && now <= endTimestamp;
  }

  if (isWorkingTime()) {
    var currentTime = new Date() // 현재 시간
    let totalMinutes = (endTimestamp - startTimestamp);
    let elapsedTime = (currentTime - startTimestamp);
    let progress = (elapsedTime / totalMinutes) * 100;

    timeBar.style.width = `${progress}%` // 바 길이 증가

    character.style.marginLeft = `${progress - 13}%` // 캐릭터 위치 이동

    // 이미지를 현재 각도에서 8도 회전합니다.
    rotation = (rotation === 8) ? -8 : 8;

    // 이미지의 각도를 변경합니다.
    character.style.transform = 'rotate(' + rotation + 'deg)';

    character.src = "./img/running_illustration.svg";

    // 말풍선
    comment1.textContent = "Hustling until it's time to punch out!";
    comment2.textContent = "You can do it✨";
  } else if(now < startTimestamp && now > endTimestamp) {
    timeBar.style.width = '0%';
    character.style.marginLeft = '0%';

    // 이미지의 각도를 변경합니다.
    character.style.transform = 'rotate(' + 0 + 'deg)';
    character.src = "./img/running_illustration_done.svg";

    // 말풍선
    comment1.textContent = "Hustling until it's time to punch out!";
    comment2.textContent = "You can do it✨";
  } else {
    clearInterval(progressInterval);
    timeBar.style.width = '100%';
    character.style.marginLeft = '40%';

    // 이미지의 각도를 변경합니다.
    character.style.transform = 'rotate(' + 0 + 'deg)';
    character.src = "./img/running_illustration_done.svg";


    // 말풍선
    comment1.textContent = "You did an amazing job today!";
    comment2.textContent = "Well done✨";
  }

}

// '12:00 AM' 형태로 반환하는 함수
function convertTimeFormat(inputTime) {
  // 입력된 문자열을 Date 객체로 변환
  var inputDate = new Date('1970-01-01T' + inputTime);

  // 12시간 형식으로 변환
  var hours = inputDate.getHours();
  var minutes = inputDate.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0시일 경우 12로 표시

  // 시간과 분을 문자열로 조합
  var formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;

  return formattedTime;
}

// Rest-time, Real-time checkbox
function isClicked(element) {
  if (element.checked) {
    clearInterval(progressInterval);
    illustrationState.style.paddingTop = "2.46px"

    // Rest-time이라고 텍스트 띄우기
    state.textContent = "Rest-time";
    timeBar.style.width = '100%';
    character.style.margin = "auto";
    // running_illustration.svg 숨기기
    character.src = "./img/stopping_illustration.svg";// 멈춘 이미지로 변경
    character.style.transform = 'rotate(' + 0 + 'deg)';
    // 상태바 색 그라데이션으로 다 채우기
    timeBar.style.backgroundImage = "linear-gradient(to left, var(--purple-02) 20%, var(--purple-08) 60%)";
    // 말풍선 코멘트 변경
    comment1.textContent = "The quality of life is rising!";
    comment2.textContent = "Let’s have a good rest✨";
  } else {
    progressInterval = setInterval(() => increaseProgressBar(startTimestamp, endTimestamp), 1000);
  }
}

function extractNumbers(input) {
  // 정규 표현식을 사용하여 숫자와 점(.)을 찾음
  const matches = input.match(/[0-9.]+/g);
  return matches ? parseFloat(matches.join('')) : 0;
}