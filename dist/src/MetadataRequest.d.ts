import { Metadata } from './interfaces/Metadata';
export default class MetadataRequest {
    private lastFetched;
    perform(): Promise<Metadata[]>;
    private performFakeRequest;
}
