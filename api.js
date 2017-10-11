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
