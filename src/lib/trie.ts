/**
 * A Trie Node that contains
 * - the complete word when endOfWord is true
 * - a dict of children where the key is the next char in the word
 * - a mark endOfWord to store the fact that we added a word up to this node
 * - a circular reference to the parent node if root is false
 */
export type Trie = { children: Record<string, Trie> } & (
  | {
      endOfWord: false;
    }
  | {
      word: string;
      endOfWord: true;
    }
) &
  ({ parent: Trie; char: string; root: false } | { root: true });

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

/**
 * Empty Root Trie that can be used for empty initiation
 *
 * ### Example
 * ```typescript
 * import { emptyTrie } from '@micham/trie-ts';
 * const trie = add("word", emptyTrie);
 * ```
 */
export const emptyTrie: Trie = {
  endOfWord: false,
  children: {},
  root: true,
};

/**
 * Initiate a Trie from a list of words
 *
 * ### Example
 * ```typescript
 * import { fromList } from '@micham/trie-ts';
 * const trie = fromList(["word", "hello"]);
 * ```
 *
 * @param words words used to initiate the Trie
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
 * ### Example
 * ```typescript
 * import { of } from '@micham/trie-ts';
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
 * ### Example
 * ```typescript
 * import { add, emptyTrie } from '@micham/trie-ts';
 * const trie = add("word", emptyTrie);
 * ```
 *
 * @param word to add to the trie
 * @param trie to add the word to
 * @returns the trie with the word added
 */
export const add: AddToTrie = (word, trie) => {
  if (!word || has(word, trie)) {
    return trie;
  }

  const root = copyTrie(trie);
  word
    .toString()
    .split('')
    .reduce((trie: Trie, char: string, index: number) => {
      let child = copyTrie(trie.children[char] || emptyWithParent(trie, char));

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
 * import { remove, emptyTrie } from '@micham/trie-ts';
 * const trie = remove("word", emptyTrie);
 * ```
 *
 * @param word to remove from the trie
 * @param trie to remove the word from
 * @returns the trie with the word removed
 */
export const remove: RemoveFromTrie = (word, trie) => {
  if (!word) {
    return trie;
  }

  const root = copyTrie(trie);
  const chars = word.toString().split('');

  let node = root;
  for (const char of chars) {
    const child = node.children[char];

    // We could not find a child. This mean that the word is not present in the trie.
    // We return the trie as is
    if (!child) {
      return root;
    }

    const newChild = {
      ...copyTrie(child),
      parent: node,
      root: false,
      char,
    };

    node.children[char] = newChild;

    node = newChild;
  }

  // There are children to this word. We mark it as endOfWord = false and stop there
  if (hasChildren(node) && !isRoot(node)) {
    node.parent.children[chars[chars.length - 1]] = {
      ...copyTrie(node),
      endOfWord: false,
    };

    return root;
  }

  // There are no children. We remove the node from the trie
  if (!hasChildren(node) && !isRoot(node)) {
    delete node.parent.children[node.char];
    node = node.parent;
  }

  // For every parent node, if there are no children left and it's not a endOfWord = true. We remove the node from the trie
  while (node.root === false) {
    if (!hasChildren(node) && node.endOfWord === false) {
      delete node.parent.children[node.char];
    }
    node = node.parent;
  }

  return root;
};

/**
 * Search for all the words in the trie that start with the given prefix
 *
 * ### Example
 * ```typescript
 * import { add, search, of } from '@micham/trie-ts';
 * const trie = of("hello", "hello world", "world");
 *
 * const result = search("hello", trie);
 * // result == ["hello", "hello world"]
 * ```
 *
 * @param query prefix that will be used to search in trie
 * @param trie trie to scan
 * @returns the list of word in the trie that contain query as a prefix
 */
export const search: SearchPrefix = (query, trie) => {
  if (query.length === 0) {
    return getWords(trie);
  }

  if (!trie.children[query.charAt(0)]) {
    return [];
  }

  return search(query.slice(1), trie.children[query.charAt(0)]);
};

/**
 * Check if word is in trie
 *
 * ### Example
 * ```typescript
 * import { add, has, of } from '@micham/trie-ts';
 * const trie = of("hello", "world");
 *
 * has("hello", trie); // true
 * has("hel", trie); // false
 * has("hello world", trie); // false
 * has("world", trie); // true
 * has("wor", trie); // false
 * ```
 *
 * @param word word to check
 * @param trie
 * @returns true if there exists at least one prefix in the trie that is also a prefix of word
 */
export const has: HasWord = (word, trie) => {
  if (trie.endOfWord && word.length === 0) {
    return true;
  }

  if (word.length === 0 || !trie.children[word.charAt(0)]) {
    return false;
  }

  return has(word.slice(1), trie.children[word.charAt(0)]);
};

/**
 * Check if any of leaf in the trie is a prefix of the input
 *
 * ### Example
 * ```typescript
 * import { add, hasPrefix, of } from '@micham/trie-ts';
 * let trie = of("hello", "world");
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

const copyTrie = (trie: Trie) => {
  return {
    ...trie,
    children: { ...trie.children },
  };
};

function isRoot(trie: Trie): trie is Trie & { root: true } {
  return trie.root === true;
}

function hasChildren(trie: Trie): boolean {
  return Object.keys(trie.children).length > 0;
}

function forEach(trie: Trie, callback: (word: string) => void): void {
  if (trie.endOfWord) {
    callback(trie.word);
  }

  Object.values(trie.children).forEach((child) => forEach(child, callback));
}

function getWords(trie: Trie): string[] {
  const result: string[] = [];
  forEach(trie, (word) => result.push(word));

  return result;
}

function emptyWithParent(trie: Trie, char: string): Trie {
  return {
    ...emptyTrie,
    parent: trie,
    root: false,
    char,
  };
}
