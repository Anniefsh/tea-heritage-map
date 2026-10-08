const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/tea_heritage.json'), 'utf8'));

// Exercise the pure HTML renderers without requiring a browser or DOM.
function readFunction(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const end = source.indexOf('\nfunction ', start + 1);
  return source.slice(start, end === -1 ? undefined : end);
}

const context = vm.createContext({ detailCopy: (key) => key });
vm.runInContext(
  ['escapeHtml', 'getPrimaryImage', 'renderDetailImageBlock'].map(readFunction).join('\n'),
  context
);
const render = (item) => context.renderDetailImageBlock(item);

test('projects without images produce no empty media panel', () => {
  assert.equal(render({ images: [], notes: 'legacy collection notes' }), '');
});

test('legacy video-only records never expose a video link or placeholder', () => {
  assert.equal(render({
    images: [], videoUrl: 'https://example.org/video',
    videos: [{ url: 'https://example.org/video' }], mediaStatus: 'video-only'
  }), '');
});

test('image records keep captions and credits without duplicating the footer source link', () => {
  const html = render({
    name: 'Example',
    images: [{ url: 'https://example.org/image.jpg', caption: 'Example image', source: 'Museum' }],
    sourceUrl: 'https://example.org/project',
    videoUrl: 'https://example.org/video', mediaStatus: 'mixed'
  });
  assert.match(html, /image\.jpg/);
  assert.match(html, /Example image/);
  assert.match(html, /Museum/);
  assert.doesNotMatch(html, /<a\b/);
  assert.doesNotMatch(html, /video|is-empty|mediaStatus/);
});

test('image captions and URLs are escaped', () => {
  const html = render({
    name: 'Example',
    images: [{ url: 'https://example.org/image.jpg?x="', caption: '<img onerror="alert(1)">' }]
  });
  assert.match(html, /&lt;img onerror=&quot;alert\(1\)&quot;&gt;/);
  assert.match(html, /\?x=&quot;/);
  assert.equal((html.match(/<img /g) || []).length, 1);
});

test('all current projects omit unavailable image panels', () => {
  assert.equal(data.items.length, 46);
  for (const item of data.items) {
    if (!(item.images?.length || item.imageUrl)) assert.equal(render(item), '', item.id);
  }
});

test('detail page uses the image-only renderer and has no video UI strings', () => {
  assert.match(source, /renderDetailImageBlock\(selected\)/);
  assert.doesNotMatch(source, /renderDetailMediaBlock|watchVideo|detailVideo|video-link|mediaBadge/);
});
