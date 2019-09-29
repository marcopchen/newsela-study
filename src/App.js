import React from 'react';
import logo from './logo.svg';
import './App.css';

const questions = require('./questions.json');

function App() {
  console.log(sortQuestions(questions));
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function sortQuestions(results) {
  const lowerScoredCount = {};
  const higherScoredCount = {};
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const { text, percent_correct } = result;
    // The following is to remove punctuation marks from the text.
    const words =
      !text ? [] : text.replace(/[^\w\s-]|_/g, ' ').split(/\s+/g);
    if (percent_correct < 0.5) {
      countWords(words, lowerScoredCount);
    } else if (percent_correct >= 0.5) {
      countWords(words, higherScoredCount);
    }
  }
  const lowerScoredResults = Object.keys(lowerScoredCount)
    .map(function (word) {
      return { word, count: lowerScoredCount[word] }
    })
    .sort(function (a, b) {
      return b.count - a.count;
    });
  const higherScoredResults = Object.keys(higherScoredCount)
    .map(function (word) {
      return { word, count: higherScoredCount[word] }
    })
    .sort(function (a, b) {
      return b.count - a.count;
    });
  return { lowerScoredResults, higherScoredResults };
}

function countWords(words, counts) {
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const lowerWord = word.toLowerCase();
    const wordMinusOne = word.substr(0, word.length - 1);
    const wordMinusTwo = word.substr(0, word.length - 2);
    if (word.indexOf('blockquote') > -1) {
      continue;
    }
    if (word === 'br') {
      continue;
    }
    if (word[0] === '-' || word[word.length - 1] === '-') {
      continue;
    }
    if (word.length <= 1 && word !== 'I') {
      continue;
    }
    if (!counts[word]) {
      counts[word] = 1;
    } else {
      counts[word] += 1;
    }
    // The following is to only count the lower case form of the word if it appears in any text.
    if (word !== lowerWord && counts[lowerWord]) {
      const upperCount = counts[word] || 0;
      counts[lowerWord] += upperCount;
      delete counts[word];
    }
    // There are many suffices like "-ies" and "-ing" that should be considered too.
    if (counts[wordMinusOne]) {
      const suffixCount = counts[word] || 0;
      counts[wordMinusOne] += suffixCount;
      delete counts[word];
    }
    if (counts[wordMinusTwo]) {
      const suffixCount = counts[word] || 0;
      counts[wordMinusTwo] += suffixCount;
      delete counts[word];
    }
  }
}

export default App;
