import {Serializable, prop} from './serializable.js';

export class Configuration extends Serializable {
  /////////////// CONNECTIONS
  ///// Limits
  @prop('max_download_speed') maximumDownloadSpeed: number;
  @prop('max_half_open_connections') maximumHalfConnections: number;
  @prop('max_upload_speed') maximumUploadSpeed: number;
  @prop('max_connections_global') maximumConnections: number;
  @prop('max_download_speed_per_torrent') maximumDownloadSpeedPerTorrent: number;
  @prop('max_upload_speed_per_torrent') maximumUploadSpeedPerTorrent: number;
  @prop('max_connections_per_second') maximumConnectionsPerSecond: number;
  @prop('max_connections_per_torrent') maximumConnectionsPerTorrent: number;

  // When enabled, packets transfered over the local network will not count
  // against deluge's internal bandwith limit.
  @prop('ignore_limits_on_local_network') ignoreLocalNetworkLimits: boolean;

  // When enabled, deluge will only open as many sockets as it can handle
  // instead of killing itself.
  @prop('rate_limit_ip_overhead') ratelimitIPOverhead: boolean;

  ///// Protocols
  @prop('listen_interfaces') listenInterfaces: string;
  @prop('random_outgoing_ports') randomizeOutgoingPorts: boolean;
  @prop('random_port') randomPort: boolean;
  @prop('listen_ports') listenPorts: number[];
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

  // TODO: @prop('proxies')

  ///// Encryption
  @prop('enc_in_policy') inboundEncryptionPolicy: EncryptionPolicy;
  @prop('enc_level') encryptionLevel: EncryptionPolicy;
  @prop('enc_out_policy') outgoingEncryptionPolicy: EncryptionPolicy;
  // TODO: @prop('enc_prefer_rc4') WTF!?

  /////////////// TORRENTS
  ///// AutoManager
  @prop('max_active_limit') maximumActiveTorrents: number;
  @prop('max_active_downloading') maximumDownloadingTorrents: number;
  @prop('max_active_seeding') maximumSeedingTorrents: number;
  @prop('max_upload_slots_global') maximumUploadSlots: number;
  @prop('max_upload_slots_per_torrent') maximumUploadSlotsPerTorrent: number;
  @prop('auto_managed') autoManaged: boolean;
  @prop('stop_seed_at_ratio') stopSeedAtRatio: boolean;
  @prop('stop_seed_ratio') seedRatio: number;
  @prop('seed_time_ratio_limit') seedTimeRatioLimit: number;
  @prop('prioritize_first_last_pieces') sequentialDownload: boolean;
  @prop('share_ratio_limit') shareRatioLimit: number;
  @prop('seed_time_limit') seedTimeLimit: number;
  @prop('remove_seed_at_ratio') removeSeedAtRatio: boolean;
  @prop('dont_count_slow_torrents') ignoreSlowTorrents: boolean;
  // TODO: @prop('del_copy_torrent_file') 
  // TODO: @prop('queue_new_to_top')

  ///// Storage
  @prop('torrentfiles_location') torrentFilesLocation: string;

  // Location on the server of which to store a copy of all torrent files.
  @prop('download_location') downloadLocation: string;

  // Location on the server of which a downloaded torrent's contents are moved
  // to when complete.
  @prop('move_completed_path') moveCompletedTorrents: string;

  // When enabled, deluge will only use as much disk space as it needs to store
  // the pieces downloaded. If disabled, full allocation is used which allocates
  // the disk space needed to store the entire torrent.
  @prop('compact_allocation') compactAllocation: boolean;

  @prop('copy_torrent_file') copyTorrentFile: boolean;
  @prop('move_completed') moveCompleted: boolean;
  @prop('autoadd_enable') autoadd: boolean;
  @prop('add_paused') addPaused: boolean;
  @prop('autoadd_location') autoaddPath: string;

  /////////////// MISC
  @prop('daemon_port') daemonPort: number;
  @prop('geoip_db_location') geoIPDatabsePath: string;
  @prop('enabled_plugins') plugins: string[];
  @prop('plugins_location') pluginsDirectory: string;

  // The amount of time before the cache expires in seconds.
  @prop('cache_exiry') cacheExpiry: number;

  @prop('cache_size') cacheSize: number;

  // When enabled, the deluge daemon running on the server will allow other
  // clients on the local network to access it.
  @prop('allow_remote') daemonRemoteConnections: boolean;

  /////////////// ABOUT

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

