import levenshtein from '../utility/levenshtein';
import similarityConfig from '../config/similarity';

export default class SimilarityTreeNode {
  public representative: string;
  private children: SimilarityTreeNode[];
  private level: number;

  /**
   * Construct a new instance of SimilarityTreeNode
   *
   * @param representative the word reprenting this node, `undefined` for root
   * @param level the level of depth that this node is on, compared to root
   */
  constructor(representative?: string, level: number = 0) {
    this.representative = representative;
    this.children = [];
    this.level = level;
  }

  /**
   * Check if a word exists on current node or nested child nodes
   *
   * @param word word to check exists
   */
  private exists(word: string): boolean {
    if (this.representative == word) {
      return true;
    }

    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].exists(word)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get the child that has the lowest Levenshtein Distance to the specified word
   *
   * @param word word to compare children against
   */
  private getClosestChild(
    word: string
  ): { distance: number; tree: SimilarityTreeNode } {
    return this.children.reduce(
      (
        previous: { distance: number; tree: SimilarityTreeNode } | null,
        tree: SimilarityTreeNode
      ) => {
        const distance = levenshtein(word, tree.representative);

        // set reduced result to child with lowrest distance and its distance
        return previous === null || distance < previous.distance
          ? { distance, tree }
          : previous;
      },
      null
    );
  }

  /**
   * Append a new child to this node
   *
   * @param word word to represent child node
   */
  private appendChild(word: string): void {
    this.children.push(new SimilarityTreeNode(word, this.level + 1));
  }

  /**
   * Insert a new word intnro the similarity tree
   *
   * @param word inserted word
   */
  public insertWord(word: string): void {
    // from root node, check for the word's existece in children
    if (this.level === 0 && this.exists(word)) {
      return;
    }

    // in case no children exists, simply insert as child of current node
    if (this.children.length === 0) {
      this.appendChild(word);
      return;
    }

    // find the most similar child in the tree node
    const closestChild = this.getClosestChild(word);

    // check if max children reached or distance under threshold, or attach new child node
    if (
      this.children.length === similarityConfig.maxChildrenNodes ||
      closestChild.distance <= similarityConfig.maxLevenshteinDistance
    ) {
      closestChild.tree.insertWord(word);
      return;
    }

    // by default, append a new child node with word as representative
    this.appendChild(word);
  }

  private sortByQuerySimilarity(query: string, w1: string, w2: string): number {
    return levenshtein(query, w1) - levenshtein(query, w2);
  }

  /**
   * Search the similarity tree for similar words to parameter word
   *
   * @param word the word to compare similarity to
   */
  public search(word: string): string[] {
    const results: string[] = [];

    this.children
      .sort((c1: SimilarityTreeNode, c2: SimilarityTreeNode) =>
        this.sortByQuerySimilarity(word, c1.representative, c2.representative)
      )
      .forEach((child: SimilarityTreeNode) => {
        if (results.length >= similarityConfig.maxSampleSize) {
          return;
        }

        results.push(
          ...[child.representative, ...child.search(word)]
            .sort((w1: string, w2: string) =>
              this.sortByQuerySimilarity(word, w1, w2)
            )
            .slice(0, similarityConfig.maxSampleSize - results.length)
        );
      });

    if (this.level !== 0) {
      return results;
    }

    return results
      .sort((w1: string, w2: string) =>
        this.sortByQuerySimilarity(word, w1, w2)
      )
      .slice(0, similarityConfig.maxResultSize);
  }
}
