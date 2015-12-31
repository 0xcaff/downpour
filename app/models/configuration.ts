import {Serializable, prop} from './serializable';

export class Configuration extends Serializable {
  /////////////// CONNECTION LIMITS
  @prop('max_download_speed') maximumDownloadSpeed: number;
  @prop('max_upload_speed') maximumUploadSpeed: number;
  @prop('max_connections_global') maximumConnections: number;
  @prop('max_connections_per_second') maximumConnectionsPerSecond: number;
  @prop('max_half_open_connections') maximumHalfConnections: number;

  ///// Per-Torrent
  @prop('max_download_speed_per_torrent') maximumDownloadSpeedPerTorrent: number;
  @prop('max_upload_speed_per_torrent') maximumUploadSpeedPerTorrent: number;
  @prop('max_connections_per_torrent') maximumConnectionsPerTorrent: number;

  // When enabled, packets transfered over the local network will not count
  // against deluge's internal bandwith limit.
  @prop('ignore_limits_on_local_network') ignoreLocalNetworkLimits: boolean;

  // When enabled, deluge will only open as many sockets as it can handle
  // instead of killing itself.
  @prop('rate_limit_ip_overhead') ratelimitIPOverhead: boolean;

  /////////////// PROTOCOLS
  @prop('listen_interfaces') listenInterfaces: string;
  @prop('random_port') randomizeIncomingPorts: boolean;
  @prop('listen_ports') incomingPorts: number[];
  @prop('random_outgoing_ports') randomizeOutgoingPorts: boolean;
  @prop('outgoing_ports') outgoingPorts: number[];

  // When enabled, tries to use UPnP to knock open a port making deluge
  // connectable and allowing peers from the outside world to connect without
  // any router configuration if supported by your router.
  @prop upnp: boolean;

  // When enabled, tries to use NAT-PMP to knock open a port, making deluge
  // connectable and allowing peers from the outside world to be able to connect
  // without any router configuration.
  @prop natpmp: boolean;

  // When enabled, uses a protocol similar to DHT to find peers to share data
  // with.
  @prop('utpex') pex: boolean;

  // When enabled, uses a distributed hash table composed of the entire
  // bittorrent network to find peers.
  @prop dht: boolean;

  // When enabled, uses UDP to discover and connect to peers on the local
  // network.
  @prop('lsd') localPeerDiscoveryEnabled: boolean;

  // The type of service byte to use when opening connections to peers. This can
  // be used to filter traffic.
  @prop('peer_tos') tosByte: string;

  ///// Encryption
  @prop('enc_in_policy') inboundEncryptionPolicy: EncryptionPolicy;
  @prop('enc_out_policy') outgoingEncryptionPolicy: EncryptionPolicy;
  @prop('enc_level') encryptionLevel: EncryptionLevel;
  @prop('enc_prefer_rc4') encryptEntireStream: boolean;

  /////////////// AUTOMANAGER

  // The default value for whether torrents are automanaged.
  @prop('auto_managed') autoManaged: boolean;

  @prop('max_active_limit') maximumActiveTorrents: number;
  @prop('max_active_downloading') maximumDownloadingTorrents: number;
  @prop('max_active_seeding') maximumSeedingTorrents: number;
  @prop('max_upload_slots_global') maximumUploadSlots: number;
  @prop('max_upload_slots_per_torrent') maximumUploadSlotsPerTorrent: number;
  @prop('dont_count_slow_torrents') ignoreSlowTorrents: boolean;

  // After a torrent has reaches the specified ratio, the torrent will be
  // queued.
  @prop('share_ratio_limit') shareRatioLimit: number;

  // Similar to share_ratio_limit, except instead of queuing the torrent, it is
  // now paused. This option is only active if stop_seed_at_ratio is true. Also,
  // if remove_seed_at_ratio is true, the torrent will be removed instead of
  // paused.
  @prop('stop_seed_ratio') seedRatio: number;
  @prop('stop_seed_at_ratio') stopSeedAtRatio: boolean;
  @prop('remove_seed_at_ratio') removeSeedAtRatio: boolean;

  // After a torrent is seeded for the specified number of minutes, the torrent
  // will be queued.
  @prop('seed_time_limit') seedTimeLimit: number;

  // This is similar to stop_seed_ratio, but instead of the ratio being made up
  // of the ratio between the bytes uploaded and downloaded, the ratio is made
  // up of the time the torrent has been in the uploading and downloading
  // state. When the ratio is reached, the torrent is paused.
  @prop('seed_time_ratio_limit') seedTimeRatioLimit: number;

  // When enabled, new torrents are added to the top of the queue instead of the
  // bottom of it.
  @prop('queue_new_to_top') queueNewToTop: boolean;

  // By default, new torrents are added in the downloading state or seeding
  // state depending on whether the files are available in the download
  // directory. Enabling this option will cause all torrents to be added in the
  // paused state.
  @prop('add_paused') addPaused: boolean;

  /////////////// STORAGE

  // When adding torrents, a copy of all .torrent files are placed in this
  // directory if copy_torrent_file is enabled. If del_copy_torrent_file is
  // enabled, after the download for that file is completed, the copy is
  // removed.
  @prop('torrentfiles_location') torrentFilesLocation: string;
  @prop('copy_torrent_file') copyTorrentFile: boolean;
  @prop('del_copy_torrent_file') deleteCopyTorrentFile: boolean;

  // Deluge watches this directory and when files are placed into it, if
  // autoadd_enable is true, deluge tries importing them.
  @prop('autoadd_location') autoaddPath: string;
  @prop('autoadd_enable') autoadd: boolean;

  // Location on the server where the downloaded content is to be stored.
  @prop('download_location') downloadLocation: string;

  // Location on the server of which a downloaded torrent's contents are moved
  // to when complete if move_completed is enabled.
  @prop('move_completed_path') moveCompletedPath: string;
  @prop('move_completed') moveCompleted: boolean;

  // When enabled, deluge will only use as much disk space as it needs to store
  // the pieces downloaded. If disabled, full allocation is used which allocates
  // the disk space needed to store the entire torrent.
  @prop('compact_allocation') compactAllocation: boolean;

  @prop('prioritize_first_last_pieces') sequentialDownload: boolean;

  // The amount of time before the cache expires in seconds.
  @prop('cache_exiry') cacheExpiry: number;

  // The cache is used to speed up disk reads and and writes by storing
  // frequently accessed data in the RAM. The cache size is the amount of RAM
  // deluge will use as a cache. The cache size equal to this value times 16
  // kilobytes.
  @prop('cache_size') cacheSize: number;

  /////////////// MISC

  @prop('daemon_port') daemonPort: number;
  @prop('geoip_db_location') geoIPDatabsePath: string;
  @prop('enabled_plugins') plugins: string[];
  @prop('plugins_location') pluginsDirectory: string;

  // When enabled, the deluge daemon running on the server will allow other
  // clients on the local network to access it.
  @prop('allow_remote') daemonRemoteConnections: boolean;

  // The last time that analytics were sent to a deluge's servers. The default
  // client sends analytics every two weeks.
  @prop('info_sent') lastAnalyticsUpdate: number;
  @prop('send_info') analyticsEnabled: boolean;
  @prop('new_release_check') checkRelease: boolean;
}

export enum EncryptionPolicy {
  Forced,
  Enabled,
  Disabled,
}

export enum EncryptionLevel {
  Handshake,
  FullStream,
  Both,
}

// TODO: Add Proxy Configuration Support
export class Proxy extends Serializable {
  @prop username: string;
  @prop password: string;

  @prop hostname: string;
  @prop port: number;
  @prop('type') kind: ProxyType;
}

export enum ProxyType {
  None,
  Socks4,
  Socks5,
  AuthenticatedSocks5,
  HTTP,
  AuthenticatedHTTP,
}

