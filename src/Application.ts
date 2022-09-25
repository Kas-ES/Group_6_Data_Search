import Server from './Server';
import { Index } from './interfaces/Index';
import serviceConfig from './config/service';
import MetadataRequest from './MetadataRequest';
import { Metadata } from './interfaces/Metadata';
import SearchTreeNode from './indexes/SearchTreeNode';
import SimilarityTreeNode from './indexes/SimilarityTreeNode';
import sanitize from './utility/sanitize';

export default class Application {
  /**
   * The server instance exposing the API endpoints of this application
   */
  private static server: Server;

  /**
   * The searchable indexes of the application
   */
  private static indexes: Index[] = [
    {
      key: 'songs',
      parse: ({ Id, Metadata }) => ({ id: Id, text: Metadata.Title }),
      search: new SearchTreeNode(),
      similarity: new SimilarityTreeNode(),
      names: new Map(),
    },
    {
      key: 'artists',
      parse: ({ Id, Metadata }) => ({ id: Id, text: Metadata.Artist }),
      search: new SearchTreeNode(),
      similarity: new SimilarityTreeNode(),
      names: new Map(),
    },
  ];

  /**
   * The request instance for pulling metadata, at recurring intervals
   */
  private static metadataRequest: MetadataRequest = new MetadataRequest();

  /**
   * Setup the indexes and serve application
   */
  public static async run(): Promise<Application> {
    await this.setup();
    await this.listen();

    return this;
  }

  /**
   * Fetch the metadata and setup indexes
   */
  private static async setup(): Promise<void> {
    const metadata = await this.metadataRequest.perform();

    this.indexes.forEach((index: Index) => {
      this.setupIndex(index, metadata);
    });

    // fetch updated metadata after interval
    setTimeout(() => this.setup(), serviceConfig.fetchInterval);
  }

  /**
   * Build an index from fetched metadata
   *
   * @param index
   * @param metadata
   */
  private static setupIndex(index: Index, metadata: Metadata[]): void {
    console.log(`Building ${index.key} index`);

    metadata.forEach((data: Metadata, i: number) => {
      if (serviceConfig.debug) {
        const percentage = Math.round(((i + 1) / metadata.length) * 100);

        process.stdout.cursorTo(0);
        process.stdout.write(`${percentage}% (${i + 1}/${metadata.length})`);
      }

      const { id, text } = index.parse(data);
      const words = sanitize(text).split(' ');

      index.names.set(id, text);

      // add each word to similarity indexes
      words.forEach((word) => {
        index.search.addChild(id, word);
        index.similarity.insertWord(word);
      });
    });

    if (serviceConfig.debug) {
      console.log('\n');
    }
  }

  /**
   * Expose endpoints for indexes via specified port
   */
  private static async listen(): Promise<void> {
    this.server = new Server(this.indexes);

    return this.server.listen(serviceConfig.port);
  }
}
