import * as express from 'express';
import { Express, Request, Response } from 'express';
import { Index } from './interfaces/Index';
import serviceConfig from './config/service';
import Search from './Search';
import path from 'path';

export default class Server {
  private server: Express;
  private indexes: Index[];

  /**
   *
   * @param indexes
   */
  constructor(indexes: Index[]) {
    this.indexes = indexes;
    this.server = express();

    this.setMiddleware();
    this.setRoutes();
  }

  /**
   * Set any middleware
   */
  private setMiddleware(): void {
    this.server.use(express.json());
  }

  /**
   * Define routes for application, before servering
   */
  private setRoutes(): void {
    // for debugging purposes, serve a static file testing the service
    if (serviceConfig.debug) {
      this.server.get('/', (req: Request, res: Response) => {
        res.sendFile('dist/static/index.html', { root: path.resolve('.') });
      });
    }

    // expose the endpoints for querying the indexes
    this.indexes.forEach((index: Index) => {
      this.setIndexRoute(index);
    });
  }

  /**
   * Define a new route for the provided index
   *
   * @param index
   */
  private setIndexRoute(index: Index): void {
    const route = `/search/${index.key}/:query`;

    this.server.get(route, (req: Request, res: Response) => {
      const { query } = req.params;

      // set request content type to json
      res.setHeader('Content-Type', 'application/json');

      try {
        // execute the query and return result
        res.send(Search.perform(index, query));
      } catch (e) {
        res.status(500);

        // for debugging, return error, otherwise standard message
        if (serviceConfig.debug) {
          res.send({ msg: e });
        } else {
          res.send({ msg: 'Server error' });
        }
      }
    });
  }

  /**
   * Expose endpoints for indexes via specified port
   *
   * @param port
   */
  public listen(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(port, () => {
        console.log(`Service listening at port ${port}`);
        resolve();
      });
    });
  }
}
