export type DiscoveredKeyword = {
  keyword: string;
  searchVolume: number | null;
  competition: string | null;
  /** Relative growth: positive = rising search interest */
  trendScore: number;
};
