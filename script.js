let flashcards
let flashcard


class Flashcard { 
    constructor(expression, reading, meaning, next=0, revealed=false) {
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
    document.getElementById('meaning').textContent = ''
    flashcard = pickFlashcard() 
    displayFlashcard(flashcard)
}

// currently picked randomly; TO-DO: FSRS algorithm
function pickFlashcard() {
    const index = Math.floor(Math.random() * flashcards.length) - 1 // 0-indexed
    return flashcards[index]
}


function displayFlashcard() {
    const expression = document.getElementById('expression')
    const reading = document.getElementById('reading')

    expression.textContent = flashcard.expression
    if (flashcard.expression != flashcard.reading) 
        reading.textContent = flashcard.reading
    else 
        reading.textContent = ''
    
}

function revealFlashcard() {
    const meaning = document.getElementById('meaning')
    meaning.textContent = flashcard.meaning
    flashcard.revealed = true
}

/* input management */

function keydownManager(event) {
    event.preventDefault()
    if (event.key == ' ') {
        if (flashcard.revealed == true) {
            flashcard.revealed = false
            newFlashcard()
        }
        else {
            revealFlashcard()
        }
    }

    if (event.key == 'r') {
        
        const toggle = document.getElementById('toggle-kana') 
        if (toggle.checked) toggle.checked = false
        else {toggle.checked = true}
      
        toggleKana()
    }
 }

function toggleKana() {
    const toggle = document.getElementById('toggle-kana')
    const reading = document.getElementById('reading')
    const label = document.getElementById('toggle-kana-label')
    if (toggle.checked) {
        reading.style.display = "inline"
        label.textContent = 'Hide reading (R)'
    }
    else {
        reading.style.display = "none"
        label.textContent = 'Show reading (R)'
    }
}



async function main() {
    await makeFlashcards() 
    document.addEventListener('keydown', keydownManager)
    newFlashcard()
}

main()