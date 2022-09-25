export default class SimilarityTreeNode {
    representative: string;
    private children;
    private level;
    constructor(representative?: string, level?: number);
    private exists;
    private getClosestChild;
    private appendChild;
    insertWord(word: string): void;
    private sortByQuerySimilarity;
    search(word: string): string[];
}
