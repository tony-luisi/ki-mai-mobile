import DICT from "./dictionary/spellchecker.json"
import Spellchecker from "hunspell-spellchecker"

const spellchecker = new Spellchecker()
spellchecker.use(DICT)

export function checkWord(word) {
    return spellchecker.check(word)
}

export function suggestWords(word) {
    return spellchecker.suggest(word)
}

export function getDefition(word) {
    return fetch(`http://maoridictionary.co.nz/api/1.1/search?api_key=99avn8n6396h&idiom=0&phrase=0&proverb=0&loan=&pagesize=1&keywords=${word}`)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw Error("Error")
            }
        })
        .catch(error => error.message)

}
