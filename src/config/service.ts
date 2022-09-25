export default {
  /**
   * Debugging mode to enable request logging etc.
   */
  debug: false,

  /**
   * The service binds and listens for connection on this port.
   */
  port: 3000,

  /**
   * Interval of which the metadata is re-fetched, in ms.
   */
  fetchInterval: 15 * 60 * 1000, // every 15 minutes

  /**
   * The external services which the service interacts with.
   */
  services: {
    dataAcquisition: {
      url: 'http://manjaro.stream.stud-srv.sdu.dk/service01/getDeltaUpdates',
    },
  },
};
