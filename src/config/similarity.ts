export default {
  /**
   * Maximum number of children nodes attached to a single similarity tree.
   */
  maxChildrenNodes: 100,

  /**
   * Maximum allowed distance between inserted word and child representative word.
   */
  maxLevenshteinDistance: 2,

  /**
   * Maximum amount of samples when searching through the similarity tree.
   */
  maxSampleSize: 100,

  /**
   * Maximum number of results after sorting the searched samples.
   */
  maxResultSize: 3,
};
