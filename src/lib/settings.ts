/** Shared settings shape for the global "network" simulator. */
export type Settings = {
  /** Artificial latency added to every fake-API call, in ms. */
  latency: number;
  /** Probability (0-1) that a mutation fails. Used to demo rollbacks. */
  failRate: number;
};

export const defaultSettings: Settings = { latency: 1000, failRate: 0 };
