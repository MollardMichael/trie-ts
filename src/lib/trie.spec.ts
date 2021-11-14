import test from 'ava';
import { hasPrefix } from '..';
import {
  add,
  emptyTrie,
  of,
  Trie,
  has,
  fromList,
  remove,
  search,
} from './trie';

const expectedTrie: Trie = {
  children: {},
  endOfWord: false,
  root: true,
};

const middleTrie: Trie = {
  children: {},
  endOfWord: false,
  root: false,
  parent: expectedTrie,
  char: 't',
};

const leafTrie: Trie = {
  children: {},
  endOfWord: true,
  word: 'te',
  root: false,
  parent: middleTrie,
  char: 'e',
};

middleTrie.children['e'] = leafTrie;
expectedTrie.children['t'] = middleTrie;

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

test('has resolve word already presents', (t) => {
  const trie = of('hello', 'world');

  t.assert(has('hello', trie)); // true
  t.false(has('hel', trie)); // false
  t.false(has('hello world', trie)); // false
  t.assert(has('world', trie)); // true
  t.false(has('wor', trie)); // false
});

test('delete from single word Trie', (t) => {
  const trie = of('hello world');
  const removedTrie = remove('hello world', trie);

  t.deepEqual(removedTrie, emptyTrie, 'trie has become empty');
  t.deepEqual(trie, of('hello world'), 'initial trie has not been modified');
});

test('delete word with no children', (t) => {
  const trie = of('a', 'aa', 'b', 'bbb');

  const withoutAA = remove('aa', trie);
  t.assert(
    withoutAA.children['a'].children['a'] === undefined,
    'Word with no children is removed from children'
  );
  t.assert(
    trie.children['a'].children['a'].endOfWord,
    "Initial trie hasn't been modified"
  );
});

test('delete word that is in the prefix of another', (t) => {
  const trie = of('a', 'aa');

  t.false(
    remove('a', trie).children['a'].endOfWord,
    'Remove word with children is not longer end of word'
  );
  t.assert(trie.children['a'].endOfWord, "Initial trie hasn't been modified");
});

test('delete word with nodes that are not the end of words in between', (t) => {
  const trie = of('b', 'bbb');

  const withoutBBB = remove('bbb', trie);
  t.assert(withoutBBB.children['b'].endOfWord);
  t.assert(withoutBBB.children['b'].children['b'] === undefined);
});

test('search for word in trie by prefix', (t) => {
  const trie = of('hello', 'hello world', 'world');

  t.deepEqual(search('hello', trie), ['hello', 'hello world']);
  t.deepEqual(search('hel', trie), ['hello', 'hello world']);
  t.deepEqual(search('help', trie), []);
  t.deepEqual(search('', trie), ['hello', 'hello world', 'world']);
});
