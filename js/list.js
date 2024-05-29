// 월 변경 함수 
let currentMonthIndex = 0;  // 현재 월의 인덱스
// let companyId = Cookies.get("company_id");
// console.log(companyId);

// 월을 변경하는 함수
async function changeMonth() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthElement = $("#currentMonth");
    if (months[currentMonthIndex] !== "January")
        await deleteList();
    else
        await showDiaries();
    // 현재 월 표시 업데이트
    currentMonthElement.text(months[currentMonthIndex]);
}

// 이전 월로 이동하는 함수
async function previousMonth() {
    if (currentMonthIndex > 0) {
        currentMonthIndex--;
        await changeMonth();
    } else {
        currentMonthIndex = 12;
        await previousMonth();
    }
}

// 다음 월로 이동하는 함수
async function nextMonth() {
    if (currentMonthIndex < 11) {
        currentMonthIndex++;
        await changeMonth();
    } else {
        currentMonthIndex = -1;
        await nextMonth();
    }
}

function deleteList() {
    var div = $(".diary-box");
    for (let i = 0; i < div.length; i++) {
        div[i].remove();
    }
}

async function getStateImgSrc(score) {
    let imgSrc;
    console.log(score);
    if (score >= 80) {
        imgSrc = "./img/state_good.svg";
    } else if (score >= 46) {
        imgSrc = "./img/state_normal.svg";
    } else {
        imgSrc = "./img/state_bad.svg";
    }
    return imgSrc;
}

// 날짜 포맷 세팅
async function getMonthName(m) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentMonth = Number(m);
    return months[currentMonth % 12 - 1];
}

async function getDateFormat(d) {
    if (d == 1) return d + "st";
    else if (d == 2) return d + "nd";
    else if (d == 3) return d + "rd";
    else return d + "th";
}

let score;
async function setDiaryHtml(id, quesId, companyId, date, isStar) {
    try {
        $(".diary-list-box").append(await getDiaryHtml(id, quesId, companyId, date, isStar));// html - 덮어씌우기, append - 추가하기
    } catch (err) {
        console.log("getHtml함수 불러오기 실패");
    }
}

async function getDiaryHtml(id, quesId, companyId, date, isStar) {
    try {

        let starImg = '';
        const imgSrc = await getStateImgSrc(score);
        if (isStar) {
            starImg = `<img src="./img/icon_filled_star_list.svg" class="important" alt="즐겨찾기">`;
        }
        let question = await getQuestion(quesId);// 질문 가져오기
        let company = await getCompany(companyId);// 회사 가져오기 

        let d = new Date(toString(date))

        // let year = date.slice(0, 4);
        // let month = date.slice(5, 7);
        month = await getMonthName(d.getMonth());
        console.log(d.getMonth())
        console.log(date)
        let day = await getDateFormat(quesId);
        let dateFormat = month + " " + day + ", " + year;

        return `<div class="diary-box">
        ${starImg}
        <div class="text-box" onclick="showDiary(${id})">
        <span class="title">${question}</span>
        <hr>
        <div class="bottom-box">
        <span class="company">${company}</span>
        <span class="date">${dateFormat}</span>
        </div>
        </div>
        <div class="img-box">
        <img src=${imgSrc} alt="">
        <!-- 점수에 따른 이미지 삽입 필요 -->
        </div>
        </div>`;
    } catch (err) {
        console.log(err);
        console.log("다이어리 html 삽입 실패");
    }
}

// api
async function getQuestion(quesId) {
    let question = '';

    await axios.get(`http://localhost:3000/questions/${quesId}`)
        .then(async (result) => {
            question = result.data;
        }).catch((err) => {
            console.log("퀴즈 불러오기 실패");
        });
    return question;
}
// 회사 이름 가져오기 
async function getCompany(companyId) {
    let company;
    await axios.get(`http://localhost:3000/companies/${companyId}`)
        .then(async (result) => {
            company = result.data.name;
        }).catch(async (err) => {
            console.log("회사 이름 가져오기 실패");
        });

    return company;
}

showDiaries();
async function showDiaries() {
    let userId = Cookies.get("user_id");
    await axios.get(`http://localhost:3000/diaries/list/${userId}`)
        .then(async (result) => {
            console.log(result);
            await result.data.forEach(async (element) => {
                score = element.score;
                setDiaryHtml(element.id, element.quesId, element.companyId, element.createdAt, element.star);
            });
        }).catch((err) => {
            console.log("다이어리 리스트 보여주기 실패");
        });
    return true;
}

// 검색
async function doKeyDown(event) {
    if (event.keyCode === 13 || event === 'onclick') {// enter키이거나 검색 버튼이 클릭됐다면
        var input = $("#searchText").val();
        if (input === '') {// 빈칸 검색이면 전체 다이어리 띄우기
            deleteDivList();
            await showDiaries();
        } else {
            deleteDivList();
            await findIncludedWord(input);// 검색한 값에 따른 question 보기
        }
    }
}

// 해당 키워드가 포함되어있는지를 확인
async function findIncludedWord(input) {
    let userId = Cookies.get("user_id");

    await axios.get(`http://localhost:3000/diaries/list/${userId}`)
        .then(async (result) => {
            console.log("result");
            console.log(result.data);
            await result.data.forEach(async (element) => {
                let question = await getQuestion(element.quesId);
                if (question.includes(input)) {
                    await search(element.id);
                }
                return true;
            });
        }).catch((err) => {
            console.log("키워드 포함 여부 조회 실패");
        });
}

// 제목으로 검색하기
async function search(id) {
    let userId = Cookies.get("user_id");
    await axios.get(`http://localhost:3000/diaries/list/${userId}`)
        .then(async (result) => {
            console.log("들어감");
            await result.data.forEach(async (element) => {
                if (id === element.id) {
                    deleteDivList();
                    await setDiaryHtml(element.id,  element.quesId, element.companyId, element.createdAt, element.star);
                }
            })

            return true;
        }).catch((err) => {
            console.log("검색된 제목을 가지고 있는 다이어리 불러오기 실패");
        });
}

// (검색) 다이어리 div 전체 지우기
function deleteDivList() {
    var div = $(".diary-box");
    for (let i = 0; i < div.length; i++) {
        if (div[i]) // div태그가 있는지 확인
            div[i].remove();
    }
}

//
let selectDate = document.getElementById("select-date");
selectDate.addEventListener("change", showDiaryByDate());

async function showDiaryByDate() {
    const selectedDate = selectDate.value;
    console.log(selectDate)
    
    await axios.get(`http://localhost:3000/diaries/date/detail?date=${selectedDate}`)
        .then(async (result) => {
            await setDiaryHtml(result.id, result.quesId, result.companyId, result.createdAt, result.star);
    }).catch((err) => {
        console.log("err : " + err)
        console.log("해당 날짜의 다이어리 불러오기 실패")
    })

}