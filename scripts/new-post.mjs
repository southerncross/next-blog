#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, '..', '_posts');
const LOCALES = ['zh', 'en'];
const DEFAULT_LOCALE = 'zh';

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) {
        args[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith('--')) {
          args[a.slice(2)] = next;
          i++;
        } else {
          args[a.slice(2)] = true;
        }
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"`’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isoDateCST(d = new Date()) {
  const shifted = new Date(d.getTime() + 8 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}` +
    `T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}+08:00`
  );
}

function escapeYamlSingle(str) {
  return String(str).replace(/'/g, "''");
}

function buildFrontMatter({ title, date, description, topics }) {
  const topicsYaml = topics.length
    ? `[${topics.map((t) => `'${escapeYamlSingle(t)}'`).join(', ')}]`
    : '[]';
  return [
    '---',
    `title: '${escapeYamlSingle(title)}'`,
    `date: '${date}'`,
    `description: '${escapeYamlSingle(description)}'`,
    `topics: ${topicsYaml}`,
    '---',
    '',
    '',
  ].join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    console.log(`Usage: pnpm new-post [slug] [options]

Options:
  --slug <slug>              File slug (kebab-case)
  --title <title>            Post title
  --description <desc>       Post description (used as excerpt + SEO)
  --topics <a,b,c>           Comma-separated topics
  --locale <zh|en>           Locale (default: zh -> slug.md; en -> slug.en.md)
  --date <ISO>               Override date (default: now, +08:00)
  --force                    Overwrite if file exists
  -h, --help                 Show this help

Any omitted required field will be prompted interactively.`);
    return;
  }

  const rl = readline.createInterface({ input, output });
  const ask = async (q, def) => {
    const suffix = def !== undefined && def !== '' ? ` (${def})` : '';
    const a = (await rl.question(`${q}${suffix}: `)).trim();
    return a === '' && def !== undefined ? def : a;
  };

  try {
    let title = args.title ?? '';
    while (!title) title = await ask('Title');

    let slug = args.slug ?? args._[0] ?? '';
    if (!slug) {
      const suggested = slugify(title);
      slug = await ask('Slug', suggested);
      if (!slug) slug = suggested;
    }
    slug = slugify(slug);
    if (!slug) {
      console.error('Error: slug is empty after normalization.');
      process.exitCode = 1;
      return;
    }

    let locale = args.locale ?? DEFAULT_LOCALE;
    if (!LOCALES.includes(locale)) {
      console.error(
        `Error: unsupported locale '${locale}'. Use one of: ${LOCALES.join(', ')}`,
      );
      process.exitCode = 1;
      return;
    }

    let description = args.description ?? '';
    if (!description) description = await ask('Description', '');

    let topicsRaw = args.topics;
    if (topicsRaw === undefined)
      topicsRaw = await ask('Topics (comma-separated)', '');
    const topics = String(topicsRaw)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const date = args.date ?? isoDateCST();

    const filename =
      locale === DEFAULT_LOCALE ? `${slug}.md` : `${slug}.${locale}.md`;
    const filepath = path.join(POSTS_DIR, filename);

    if (fs.existsSync(filepath) && !args.force) {
      console.error(
        `Error: ${path.relative(process.cwd(), filepath)} already exists. Use --force to overwrite.`,
      );
      process.exitCode = 1;
      return;
    }

    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

    const frontMatter = buildFrontMatter({ title, date, description, topics });
    fs.writeFileSync(filepath, frontMatter, 'utf8');

    console.log(`Created ${path.relative(process.cwd(), filepath)}`);
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
