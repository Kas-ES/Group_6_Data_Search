import SearchTreeNode from '../indexes/SearchTreeNode';
import SimilarityTreeNode from '../indexes/SimilarityTreeNode';
import { Metadata } from './Metadata';

export interface Index {
  /**
   * Name of the index, used for routing purposes.
   */
  key: string;

  /**
   * Callback for parsing metadata to indexable id and text.
   */
  parse: (
    metadata: Metadata
  ) => {
    id: number;
    text: string;
  };

  /**
   * The search index used for full word searching, providing ids and scores.
   */
  search: SearchTreeNode;

  /**
   * The similarity index used for fuzzy search, providing similar words to query.
   */
  similarity: SimilarityTreeNode;

  /**
   * For debugging purposes only, a map between ids and names.
   */
  names: Map<number, string>;
}
