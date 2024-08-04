/* 
TO-DO:
- add persistence via localStorage
- add FSRS system 
- fix fonts in toggle and scores
- reverse position of correct and wrong
*/

const expression = document.getElementById('expression')
const reading = document.getElementById('reading')
const meaning = document.getElementById('meaning')
const jisho = document.getElementById('jisho-link')


const prerevealButtons = document.getElementById('prereveal-buttons')
const postrevealButtons = document.getElementById('postreveal-buttons')

const toggle = document.getElementById('toggle-kana')
const label = document.getElementById('toggle-kana-label')
const toggleJP = document.getElementById('toggle-japanese')
const labelJP = document.getElementById('toggle-japanese-label')

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
    const response = await fetch('./../preprocess/n5_processed.csv')
    const text = await response.text()
    const lines = text.split('\n').slice(1) 

    flashcards = lines.map((line) => {
        const [expression, reading, meaning] = line.split('\t')
        return new Flashcard(expression, reading, meaning)
    })
    console.log(flashcards)
    return flashcards
}

function newFlashcard() {
    resetFlashcard()
    flashcard = pickFlashcard() 
    displayFlashcard(flashcard)
}

function resetFlashcard() {
    prerevealButtons.style['display'] = 'flex'    
    postrevealButtons.style['display'] = 'none'
    meaning.textContent = ''

    expression.style['color'] = 'black'
    jisho.style.textDecoration = 'none'
  
    jisho.removeAttribute('target')
    jisho.removeAttribute('href')
}

// currently picked randomly; TO-DO: FSRS algorithm
function pickFlashcard() {
    const index = Math.floor(Math.random() * flashcards.length) - 1 // 0-indexed
    return flashcards[index]
}


function displayFlashcard() {    
    expression.textContent = flashcard.expression
    if (flashcard.expression != flashcard.reading) 
        reading.textContent = flashcard.reading
    else 
        reading.textContent = ''
}

function revealFlashcard() {
    meaning.textContent = flashcard.meaning    
    flashcard.revealed = true

    prerevealButtons.style['display'] = 'none'  
    postrevealButtons.style['display'] = 'flex'

    expression.style['color'] = '#2563eb'
    jisho.style.textDecoration = 'underline 4px #2563eb'
    jisho.style.textUnderlineOffset = '12px'
    jisho.href = `https://jisho.org/search/${expression.textContent}`
    jisho.target = '_blank'

}

function updateScore(key) {
    if (key == 2) score.rights += 1
    else score.wrongs += 1
    if (score.rights == 0 && score.wrongs == 0) score.percentage = 0
    else score.percentage = `${Math.floor(score.rights/(score.rights+score.wrongs) * 100)}%`

    const rights = document.querySelector('#rights')
    const wrongs = document.querySelector('#wrongs')
    const percentage = document.querySelector('#percentage')
    

    rights.textContent = score.rights
    wrongs.textContent = score.wrongs
    percentage.textContent = score.percentage

    
    // console.log(score.rights, score.wrongs)
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
        if (!flashcard.revealed) return
        updateScore(1)
    }

    if (event.key == '2') {
        if (!flashcard.revealed) return
        updateScore(2) 
    }

    if (event.key == 'e') {
        if (toggleJP.checked) toggleJP.checked = false
        else toggleJP.checked = true

        toggleJapanese()
    }
 }

function toggleKana() {
    if (toggle.checked) {
        reading.style.display = "inline"
        label.textContent = 'Hide reading (R)'
    }
    else {
        reading.style.display = "none"
        label.textContent = 'Show reading (R)'
    }
}

function toggleJapanese() {
    if (toggleJP.checked) {
        labelJP.textContent = 'サイトの言語: 日本語'
        translate()
    }
    else {
        
        labelJP.textContent = 'Site language: English'
    }
}

function translate() {
    console.log('Hi, mom! Translation in progress...')
    /* https://www.w3schools.com/howto/howto_google_translate.asp */ 
}

async function main() {
    await makeFlashcards() 
    document.addEventListener('keydown', keydownManager)
    newFlashcard()
}

main()