let flashcards
let flashcard
let score = {
    'rights': 0,
    'wrongs': 0,
    'percentage': 0,
}

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
    // reset buttons
    const prerevealButtons = document.getElementById('prereveal-buttons')
    prerevealButtons.style['display'] = 'flex'
    const postrevealButtons = document.getElementById('postreveal-buttons')
    postrevealButtons.style['display'] = 'none'
    
    // reset meaning 
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

    const prerevealButtons = document.getElementById('prereveal-buttons')
    prerevealButtons.style['display'] = 'none'
    const postrevealButtons = document.getElementById('postreveal-buttons')
    postrevealButtons.style['display'] = 'flex'
}

function updateScore(key) {
    // 1 = correct, 2 = wrong
    if (key == 1) score.rights += 1
    else score.wrongs += 1
    if (score.rights == 0 && score.wrongs == 0) score.percentage = 0
    else score.percentage = `${Math.floor(score.rights/(score.rights+score.wrongs) * 100)}%`


    const rights = document.querySelector('#rights')
    const wrongs = document.querySelector('#wrongs')
    const percentage = document.querySelector('#percentage')
    

    rights.textContent = score.rights
    wrongs.textContent = score.wrongs
    percentage.textContent = score.percentage

    
    console.log(score.rights, score.wrongs)
    newFlashcard()
}

/* input management */

function keydownManager(event) {
    event.preventDefault()
    if (event.key == ' ') {
        revealFlashcard()
        
    }

    if (event.key == 'r') {
        
        const toggle = document.getElementById('toggle-kana') 
        if (toggle.checked) toggle.checked = false
        else {toggle.checked = true}
      
        toggleKana()
    }

    if (event.key == '1') {
        updateScore(1)
    }

    if (event.key == '2') {
        updateScore(2) 
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