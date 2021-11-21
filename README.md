# trie-ts

This repository is yet another implementation of a trie in full typescript with a functional approach.
This implementation favor time complexity over space complexity by storing a bit more information than necessary in each node.

A Trie is a Tree Data structure that usually store characters arrays in a way that makes it easy to perform prefix searches.

Example of a trie taken from [Wikipedia](https://en.wikipedia.org/wiki/Trie)

![picture of trie](https://upload.wikimedia.org/wikipedia/commons/b/be/Trie_example.svg)

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

If you are using a library such as fp-ts or any other that allow you to use a "pipe" util, you'll be able to use the second version of the api with a syntax that looks like that

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
