# trie-ts

![license](https://img.shields.io/github/license/MollardMichael/trie-ts.svg)
[![codecov](https://codecov.io/gh/MollardMichael/trie-ts/branch/master/graph/badge.svg?token=OI6LKGG1R7)](https://codecov.io/gh/MollardMichael/trie-ts)
![Build Status](https://github.com/MollardMichael/trie-ts/actions/workflows/push.yml/badge.svg)

This repository is yet another implementation of a trie in full typescript with a functional approach.

## Why should I use this library?

At the time I created this lib, I could not find a javascript implementation of a trie that satisfied those criteria:

- Written in typescript (fully typed) for seamless integration in typescript based applications and libraries
- Provided both a search and a hasPrefix functionality

## A Trie ?

A Trie is a Tree Data structure that usually stores characters arrays in a way that makes it easy to perform prefix searches.

Example of a trie taken from [Wikipedia](https://en.wikipedia.org/wiki/Trie)

![picture of trie](https://upload.wikimedia.org/wikipedia/commons/b/be/Trie_example.svg)

Some implementation details:

- All functions are pure
- No functions mutate the input
- The trie is implemented using a javascript record type. There is no limit on the alphabet you can use
- A radix trie wasn't used (this could be improved to save on spatial complexity)

## Use cases

Here are some use cases in which this library can help you

- You need to check that a word is present in a list of words (Though you could do that with a simple dict)
- You need to check is a word is a prefix of a known word in a dictionary
- You need to check if a given word start with a prefix that is amongst a list of known prefix
- You want to create a custom autocomplete

Using this library, you'll be able to gain performance that will outshine a simple .map on a list of word.

## Installation

### Using NPM

```shell
npm install @micham/trie-ts
```

### Using Yarn

```shell
yarn add @micham/trie-ts
```

## API

### Usage

#### Check that if a word is a prefix of a word present in a known text

```typescript
import { fromList, search } from '@micham/trie-ts';
// cspell:disable-next
const text = 'Lorem ipsum dolor sit';

const trie = fromList(text.split(''));

search('ip', trie).length > 0; // true
search('not in text', trie).length > 0; // false
```

#### Check is a word startWith a specific sequence of char

```typescript
import { of, hasPrefix } from '@micham/trie-ts';
const trie = of('secret', 'token', 'jwt');

hasPrefix('secret-text', trie); // true
hasPrefix('my-secret', trie); // true
hasPrefix('jwt', trie); // true
```

This library expose two APIs.

### Base API

The first one is available [here](https://mollardmichael.github.io/trie-ts/modules/index.html) and consist of the following functions

```typescript
/**
 * Create a Trie from a list of words
 */
type MakeTrieFromList = (words: string[]) => Trie;
/**
 * Create a Trie from function argument list
 */
type TrieOfWords = (...words: string[]) => Trie;
/**
 * Add word to Trie
 */
type AddToTrie = (word: string, trie: Trie) => Trie;
/**
 * Remove word from Trie
 */
type RemoveFromTrie = (word: string, trie: Trie) => Trie;
/**
 * Check if word is already in Trie
 */
type HasWord = (word: string, trie: Trie) => boolean;
/**
 * Check all the words that match the query prefix
 */
type SearchPrefix = (query: string, trie: Trie) => string[];
/**
 * Check that the Trie contains at least one prefix of word
 */
type HasPrefix = (word: string, trie: Trie) => boolean;
```

### Pipe-able API

[Documentation](https://mollardmichael.github.io/trie-ts/modules/lib_pipeable.html)

If you are using a library such as fp-ts or any other that allow you to use a "pipe" util, you'll be able to use the second version of the api with a syntax that looks like what you can see below

```typescript
import { add, emptyTrie } from '@micham/trie-ts/lib/pipeable';

pipe(
  emptyTrie,
  add('word'),
  add('word1'),
  add('word2'),
  add('word3'),
  add('word4'),
  add('word5'),
  add('word6')
);
```
