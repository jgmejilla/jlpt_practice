let flashcards

class Flashcard { 
    constructor(expression, reading, meaning, next=0) {
        this.expression = expression
        this.reading = reading
        this.meaning = meaning
        this.next = next
    }
}

async function makeFlashcards() {
    const response = await fetch('./preprocess/n5.csv')
    const text = await response.text()
    const lines = text.split('\n').slice(1) 

    flashcards = lines.map((line) => {
        const [expression, reading, meaning] = line.split('\t')
        return new Flashcard(expression, reading, meaning)
    })

    return flashcards
}

function newFlashcard() {
    const flashcard = pickFlashcard() 
    displayFlashcard(flashcard)
}

// currently picked randomly; TO-DO: FSRS algorithm
function pickFlashcard() {
    const index = Math.floor(Math.random() * flashcards.length) - 1 // 0-indexed
    return flashcards[index]
}


function displayFlashcard(flashcard) {
    const expression = document.getElementById('expression')
    const reading = document.getElementById('reading')
    const meaning = document.getElementById('meaning')

    expression.textContent = flashcard.expression
    if (flashcard.expression !== flashcard.reading) 
        reading.textContent = flashcard.reading
    meaning.textContent = flashcard.meaning
}

function keydown(event) {
    if (event.key == ' ') {
        newFlashcard()
    }
}

function toggleKana(e) {
    const toggle = document.getElementById('toggle-kana')
    const reading = document.getElementById('reading')
    if (toggle.checked) reading.style.display = "inline"
    else reading.style.display = "none"
}

async function main() {
    await makeFlashcards() 
    document.addEventListener('keydown', keydown)


    newFlashcard()
}

main()