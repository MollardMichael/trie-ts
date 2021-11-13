/**
 * A Tree Node that contains
 * - the complete word when endOfWord is true
 * - a dict of children where the key is the next char in the word
 * - a mark to preserve the fact that a word finished here
 */
export type Trie = { children: Record<string, Trie> } & (
  | {
      endOfWord: false;
    }
  | {
      word: string;
      endOfWord: true;
    }
);

type MakeTrieFromList = (words: string[]) => Trie;
type TrieOfWords = (...words: string[]) => Trie;
type AddToTrie = (word: string, trie: Trie) => Trie;
type RemoveFromTrie = (word: string, trie: Trie) => Trie;
type SearchPrefix = (query: string, trie: Trie) => string[];
type HasPrefix = (word: string, trie: Trie) => boolean;

/**
 * Empty Trie that can be used to initiate your tries
 *
 *  * ### Example
 * ```typescript
 * import { emptyTrie } from 'trie-js';
 * const trie = add("word", emptyTrie);
 * ```
 */
export const emptyTrie: Trie = {
  endOfWord: false,
  children: {},
};

const copyTrie = (trie: Trie) => {
  return {
    ...trie,
    children: { ...trie.children },
  };
};

/**
 * Initiate a Trie from a list of words
 *
 *  * ### Example
 * ```typescript
 * import { fromList } from 'trie-js';
 * const trie = fromList(["word", "hello"]);
 * ```
 *
 * @param words Word used to initiate the Trie
 * @returns the initiated Trie
 */
export const fromList: MakeTrieFromList = (words) => {
  return words.reduce(
    (trie: Trie, word) => add(word, trie),
    copyTrie(emptyTrie)
  );
};

/**
 * Initiate a Trie from a list of words
 *
 *  * ### Example
 * ```typescript
 * import { of } from 'trie-js';
 * const trie = of("word", "hello");
 * ```
 *
 * @param words Word used to initiate the Trie
 * @returns the initiated Trie
 */
export const of: TrieOfWords = (firstWord: string, ...words) => {
  return [...words, firstWord].reduce(
    (trie: Trie, word) => add(word, trie),
    copyTrie(emptyTrie)
  );
};

/**
 * This function will return a Trie with the word added to it
 *
 *  * ### Example
 * ```typescript
 * import { add, emptyTrie } from 'trie-js';
 * const trie = add("word", emptyTrie);
 * ```
 *
 * @param word to add to the trie
 * @param trie to add the word to
 * @returns the trie with the word added
 */
export const add: AddToTrie = (word, trie) => {
  const root = copyTrie(trie);
  word.split('').reduce((trie: Trie, char: string, index: number) => {
    let child = copyTrie(trie.children[char] || emptyTrie);

    if (index === word.length - 1) {
      child = {
        ...child,
        endOfWord: true,
        word,
      };
    }

    trie.children = { ...trie.children, [char]: child };
    return child;
  }, root);

  return root;
};

/**
 * This function will try to remove a word from the trie.
 * If this word was not present in the trie, the trie will not be updated
 *
 * ### Example
 * ```typescript
 * import { remove, emptyTrie } from 'trie-js';
 * const trie = remove("word", emptyTrie);
 * ```
 *
 * @param word to remove from the trie
 * @param trie to remove the word from
 * @returns the trie with the word removed
 */
export const remove: RemoveFromTrie = (_word, trie) => {
  return trie;
};

/**
 * Search for all the words in the trie that start with the given prefix
 *
 * ### Example
 * ```typescript
 * import { add, search, emptyTrie } from 'trie-js';
 * let trie = emptyTrie;
 * trie = add("hello", trie);
 * trie = add("hello world", trie);
 * trie = add("world", trie);
 *
 * const result = search("hello", trie);
 * // result == ["hello", "hello world"]
 * ```
 *
 * @param query prefix that will be used to search in trie
 * @param trie trie to scan
 * @returns the list of word in the trie that contain query as a prefix
 */
export const search: SearchPrefix = (_query, _trie) => {
  return [];
};

/**
 * Check if any of the word in the trie is also a prefix of the input
 *
 * ### Example
 * ```typescript
 * import { add, hasPrefix, emptyTrie } from 'trie-js';
 * let trie = emptyTrie;
 * trie = add("hello", trie);
 * trie = add("world", trie);
 *
 * hasPrefix("hello", trie); // true
 * hasPrefix("hello world", trie); // true
 * hasPrefix("hell", trie); // false
 * hasPrefix("all", trie); // false
 * ```
 *
 * @param word word to check
 * @param trie
 * @returns true if there exists at least one prefix in the trie that is also a prefix of word
 */
export const hasPrefix: HasPrefix = (word, trie) => {
  if (trie.endOfWord) {
    return true;
  }

  if (word.length === 0 || !trie.children[word.charAt(0)]) {
    return false;
  }

  return hasPrefix(word.slice(1), trie.children[word.charAt(0)]);
};
