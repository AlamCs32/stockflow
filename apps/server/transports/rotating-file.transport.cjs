'use strict';

const { createStream } = require('rotating-file-stream');

function buildFilename(filename) {
  return (time, index) => {
    if (!time) return filename;
    const date = time.toISOString().slice(0, 10);
    return index === 1 ? `${filename}.${date}.log` : `${filename}.${date}.${index}.log`;
  };
}

module.exports = function rotatingFileTransport(options) {
  const { filename, logDir, maxFileSize, maxFiles } = options;

  return createStream(buildFilename(filename), {
    path: logDir,
    size: maxFileSize,
    interval: '1d',
    maxFiles,
    compress: 'gzip',
    immutable: true,
    mode: 0o640,
  });
};
