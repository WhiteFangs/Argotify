# Argotify
Argotify is a french slangifier. A program that transforms any french text into french slang language, using various parameters for different slang styles.

It is my [NaNoGenMo 2016](https://github.com/NaNoGenMo/2016) project, see the [related issue](https://github.com/NaNoGenMo/2016/issues/41) for discussion.

## Slang styles

There are many different ways of slang in French, I will try to implement several of them, as best as I can. Here's a list of French slang features I would like to implement:

- [x] Verlan (≈ Pig Latin in English?): cutting the word in two between two syllables and reverse the parts. Example: Ripou is the verlan of Pourri
- [x] Argot words: adding slang words or exclamations like "wesh", "gros", "sisi", "tkt", "tmtc", that are just used as punctuation ("Wesh" is the equivalent of "Yo" in English)
- [x] Simplified writing (SMS): simplifying the writing of words using shortcuts like in English for example when you write sk8 instead of skate
- [ ] Poseyyy: emphasizing the endings of words that finish with the sound "é" by adding "eyyyy". Sometimes also duplicating the first syllables in the word, for example here: Poposeyyy (a slang made famous by a strange rapper(?) called Swagg man)
- [ ] Other: multiplying the punctuations (typical internet comment writing style), etc ?

The program also includes a range input for every feature so that users can choose its degree in the text transformation.

## Program

The program exists as a browser extension for Firefox as well as Chrome, it allows it to be run on any visited webpage using Chrome or Firefox. It will be coded in Javascript.

A version of the program will be created for a text input using a textarea field in an HTML webpage.

For working on French syllables and Verlan slang, I use a small JS package I created called [metriques.js](https://github.com/WhiteFangs/metriques.js).
