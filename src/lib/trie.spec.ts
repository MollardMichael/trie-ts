import test from 'ava';
import { hasPrefix } from '..';
import { add, emptyTrie, fromList, of, Trie } from './trie';

const expectedTrie: Trie = {
  children: {
    t: {
      children: {
        e: {
          children: {},
          endOfWord: true,
          word: 'te',
        },
      },
      endOfWord: false,
    },
  },
  endOfWord: false,
};

test('can create trie from list', (t) => {
  const trieFrom = fromList(['te']);
  t.deepEqual(trieFrom, expectedTrie);
});

test('can create trie from arguments', (t) => {
  const trieOf = of('te');
  t.deepEqual(trieOf, expectedTrie);
});

test('can add word to trie', (t) => {
  const trie = add('te', emptyTrie);
  t.deepEqual(trie, expectedTrie);
});

test('can add the same word multiple time', (t) => {
  const trie = add('te', add('te', emptyTrie));
  t.deepEqual(trie, expectedTrie);
});

test('returns true if prefix is present in trie', (t) => {
  const trie = of('hello', 'world');
  t.assert(hasPrefix('hello world', trie));
  t.assert(hasPrefix('hello', trie));
  t.false(hasPrefix('hell', trie));
  t.false(hasPrefix('all', trie));
});
