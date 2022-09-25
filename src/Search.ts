import { Index } from './interfaces/Index';
import { Result } from './interfaces/Result';
import sanitize from './utility/sanitize';
import searchConfig from './config/search';
import serviceConfig from './config/service';
import SearchTreeNode from './indexes/SearchTreeNode';

type ResultIdScoreMap = Map<number, number>;

export default class Search {
  /**
   * Search provided tree by word and score with multiplier
   *
   * @param tree
   * @param results
   * @param scoreMultiplier
   * @param word
   */
  private static searchByWord(
    tree: SearchTreeNode,
    results: ResultIdScoreMap,
    scoreMultiplier: number,
    word: string
  ) {
    tree.search(word).forEach((value, key) => {
      if (results.has(key)) {
        results.set(key, results.get(key) * scoreMultiplier);
      } else {
        results.set(key, value);
      }
    });
  }

  /**
   * Perform a search for query in provided index
   *
   * @param index
   * @param query
   */
  public static perform(index: Index, query: string): Result[] {
    const results: ResultIdScoreMap = new Map();

    sanitize(query)
      .split(' ')
      .forEach((word) => {
        console.log('w', word);
        // search for exact match
        this.searchByWord(
          index.search,
          results,
          searchConfig.wordScoreMultiplier,
          word
        );

        // find similar words and search for them
        index.similarity.search(word).forEach((fuzzyWord) => {
          this.searchByWord(
            index.search,
            results,
            searchConfig.fuzzyScoreMultiplier,
            fuzzyWord
          );
        });
      });

    // sort by score, slice to max results and return
    return Array.from(
      [...results.entries()].sort((a: number[], b: number[]) => {
        return a[1] - b[1];
      })
    )
      .slice(0, searchConfig.maxResults)
      .map(
        (res): Result => ({
          id: res[0],
          score: Number(res[1].toFixed(2)),
          title: index.names.get(res[0]),
        })
      );
  }
}
