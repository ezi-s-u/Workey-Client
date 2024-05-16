let firstName;
let userId = Cookies.get("user_id");

// user firtname 불러오기 
$.support.cors = true;
$.ajax({
    type: 'get',           // 타입 (get, post, put 등등)
    url: 'http://localhost:3000/users',           // 요청할 서버url
    async: true,            // 비동기화 여부 (default : true)
    dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
    data: {},
    success: function (result) { // 결과 성공 콜백함수
        result.forEach((result) => {
            if (result.id == userId) {
                $("#first-name").text(result.firstName);
            }
        });
    }
});

// 오늘의 질문 가져오기
let quesId;
$.support.cors = true;
$.ajax({
    type: 'get',           // 타입 (get, post, put 등등)
    url: `http://localhost:3000/questions`,           // 요청할 서버url
    async: true,            // 비동기화 여부 (default : true)
    dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
    data: {},
    success: function (result) { // 결과 성공 콜백함수
        quesId = result.data.id;
        let question = result.data.question;
        $("#question").text(question);
    }
});

// 즐겨찾기 클릭 이벤트 
let isStar = false;
let originalBackgroundURL = 'url(../img/icon_star_writing.svg)';
let newBackgroundURL = 'url(../img/icon_filled_star_writing.svg)';
function clickStar(obj) {
    if (!isStar) {
        obj.style.background = newBackgroundURL;
        isStar = true;
    } else {
        obj.style.background = originalBackgroundURL;
        isStar = false;
    }
}

let selfCheckResult = "", state = false, sum = 0;
function addSelfCheckScore() {
    sum += Number($(":input:radio[name=q1]:checked").val());
    sum += Number($(":input:radio[name=q2]:checked").val());
    sum += Number($(":input:radio[name=q3]:checked").val());
    sum += Number($(":input:radio[name=q4]:checked").val());
    createDiary();
}

async function createDiary() {

    const req = {
        "answer": $("#answer").val(),
        "star": isStar,
        "score": sum,
        "state": state,
        "companyId": Cookies.get("company_id")
    }

    console.log(req);
    await axios.post(`http://localhost:3000/diaries/${userId}/${quesId}`, req)
        .then(async (result) => {
            if (result.data.data.state) {
                console.log(result);
                await saveGoodCount(result.data.data.companyId);
            }
            // saveGoodCount(result.)
            location.href = "../list.html";
            return true;
        }).catch((err) => {

        });

}

async function saveGoodCount(companyId) {
    console.log(companyId);
    await axios.patch(`http://localhost:3000/companies/${companyId}`)
        .then(async (result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
}

// let diaryId;
async function showDiary(diaryId) {
    await axios.get(`http://localhost:3000/diaries/${diaryId}`)
        .then(async (result) => {
            Cookies.set("diary_id", diaryId);
            location.href= '../diary-reading.html';
        }).catch((err) => {
            console.log(err);
            console.log("다이어리 실패");
        });
}

async function getQuestion(quesId) {
    let question = '';

    await axios.get(`http://localhost:3000/questions/${quesId}`)
        .then(async (result) => {
            question = result.data;
        }).catch((err) => {
            console.log("문제 불러오기 실패");
        });
    return question;
}