interface SearchTreeNodeChildrenJsonFormat {
    key: string;
    value: SearchTreeNodeJsonFormat;
}
interface SearchTreeNodeJsonFormat {
    ids: number[];
    children: SearchTreeNodeChildrenJsonFormat[];
}
export default class SearchTreeNode {
    private ids;
    private children;
    constructor();
    getIds(results?: Map<any, any>, steps?: number): Map<number, number>;
    search(text: string): Map<number, number>;
    addChild(id: number, text: string): void;
    fromJSON(data: SearchTreeNodeJsonFormat): void;
    toJSON(): SearchTreeNodeJsonFormat;
}
export {};
