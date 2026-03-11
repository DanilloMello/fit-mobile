/**
 * Minimal zlib shim for React Native / New Architecture.
 * Provides only the constants that axios's http adapter reads at module load
 * time. Actual compression is never invoked because axios uses the XHR
 * adapter on React Native — this shim prevents the
 * "Cannot read property 'Z_SYNC_FLUSH' of undefined" crash.
 */
'use strict';

// zlib flush constants
exports.Z_NO_FLUSH = 0;
exports.Z_PARTIAL_FLUSH = 1;
exports.Z_SYNC_FLUSH = 2;
exports.Z_FULL_FLUSH = 3;
exports.Z_FINISH = 4;
exports.Z_BLOCK = 5;
exports.Z_TREES = 6;

// zlib return codes
exports.Z_OK = 0;
exports.Z_STREAM_END = 1;
exports.Z_NEED_DICT = 2;
exports.Z_ERRNO = -1;
exports.Z_STREAM_ERROR = -2;
exports.Z_DATA_ERROR = -3;
exports.Z_MEM_ERROR = -4;
exports.Z_BUF_ERROR = -5;
exports.Z_VERSION_ERROR = -6;

// compression levels
exports.Z_NO_COMPRESSION = 0;
exports.Z_BEST_SPEED = 1;
exports.Z_BEST_COMPRESSION = 9;
exports.Z_DEFAULT_COMPRESSION = -1;

// compression strategies
exports.Z_FILTERED = 1;
exports.Z_HUFFMAN_ONLY = 2;
exports.Z_RLE = 3;
exports.Z_FIXED = 4;
exports.Z_DEFAULT_STRATEGY = 0;

// data types
exports.Z_BINARY = 0;
exports.Z_TEXT = 1;
exports.Z_ASCII = 1;
exports.Z_UNKNOWN = 2;
exports.Z_DEFLATED = 8;

// Stub transform streams — axios http adapter never runs on React Native
// (xhr adapter is selected), but the module must be require()-able.
function noop() {}
function ZlibStream() {}
ZlibStream.prototype.pipe = noop;
ZlibStream.prototype.on = noop;
ZlibStream.prototype.write = noop;
ZlibStream.prototype.end = noop;

exports.Deflate = ZlibStream;
exports.Inflate = ZlibStream;
exports.Gzip = ZlibStream;
exports.Gunzip = ZlibStream;
exports.DeflateRaw = ZlibStream;
exports.InflateRaw = ZlibStream;
exports.Unzip = ZlibStream;

exports.createDeflate = function () { return new ZlibStream(); };
exports.createInflate = function () { return new ZlibStream(); };
exports.createGzip = function () { return new ZlibStream(); };
exports.createGunzip = function () { return new ZlibStream(); };
exports.createDeflateRaw = function () { return new ZlibStream(); };
exports.createInflateRaw = function () { return new ZlibStream(); };
exports.createUnzip = function () { return new ZlibStream(); };

exports.deflate = noop;
exports.deflateSync = noop;
exports.inflate = noop;
exports.inflateSync = noop;
exports.gzip = noop;
exports.gzipSync = noop;
exports.gunzip = noop;
exports.gunzipSync = noop;
exports.deflateRaw = noop;
exports.deflateRawSync = noop;
exports.inflateRaw = noop;
exports.inflateRawSync = noop;
exports.unzip = noop;
exports.unzipSync = noop;
