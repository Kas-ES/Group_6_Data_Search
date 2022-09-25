import SearchTreeNode from '../indexes/SearchTreeNode';
import SimilarityTreeNode from '../indexes/SimilarityTreeNode';
import { Metadata } from './Metadata';
export interface Index {
    key: string;
    parse: (metadata: Metadata) => {
        id: number;
        text: string;
    };
    search: SearchTreeNode;
    similarity: SimilarityTreeNode;
    names: Map<number, string>;
}
