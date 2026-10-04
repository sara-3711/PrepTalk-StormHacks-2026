let selectedQuestion = "";



// GENERATE QUESTIONS


async function generateQuestions() {

    const topic = document
        .getElementById("topic")
        .value
        .trim();

    const audience =
        document.getElementById("audience").value;


    if (!topic) {
        alert("Please enter a presentation topic.");
        return;
    }


    const button =
        document.getElementById("generateButton");

    button.disabled = true;
    button.textContent = "Generating...";


    try {

        const response = await fetch("/api/questions", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                topic,
                audience
            })

        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.error || "Could not generate questions."
            );
        }


        displayQuestions(data.questions);


    } catch (error) {

        console.error(error);

        alert(error.message);


    } finally {

        button.disabled = false;

        button.textContent =
            "Generate Questions";
    }
}




// DISPLAY QUESTIONS


function displayQuestions(questions) {

    const container =
        document.getElementById("questions");


    container.innerHTML = "";


    questions.forEach((question) => {

        const card =
            document.createElement("div");


        card.className =
            "question-card";


        card.textContent =
            question;


        card.onclick = () => {

            selectQuestion(
                question,
                card
            );

        };


        container.appendChild(card);

    });


    document.getElementById(
        "questionsCard"
    ).style.display = "block";

}




// SELECT QUESTION


function selectQuestion(question, element) {

    selectedQuestion = question;


    document
        .querySelectorAll(".question-card")
        .forEach((card) => {

            card.classList.remove("selected");

        });


    element.classList.add("selected");


    document.getElementById(
        "chosenQuestion"
    ).textContent = question;


    document.getElementById(
        "answerCard"
    ).style.display = "block";


    document.getElementById(
        "feedback"
    ).style.display = "none";

}




// GET FEEDBACK


async function getFeedback() {

    const topic =
        document
            .getElementById("topic")
            .value
            .trim();


    const audience =
        document.getElementById("audience").value;


    const answer =
        document
            .getElementById("answer")
            .value
            .trim();


    if (!selectedQuestion) {

        alert("Please select a question.");

        return;

    }


    if (!answer) {

        alert("Please type an answer.");

        return;

    }


    const button =
        document.getElementById("feedbackButton");


    button.disabled = true;

    button.textContent = "Analyzing...";


    try {

        const response = await fetch("/api/feedback", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                topic,

                audience,

                question: selectedQuestion,

                answer

            })

        });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Could not generate feedback."
            );

        }


        displayFeedback(data);


    } catch (error) {

        console.error(error);

        alert(error.message);


    } finally {

        button.disabled = false;

        button.textContent =
            "Get Feedback";

    }

}



// DISPLAY FEEDBACK

function displayFeedback(data) {

    document.getElementById(
        "clarity"
    ).textContent =
        `${data.clarity}/5`;


    document.getElementById(
        "relevance"
    ).textContent =
        `${data.relevance}/5`;


    document.getElementById(
        "strengths"
    ).textContent =
        data.strength;


    document.getElementById(
        "improvement"
    ).textContent =
        data.improvement;


    document.getElementById(
        "betterAnswer"
    ).textContent =
        data.improvedAnswer;


    document.getElementById(
        "feedback"
    ).style.display = "block";

}