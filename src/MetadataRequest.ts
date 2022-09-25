import fetch from 'node-fetch';
import { format } from 'date-fns';
import serviceConfig from './config/service';
import { Metadata } from './interfaces/Metadata';
import { Result } from './interfaces/Result';

export default class MetadataRequest {
  /**
   * The data when the metadata was last fetched, in order to avoid duplicates
   */
  private lastFetched: Date = new Date(0);

  /**
   * Perform a request against the media acquisition API
   */
  public async perform(): Promise<Metadata[]> {
    const dateString = format(this.lastFetched, 'yyyy-MM-dd HH:mm:ss');
    const url = `${serviceConfig.services.dataAcquisition.url}?timestamp=${dateString}`;

    this.lastFetched = new Date();

    // use fake data when debugging
    if (serviceConfig.debug) {
      return this.performFakeRequest();
    }

    return fetch(url)
      .then((res): Promise<Metadata[]> => res.json())
      .catch(() => {
        console.log({ url });
        console.error(
          'Invalid response from media acquisition service. Terminating.\n'
        );

        process.exit(1);
      });
  }

  /**
   * For debugging purposes only, returns data like actual API.
   */
  private async performFakeRequest(): Promise<Metadata[]> {
    const data = require('../data/songs.json');

    return new Promise((resolve) => {
      const result = data.map(
        (s: { id: number; title: string }): Metadata => ({
          Id: s.id,
          Metadata: {
            Title: s.title,
            Artist: s.title,
          },
        })
      );

      resolve(result);
    });
  }
}
