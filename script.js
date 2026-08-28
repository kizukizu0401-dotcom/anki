// ==============================
// 暗記アプリ Ver.0.2
// ==============================

// --------------------------------
// localStorageを安全に使うための関数
// --------------------------------

function loadWords() {
    try {
        const savedWords = localStorage.getItem("words");

        if (!savedWords) {
            return [];
        }

        const parsedWords = JSON.parse(savedWords);

        return Array.isArray(parsedWords) ? parsedWords : [];

    } catch (error) {
        console.error("単語データの読み込みに失敗しました:", error);
        return [];
    }
}


function saveWords() {
    try {
        localStorage.setItem("words", JSON.stringify(words));
        return true;

    } catch (error) {
        console.error("単語データの保存に失敗しました:", error);
        return false;
    }
}


function loadResults() {
    try {
        const savedResults = localStorage.getItem("results");

        if (!savedResults) {
            return {};
        }

        const parsedResults = JSON.parse(savedResults);

        return parsedResults && typeof parsedResults === "object"
            ? parsedResults
            : {};

    } catch (error) {
        console.error("正誤データの読み込みに失敗しました:", error);
        return {};
    }
}


function saveResults() {
    try {
        localStorage.setItem("results", JSON.stringify(results));
        return true;

    } catch (error) {
        console.error("正誤データの保存に失敗しました:", error);
        return false;
    }
}


// ==============================
// データ
// ==============================

let words = loadWords();
let results = loadResults();


// ==============================
// 正答数
// ==============================

function getCorrectCount() {
    return Object.values(results)
        .filter(result => result === "correct")
        .length;
}


function updateCorrectCount() {
    document.getElementById("correctCount").textContent =
        getCorrectCount();
}


// ==============================
// 問題
// ==============================

let currentWordIndex = 0;


function showQuestion() {

    const questionElement =
        document.getElementById("question");

    const answerInput =
        document.getElementById("answerInput");

    const answerButton =
        document.getElementById("answerButton");

    const nextButton =
        document.getElementById("nextButton");

    const resultElement =
        document.getElementById("result");


    if (words.length === 0) {

        questionElement.textContent =
            "単語を登録してください";

        answerInput.value = "";
        answerInput.disabled = true;
        answerButton.disabled = true;
        nextButton.disabled = true;
        resultElement.textContent = "";

        return;
    }


    // 単語が削除された後などに備える
    if (currentWordIndex >= words.length) {
        currentWordIndex = 0;
    }


    answerInput.disabled = false;
    answerButton.disabled = false;
    nextButton.disabled = false;


    const currentWord =
        words[currentWordIndex];


    questionElement.textContent =
        currentWord.question;

    answerInput.value = "";

    resultElement.textContent = "";
}


// ==============================
// 答える
// ==============================

document.getElementById("answerButton")
    .addEventListener("click", function () {

        if (words.length === 0) {
            return;
        }


        const currentWord =
            words[currentWordIndex];


        const answer =
            document.getElementById("answerInput")
                .value
                .trim();


        if (answer === currentWord.answer) {

            results[currentWord.id] = "correct";

            document.getElementById("result").textContent =
                "正解！";

        } else {

            results[currentWord.id] = "wrong";

            document.getElementById("result").textContent =
                "不正解";
        }


        if (!saveResults()) {

            document.getElementById("result").textContent =
                "結果の保存に失敗しました";

            return;
        }


        updateCorrectCount();
    });


// Enterキーでも答えられるようにする
document.getElementById("answerInput")
    .addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            document.getElementById("answerButton").click();
        }
    });


// ==============================
// 次の問題
// ==============================

document.getElementById("nextButton")
    .addEventListener("click", function () {

        if (words.length === 0) {
            return;
        }

        currentWordIndex++;

        if (currentWordIndex >= words.length) {
            currentWordIndex = 0;
        }

        showQuestion();
    });


// ==============================
// 画面切り替え
// ==============================

function showScreen(screenId) {

    document.getElementById("quizScreen").style.display = "none";
    document.getElementById("registerScreen").style.display = "none";
    document.getElementById("manageScreen").style.display = "none";

    document.getElementById(screenId).style.display = "block";
}


// 登録画面
document.getElementById("registerScreenButton")
    .addEventListener("click", function () {

        showScreen("registerScreen");

        document.getElementById("questionInput").focus();
    });


// 管理画面
document.getElementById("manageScreenButton")
    .addEventListener("click", function () {

        showScreen("manageScreen");

        displayWordList();
    });


// ==============================
// 単語を登録
// ==============================

document.getElementById("registerButton")
    .addEventListener("click", function () {

        const questionInput =
            document.getElementById("questionInput");

        const answerInput =
            document.getElementById("correctAnswerInput");

        const registerResult =
            document.getElementById("registerResult");


        const question =
            questionInput.value.trim();

        const answer =
            answerInput.value.trim();


        // 空欄チェック
        if (question === "" || answer === "") {

            registerResult.textContent =
                "問題と正答の両方を入力してください";

            return;
        }


        const newWord = {

            id: Date.now().toString(),

            question: question,

            answer: answer
        };


        words.push(newWord);


        // 保存できた場合だけ登録完了にする
        if (!saveWords()) {

            // 保存できなかったので追加した分を元に戻す
            words.pop();

            registerResult.textContent =
                "保存に失敗しました";

            return;
        }


        registerResult.textContent =
            "「" + question + "」を登録しました！";


        questionInput.value = "";
        answerInput.value = "";
    });


// ==============================
// 登録画面から戻る
// ==============================

document.getElementById("backButton")
    .addEventListener("click", function () {

        showScreen("quizScreen");

        showQuestion();
    });


// ==============================
// 単語一覧
// ==============================

function displayWordList() {

    const wordList =
        document.getElementById("wordList");


    wordList.innerHTML = "";


    if (words.length === 0) {

        wordList.textContent =
            "登録されている単語はありません";

        return;
    }


    words.forEach(function (word) {

        const wordItem =
            document.createElement("div");

        wordItem.className =
            "word-item";


        // 問題
        const question =
            document.createElement("div");

        question.className =
            "word-question";

        question.textContent =
            word.question;


        // 正答
        const answer =
            document.createElement("div");

        answer.className =
            "word-answer";

        answer.textContent =
            "正答：" + word.answer;


        // 結果
        const result =
            document.createElement("div");

        result.className =
            "word-result";


        if (results[word.id] === "correct") {

            result.textContent =
                "結果：正解";

        } else if (results[word.id] === "wrong") {

            result.textContent =
                "結果：不正解";

        } else {

            result.textContent =
                "結果：未回答";
        }


        // ボタン
        const buttons =
            document.createElement("div");

        buttons.className =
            "word-buttons";


        const editButton =
            document.createElement("button");

        editButton.textContent =
            "編集";

        editButton.addEventListener("click", function () {
            editWord(word.id);
        });


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "削除";

        deleteButton.addEventListener("click", function () {
            deleteWord(word.id);
        });


        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);


        wordItem.appendChild(question);
        wordItem.appendChild(answer);
        wordItem.appendChild(result);
        wordItem.appendChild(buttons);


        wordList.appendChild(wordItem);
    });
}


// ==============================
// 単語を編集
// ==============================

function editWord(id) {

    const word =
        words.find(function (word) {
            return word.id === id;
        });


    if (!word) {
        return;
    }


    const newQuestion =
        prompt(
            "問題を入力してください",
            word.question
        );


    if (newQuestion === null) {
        return;
    }


    const newAnswer =
        prompt(
            "正答を入力してください",
            word.answer
        );


    if (newAnswer === null) {
        return;
    }


    const trimmedQuestion =
        newQuestion.trim();

    const trimmedAnswer =
        newAnswer.trim();


    if (
        trimmedQuestion === "" ||
        trimmedAnswer === ""
    ) {

        alert(
            "問題と正答は空欄にできません"
        );

        return;
    }


    const oldQuestion = word.question;
    const oldAnswer = word.answer;


    word.question = trimmedQuestion;
    word.answer = trimmedAnswer;


    if (!saveWords()) {

        // 保存失敗時は元に戻す
        word.question = oldQuestion;
        word.answer = oldAnswer;

        alert("保存に失敗しました");

        return;
    }


    displayWordList();
    showQuestion();
}


// ==============================
// 単語を削除
// ==============================

function deleteWord(id) {

    const word =
        words.find(function (word) {
            return word.id === id;
        });


    if (!word) {
        return;
    }


    const confirmed =
        confirm(
            "「" + word.question + "」を削除しますか？"
        );


    if (!confirmed) {
        return;
    }


    const oldWords = words;
    const oldResult = results[id];


    words =
        words.filter(function (word) {
            return word.id !== id;
        });


    delete results[id];


    // どちらかの保存に失敗したら元に戻す
    if (!saveWords() || !saveResults()) {

        words = oldWords;

        if (oldResult !== undefined) {
            results[id] = oldResult;
        }

        saveWords();
        saveResults();

        alert("削除の保存に失敗しました");

        return;
    }


    if (currentWordIndex >= words.length) {
        currentWordIndex = 0;
    }


    displayWordList();

    updateCorrectCount();

    showQuestion();
}


// ==============================
// 管理画面から戻る
// ==============================

document.getElementById("manageBackButton")
    .addEventListener("click", function () {

        showScreen("quizScreen");

        showQuestion();
    });


// ==============================
// 起動時の処理
// ==============================

updateCorrectCount();
showQuestion();
