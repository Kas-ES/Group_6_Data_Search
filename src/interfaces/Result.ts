export interface Result {
  /**
   * Unique numeric id refering to the result entity
   */
  id: number;

  /**
   * Determined score of the result, based on the index result and query
   */
  score: number;

  /**
   * Song or album title of the result
   */
  title: string;
}
