import Question from "./Question.js"
import Quiz from "./Quiz.js"

const App = (() => {
    // cache the DOM
    const quizEl = document.querySelector(".jabquiz")
    const quizQuestionEl = document.querySelector(".jabquiz__question")
    const trackerEl = document.querySelector(".jabquiz__tracker")
    const taglineEl = document.querySelector(".jabquiz__tagline")
    const choicesEl = document.querySelector(".jabquiz__choices")
    const progressInnerEl = document.querySelector(".progress__inner")
    const nextButtonEl = document.querySelector(".next")
    const restartButtonEl = document.querySelector(".restart")

    const q1 = new Question(
        "What is my zodiac sign?",
        ["Aries", "Capricorn", "Libra", "Aquarius"],
        3
    )
    const q2 = new Question(
        "Who's my favorite DBZ character?",
        ["Gohan", "Goku", "Vegeta", "Frieza"],
        0
    )
    const q3 = new Question(
        "What's my liquor of choice?",
        ["Vodka", "Rum", "Whiskey", "Gin"],
        1
    )
    const q4 = new Question(
        "What's my favorite stand-up comedy?",
        ["Killing Them Softly", "Delirious", "Raw", "Kings of Comedy"],
        2
    )
    const q5 = new Question(
        "What's my favorite NFL team?",
        ["Pittsburgh Steelers", "San Francisco 49ers", "Philadelphia Eagles", "Dallas Cowboys"],
        1
    )
    const q6 = new Question(
        "I moved to Austin what year?",
        ["2012", "2013", "2011", "2014"],
        0
    )

    // Initialize the quiz
    const quiz = new Quiz([q1, q2, q3, q4, q5, q6])

    const listeners = _ => {
        nextButtonEl.addEventListener("click", () => {
            const selectedRadioElem = document.querySelector('input[name="choice"]:checked')
            if (selectedRadioElem) {
                const key = Number(selectedRadioElem.getAttribute("data-order"))
                quiz.guess(key)
                renderAll()
            }
        })

        restartButtonEl.addEventListener("click", () => {
            // 1. reset the quiz
            quiz.reset()
            // 2. renderAll
            renderAll()
            // 3. restore Next button
            nextButtonEl.style.opacity = 1
        })
    }
    

    const setValue = (elem, value) => {
        elem.innerHTML = value
    }

  
    const renderQuestion = _ => {
        const question = quiz.getCurrentQuestion().question
        setValue(quizQuestionEl, question)
        quizQuestionEl.innerHTML = question
    }

    const renderChoicesElements = _ => {
        let markup = ""
        const currentChoices = quiz.getCurrentQuestion().choices
        currentChoices.forEach((elem, index) => {
            markup += `
                <li class="jabquiz__choice">
                    <input type="radio" name="choice" class="jabquiz__input" data-order="${index}" id="choice${index}">
                    <label for="choice${index}" class="jabquiz__label">
                    <i></i>
                    <span>${elem}</span>
                    </label>
                </li>
            `
        })

        setValue(choicesEl, markup)
    }

    const renderTracker = _ => {
        const index = quiz.currentIndex
        setValue(trackerEl, `${index+1} of ${quiz.questions.length}`) // Read as "1 of 6", "2 of 6", etc.
    }

    const getPercentage = (num1, num2) => {
        return Math.round((num1/num2) * 100)
    }

    const launch = (width, maxPercent) => {
        let loadingBar = setInterval(function() {
            if (width > maxPercent) {
                clearInterval(loadingBar)
            } else {
                width++
                progressInnerEl.style.width = width + "%"
            }
        }, 3)
    }
    
    const renderProgress = _ => {
        // 1. width
        const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length)
        // 2. launch(0, width)
        launch(0, currentWidth)
    }
    
    const renderEndScreen = _ => {
        setValue(quizQuestionEl, `Great Job!`)
        setValue(taglineEl, `Complete!`)
        setValue(trackerEl, `Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`)
        nextButtonEl.style.opacity = 0
        renderProgress()
    }

    const renderAll = _ => {
        if (quiz.hasEnded()) {
            // renderEndScreen
            renderEndScreen()
        } else {
            // 1. render the question
            renderQuestion()
            // 2. render the choices elements
            renderChoicesElements()
            // 3. render tracker
            renderTracker()
            // 4. render progress
            renderProgress()
        }
    }

    return {
        renderAll: renderAll,
        listeners: listeners
    }
})()

App.renderAll()
App.listeners()