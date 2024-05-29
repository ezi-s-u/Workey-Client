let firstName;
let userId = Cookies.get("user_id");
let diaryId;

// 쿼리스트링값 저장
const url = new URL(window.location.href);
const urlParams = url.searchParams;

// 하나의 diary에 접속했을 경우
if (urlParams.get('id') !== null) {
    diaryId = urlParams.get('id');
    getDiaryData();
} else {
    // 이미 답했다면 답한 diary를 불러오자
    $.ajax({
        type: 'get',           // 타입 (get, post, put 등등)
        url: `http://localhost:3000/diaries/${userId}`,           // 요청할 서버url
        async: true,            // 비동기화 여부 (default : true)
        dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
        data: {},
        success: async function (result) { // 결과 성공 콜백함수
            // let lastDiaryDate = result[result.length - 1].createdAt.substring(0, 10);
            let yourDate = String(today).substring(8, 10);
            // 오늘 일기 작성 전이라면
            // if (lastDiaryDate !== yourDate) {
            await setUserFirstName();
            await setTodayQuestion(yourDate);

            // } else {
            //     Cookies.set("diary_id", result[result.length-1].id);
            //     diaryId = Cookies.get("diary_id");
            //     setUserFirstName();
            //     getDiaryData();
            // }
        }
    });
}

// user firtname 불러오기 
$.support.cors = true;
async function setUserFirstName() {
    $.ajax({
        type: 'get',           // 타입 (get, post, put 등등)
        url: 'http://localhost:3000/users',           // 요청할 서버url
        async: true,            // 비동기화 여부 (default : true)
        dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
        data: {},
        success: async function (result) { // 결과 성공 콜백함수
            result.forEach((result) => {
                if (result.id == userId) {
                    $("#first-name").text(result.firstName);
                }
            });
        }
    });
}

// 오늘의 질문 가져오기
$.support.cors = true;
async function setTodayQuestion(id) {
    let quesId = id;
    $.ajax({
        type: 'get',           // 타입 (get, post, put 등등)
        url: `http://localhost:3000/questions/${quesId}`,           // 요청할 서버url
        async: true,            // 비동기화 여부 (default : true)
        dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
        data: {},
        success: async function (question) { // 결과 성공 콜백함수
            $("#question").text(question);
        }
    });
}

// 즐겨찾기 클릭 이벤트 
let isClicked = false;
async function isStarClicked(star = isClicked) {
    if (!star) {
        document.getElementsByClassName("important")[0].src = "./img/icon_filled_star_writing.svg";
        isClicked = true;
    } else {
        document.getElementsByClassName("important")[0].src = "./img/icon_star_writing.svg";
        isClicked = false;
    }
}

async function getSelfCheckScoreSum() {
    let sum = 0;
    sum += Number($(":input:radio[name=q1]:checked").val());
    sum += Number($(":input:radio[name=q2]:checked").val());
    sum += Number($(":input:radio[name=q3]:checked").val());
    sum += Number($(":input:radio[name=q4]:checked").val());
    return sum;
}

async function getStateImgSrc(score) {
    if (score >= 80) {
        return "./img/state_good.svg";
    } else if (score >= 46) {
        return "./img/state_normal.svg";
    } else {
        return "./img/state_bad.svg";
    }
}

// post new diary
async function createDiary() {
    let answer = $("#answer").val();
    if (answer === '')
        answer = ' ';
    let sum = await getSelfCheckScoreSum();// 총합
    let imgSrc = await getStateImgSrc(sum);
    let state = false;
    if (imgSrc === "./img/state_good.svg")
        state = true;
    let isStar = isClicked;

    const req = {
        "answer": answer,
        "star": isStar,
        "score": sum,
        "state": state,
        "companyId": Cookies.get("company_id")
    }

    let dateFormat = await getTodayDate(String(today));
    let quesId = dateFormat.substring(10, 12);

    axios.post(`http://localhost:3000/diaries/${userId}/${quesId}`, req)
        .then(async (result) => {
            if (result.data.data.state) {
                await saveGoodCount(result.data.data.companyId);
            }
            let id = result.data.data.id;
            await saveSelfCheckValue(id);// self check test result 각각의 값 저장
            // location.href = "../list.html";

        }).catch((err) => {
            console.log(err);
        });

}

async function saveSelfCheckValue(id) {
    diaryId = id;
    let req = {
        "st_answer1": Number($(":input:radio[name=q1]:checked").val()),
        "st_answer2": Number($(":input:radio[name=q2]:checked").val()),
        "st_answer3": Number($(":input:radio[name=q3]:checked").val()),
        "st_answer4": Number($(":input:radio[name=q4]:checked").val())
    };

    await axios.post(`http://localhost:3000/self-test-results/${diaryId}`, req)
        .then(async (result) => {
            //console.log("st_answer1: " + result.data.st_answer1);

        }).catch((err) => {
            console.log("self test result 값 저장 실패: "+err);
        })
}

async function getSelfCheckValue(id) {
    diaryId = id;
    axios.get(`http://localhost:3000/self-test-results/${diaryId}`)
        .then(async (result) => {
            await setSelfCheckValueHtml(result.data.st_answer1, "q1");
            await setSelfCheckValueHtml(result.data.st_answer2, "q2");
            await setSelfCheckValueHtml(result.data.st_answer3, "q3");
            await setSelfCheckValueHtml(result.data.st_answer4, "q4");
            // 값을 5로 나눈 몫-1이 element의 인덱스가 된다.
            // 해당 element를 checked로 변경
            // 필요한 것: 선택된 값(5로 나눌 값), elementName
        }).catch((err) => {
            console.log(err);
        })  
}

// 가져온 self-check 값 저장된 위치에 넣기
async function setSelfCheckValueHtml(value, name) {
    let question = document.getElementsByName(name);
    let index = question.length-(value/5);
    //console.log(question[index].checked);
    question[index].checked = true;
    console.log(question[index].checked);
}

async function saveGoodCount(companyId) {
    let req = {};

    axios.patch(`http://localhost:3000/companies/${companyId}`, req)
        .then(async (result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
}

async function getDiaryData() {
    await setUserFirstName();
    axios.get(`http://localhost:3000/diaries/${userId}/${diaryId}`)
        .then(async (result) => {
            await setTodayQuestion(result.data.quesId);
            $("#answer").text(result.data.answer+" ");
            isStarClicked(!result.data.star);
            await getSelfCheckValue(result.data.id);
            console.log("가져옴!");
        }).catch((err) => {
            console.log("문제 불러오기 실패");
        });
}