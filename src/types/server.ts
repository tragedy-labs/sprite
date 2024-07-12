export interface ISpriteCreateArcadeUser {
  /** The username of the database user to create */
  username: string;
  /** The password of the database user to create */
  password: string;
  /**
   * An object containing databases to add the user to, and the
   * permisisions to grant them \
   * (i.e. `{ myDatabase: "ADMIN" }`)
   */
  databases: { [key: string]: string };
}

/** Describes an event on the ArcadeDB server */
export type SpriteArcadeServerEvent = {
  time: string;
  type: string;
  message: string;
};

/** The ArcadeDB Server Events Log */
export type SpriteArcadeServerEvents = {
  /** The list of server events */
  events: SpriteArcadeServerEvent[];
  /** Event log files */
  files: string[];
};

/**
 * The level of detail that should be returned for a
 * `SpriteServer.getInformation()` request
 * @default 'default'
 */
export type ArcadeServerInformationLevel = 'basic' | 'default' | 'cluster';

/**
 * The metadata returned from the server on every operation.
 */
export type ArcadeServerBasicInformation = {
  /** The user who performed the operation */
  user: string;
  /** The version of ArcadeDB on the server */
  version: string;
  /** The name of the server */
  serverName: string;
};

export type ArcadeServerInfoSetting = {
  key: string;
  value: unknown;
  description: string;
  overridden: boolean;
  default: unknown;
};

export type ArcadeServerInfoMetrics = {
  meters: object;
  events: { errors: number; warnings: number; info: number; hints: number };
  profiler: {
    readCacheUsed: object;
    writeCacheUsed: object;
    cacheMax: object;
    pagesRead: object;
    pagesWritten: object;
    pagesReadSize: object;
    pagesWrittenSize: object;
    pageFlushQueueLength: object;
    asyncQueueLength: object;
    asyncParallelLevel: object;
    pageCacheHits: object;
    pageCacheMiss: object;
    totalOpenFiles: object;
    maxOpenFiles: object;
    walPagesWritten: object;
    walBytesWritten: object;
    walTotalFiles: 8;
    concurrentModificationExceptions: object;
    txCommits: object;
    txRollbacks: object;
    createRecord: object;
    readRecord: object;
    updateRecord: object;
    deleteRecord: object;
    queries: object;
    commands: object;
    scanType: object;
    scanBucket: object;
    iterateType: object;
    iterateBucket: object;
    countType: object;
    countBucket: object;
    evictionRuns: object;
    pagesEvicted: object;
    readCachePages: object;
    writeCachePages: object;
    indexCompactions: object;
    diskFreeSpace: object;
    diskTotalSpace: object;
    diskFreeSpacePerc: object;
    gcTime: object;
    ramHeapUsed: object;
    ramHeapMax: object;
    ramHeapAvailablePerc: object;
    ramOsUsed: object;
    ramOsTotal: object;
    cpuLoad: object;
    jvmSafePointTime: object;
    jvmSafePointCount: object;
    jvmAvgSafePointTime: object;
    totalDatabases: object;
    cpuCores: object;
    configuration: object;
  };
};

export type ArcadeServerDefaultInformation = ArcadeServerBasicInformation & {
  metrics: ArcadeServerInfoMetrics;
  settings: ArcadeServerInfoSetting[];
};

export type ArcadeServerClusterInformation = object;

export type ArcadeServerInformation<T extends ArcadeServerInformationLevel> = {
  basic: ArcadeServerBasicInformation;
  default: ArcadeServerDefaultInformation;
  cluster: ArcadeServerClusterInformation;
}[T];
