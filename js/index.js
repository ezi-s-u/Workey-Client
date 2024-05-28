let user_id = Cookies.get("user_id");
getUserInform()
var progressInterval
var rotation = 8;

function getUserInform() {
  const spanPayday = $('#until-payday');

  const spanStartTime = $('#start-time');
  const spanEndTime = $('#end-time');

  user_id = Cookies.get("user_id");
  axios.get(`http://localhost:3000/main/${user_id}`)
    .then((result) => {
      const startTime = result.data.startTime
      console.log(parseInt(startTime))
      const endTime = result.data.endTime
      const payday = new Date(result.data.payday)

      /* 월급날 계산 */
      const todayDate = moment();
      const paydayDate = moment().year(todayDate.year()).month(todayDate.month()).date(payday.getDate());
      // 만약 현재 날짜가 이미 월급날이 지났다면 다음 달의 월급날로 설정
      if (todayDate.isAfter(paydayDate)) {
        paydayDate.add(1, 'months');
      }

      const untilPayday = paydayDate.diff(todayDate, "days");
      // ajax innerHTML
      spanPayday.html(untilPayday);

      /* 하루 일한 시간 계산 */
      console.log(startTime + " " + endTime)

      var convertedStartTime = convertTimeFormat(startTime);
      var convertedEndTime = convertTimeFormat(endTime);
      // console.log(convertedStartTime+ " " + convertedEndTime);

      spanStartTime.html(convertedStartTime)
      spanEndTime.html(convertedEndTime)

      /* 애니메이션 */
      var startTimestamp = new Date().setHours(parseInt(startTime), 0, 0, 0);
      var endTimestamp = new Date().setHours(parseInt(endTime), 0, 0, 0);

      // 작업 시간 계산

      // 작업 시간 동안 매 초마다 바의 너비를 조절하는 함수
      function increaseProgressBar() {
        var currentTime = new Date().setHours(new Date().getTime(), 0, 0, 0);
        var elapsedTime = currentTime - startTimestamp;

        var workingTime = endTimestamp - startTimestamp;


        if (elapsedTime <= workingTime) {
          var progress = (elapsedTime / workingTime) * 100;
          document.getElementById("working-time-bar").style.width = progress + "%";
          document.getElementById("illust").style.marginLeft = (progress) + 'px';
          // 이미지를 현재 각도에서 8도 회전합니다.
          rotation = (rotation === 8) ? -8 : 8;

          // 이미지의 각도를 변경합니다.
          document.getElementById("illust").style.transform = 'rotate(' + rotation + 'deg)';
        } else {
          clearInterval(progressInterval);
          document.getElementById("working-time-bar").style.width = '100%';
          document.getElementById("illust").style.marginLeft = '0px';

          // 이미지의 각도를 변경합니다.
          document.getElementById("illust").style.transform = 'rotate(' + 0 + 'deg)';
        }

        // console.log(document.getElementById("working-time-bar").style.width);
      }

      // 1초마다 increaseProgressBar 함수를 호출
      progressInterval = setInterval(increaseProgressBar, 1000);

    }).catch((err) => {
      console.error(err);
    });
}

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
let illust = document.getElementById("illust");// 사진
let state = document.getElementById("current-state");// rest or real
let timebar = document.getElementById("working-time-bar");
let comment = document.getElementById("comment");
function isClicked(element) {
  if (element.checked) {
    // Rest-time이라고 텍스트 띄우기
    state.textContent = "Rest-time";
    // running_illustration.svg 숨기기
    illust.src = "./img/stopping_illustration.svg";// 멈춘 이미지로 변경
    illust.style.margin = "auto";// 가운데 정렬
    // 상태바 색 그라데이션으로 다 채우기
    timebar.style.backgroundImage = "linear-gradient(to left, var(--purple-02) 20%, var(--purple-08) 60%)";
    // 말풍선 코멘트 변경
    comment.textContent = "The quality of life is rising!";
  } else {
    state.textContent = "Real-time";
    // running_illustration.svg 현재에 표시
    illust.src = "./img/running_illustration.svg";
    timebar.style.backgroundImage = "none";// 상태바 색 원위치
    // 말풍선 코멘트 변경
    comment.textContent = "Hustling until it's time to punch out!";
    /**
     *여기서 캐릭터 위치 조정하면 됩니다! 
     */
  }
}