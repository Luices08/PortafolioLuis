const slugifyLib = require('slugify');

function toSlug(text) {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

module.exports = toSlug;
