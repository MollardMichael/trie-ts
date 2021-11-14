import {
  add as simpleAdd,
  has as simpleHas,
  hasPrefix as simpleHasPrefix,
  remove as simpleRemove,
  search as simpleSearch,
  Trie,
} from './trie';

type AddToTrie = (word: string) => (trie: Trie) => Trie;

type RemoveFromTrie = (word: string) => (trie: Trie) => Trie;

type HasWord = (word: string) => (trie: Trie) => boolean;

type SearchPrefix = (query: string) => (trie: Trie) => string[];

type HasPrefix = (word: string) => (trie: Trie) => boolean;

/**
 * A curried version of add
 *
 * @see {@link index.add | add}
 */
export const add: AddToTrie = (word) => (trie) => simpleAdd(word, trie);

/**
 * A curried version of remove
 *
 * @see {@link index.remove | remove}
 */
export const remove: RemoveFromTrie = (word) => (trie) =>
  simpleRemove(word, trie);

/**
 * A curried version of has
 *
 * @see {@link index.has | has}
 */
export const has: HasWord = (word) => (trie) => simpleHas(word, trie);

/**
 * A curried version of search
 *
 * @see {@link index.search | search}
 */
export const search: SearchPrefix = (word) => (trie) =>
  simpleSearch(word, trie);

/**
 * A curried version of search
 *
 * @see {@link index.hasPrefix | hasPrefix}
 */
export const hasPrefix: HasPrefix = (word) => (trie) =>
  simpleHasPrefix(word, trie);
