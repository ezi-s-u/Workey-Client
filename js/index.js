let user_id
// getUserInform()
var progressInterval
var rotation = 8;

let character = document.getElementById("illust") // 캐릭터
let timeBar = document.getElementById("working-time-bar") // 바
let comment = document.getElementById("comment"); // 말풍선 말
// let barWidth = workingTimeBar.clientWidth; // 바 길이

document.addEventListener('DOMContentLoaded', () => {
  const spanPayday = $('#until-payday');

  const spanStartTime = $('#start-time');
  const spanEndTime = $('#end-time');

  user_id = Cookies.get("user_id");
  axios.get(`http://localhost:3000/main/${user_id}`)
    .then((result) => {
      const startTime = result.data.startTime
      // console.log(parseInt(startTime))
      const endTime = result.data.endTime
      const payday = result.data.payday
      console.log(payday)
      console.log(typeof payday)

      /* 월급날 계산 */
      const todayDate = moment();
      const paydayDate = moment().year(todayDate.year()).month(todayDate.month()).date(payday);
      // 만약 현재 날짜가 이미 월급날이 지났다면 다음 달의 월급날로 설정
      if (todayDate.isAfter(paydayDate)) {
        paydayDate.add(1, 'months');
      }

      const untilPayday = paydayDate.diff(todayDate, "days");
      // ajax innerHTML
      spanPayday.html(untilPayday);

      spanStartTime.html(convertTimeFormat(startTime)) // 화면에 출근 시간 출력
      spanEndTime.html(convertTimeFormat(endTime)) // 화면에 출근 시간 출력
      
      /* 애니메이션 */
      var startTimestamp = new Date().setHours(parseInt(startTime), 0, 0, 0);
      var endTimestamp = new Date().setHours(parseInt(endTime), 0, 0, 0);

      // 바의 너비를 조절하는 함수
      function increaseProgressBar() {
        // let now = new Date();

        // 현재 일하고 있는 시간인지
        function isWorkingTime() {
          const now = new Date();
          return now >= startTimestamp && now <= endTimestamp;
        }


        if (isWorkingTime()) {
          var currentTime = new Date() // 현재 시간
          let totalMinutes = (endTimestamp - startTimestamp);
          let elapsedTime = (currentTime - startTimestamp);
          let progress = (elapsedTime / totalMinutes) * 100;

          timeBar.style.width = `${progress}%` // 바 길이 증가

          character.style.marginLeft = `${progress-13}%` // 캐릭터 위치 이동

          // 이미지를 현재 각도에서 8도 회전합니다.
          rotation = (rotation === 8) ? -8 : 8;

          // 이미지의 각도를 변경합니다.
          character.style.transform = 'rotate(' + rotation + 'deg)';

          // 말풍선
          comment.textContent = "Hustling until it's time to punch out!";
        } else {
          clearInterval(progressInterval);
          timeBar.style.width = '100%';
          character.style.marginLeft = '40%';

          // 이미지의 각도를 변경합니다.
          character.style.transform = 'rotate(' + 0 + 'deg)';
          character.src = "./img/running_illustration_done.svg";

          // 말풍선
          comment.textContent = "You did an amazing job today!";
        }

      }

      increaseProgressBar() // 페이지 로드 시 첫 번째 실행

      // 1초마다 increaseProgressBar 함수 호출
      progressInterval = setInterval(increaseProgressBar, 1000);

    }).catch((err) => {
      console.error(err);
    });
})

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
let state = document.getElementById("current-state");// rest or real
function isClicked(element) {
  if (element.checked) {
    // Rest-time이라고 텍스트 띄우기
    state.textContent = "Rest-time";
    // running_illustration.svg 숨기기
    character.src = "./img/stopping_illustration.svg";// 멈춘 이미지로 변경
    character.style.margin = "auto";// 가운데 정렬
    // 상태바 색 그라데이션으로 다 채우기
    timeBar.style.backgroundImage = "linear-gradient(to left, var(--purple-02) 20%, var(--purple-08) 60%)";
    // 말풍선 코멘트 변경
    comment.textContent = "The quality of life is rising!";
  } else {
    state.textContent = "Real-time";
    // running_illustration.svg 현재에 표시
    character.src = "./img/running_illustration.svg";
    timeBar.style.backgroundImage = "none";// 상태바 색 원위치
    // 말풍선 코멘트 변경
    comment.textContent = "Hustling until it's time to punch out!";
    /**
     *여기서 캐릭터 위치 조정하면 됩니다! 
     */
  }
}

function extractNumbers(input) {
  // 정규 표현식을 사용하여 숫자와 점(.)을 찾음
  const matches = input.match(/[0-9.]+/g);
  return matches ? parseFloat(matches.join('')) : 0;
}