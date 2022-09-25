interface SearchTreeNodeChildrenJsonFormat {
  key: string;
  value: SearchTreeNodeJsonFormat;
}

interface SearchTreeNodeJsonFormat {
  ids: number[];
  children: SearchTreeNodeChildrenJsonFormat[];
}

export default class SearchTreeNode {
  private ids: number[];
  private children: Map<string, SearchTreeNode>;

  constructor() {
    this.ids = [];
    this.children = new Map();
  }

  getIds(results = new Map(), steps = 1): Map<number, number> {
    this.ids.forEach((id) => {
      if (!(results.has(id) || results.get(id) > steps)) {
        results.set(id, steps);
      }
    });

    this.children.forEach((child) => child.getIds(results, steps + 1));

    return results;
  }

  search(text: string): Map<number, number> {
    if (text.length > 0) {
      if (!this.children.has(text[0])) return new Map();

      return this.children.get(text[0]).search(text.substring(1));
    }

    return this.getIds();
  }

  addChild(id: number, text: string): void {
    if (text.length == 0 && !this.ids.includes(id)) {
      this.ids.push(id);
      return;
    }

    if (!this.children.has(text[0])) {
      this.children.set(text[0], new SearchTreeNode());
    }

    this.children.get(text[0]).addChild(id, text.substring(1));
  }

  fromJSON(data: SearchTreeNodeJsonFormat) {
    this.ids = data.ids;

    data.children.forEach((child) => {
      const node = new SearchTreeNode();

      node.fromJSON(child.value);
      this.children.set(child.key, node);
    });
  }

  toJSON(): SearchTreeNodeJsonFormat {
    const children: SearchTreeNodeChildrenJsonFormat[] = [];

    this.children.forEach((value, key) => {
      children.push({ value: value.toJSON(), key });
    });

    return {
      ids: this.ids,
      children: children,
    };
  }
}
