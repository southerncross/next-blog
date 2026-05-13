import fs from 'fs';
import path from 'path';
import { fromHtml } from 'hast-util-from-html';
import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

interface Options {
  publicDir?: string;
  colorMap?: Record<string, string> | false;
}

const DEFAULT_PUBLIC_DIR = path.join(process.cwd(), 'public');

export const DEFAULT_COLOR_MAP: Record<string, string> = {
  '#000': 'currentColor',
  '#000000': 'currentColor',
  '#111': 'currentColor',
  '#111111': 'currentColor',
  '#1e1e1e': 'currentColor',
  black: 'currentColor',
  '#fff': 'transparent',
  '#ffffff': 'transparent',
  white: 'transparent',
};

const COLORABLE_ATTRS = ['fill', 'stroke', 'stopColor', 'floodColor'] as const;

function normalizeColor(value: string): string {
  const trimmed = value.trim().toLowerCase();
  const short = trimmed.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
  if (short) {
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
  }
  return trimmed;
}

function buildNormalizedMap(
  raw: Record<string, string>,
): Map<string, string> | null {
  const entries = Object.entries(raw);
  if (entries.length === 0) return null;
  const map = new Map<string, string>();
  for (const [key, value] of entries) {
    map.set(normalizeColor(key), value);
  }
  return map;
}

function rewriteStyleColors(
  style: string,
  normalizedMap: Map<string, string>,
): string {
  return style.replace(
    /(fill|stroke|stop-color|flood-color)\s*:\s*([^;]+)/gi,
    (full, name: string, raw: string) => {
      const replacement = normalizedMap.get(normalizeColor(raw));
      return replacement ? `${name}:${replacement}` : full;
    },
  );
}

function applyColorMap(
  root: Element,
  normalizedMap: Map<string, string>,
): void {
  visit(root, 'element', (child) => {
    const props = child.properties;
    if (!props) return;
    for (const attr of COLORABLE_ATTRS) {
      const value = props[attr];
      if (typeof value !== 'string') continue;
      const replacement = normalizedMap.get(normalizeColor(value));
      if (replacement !== undefined) {
        props[attr] = replacement;
      }
    }
    if (typeof props.style === 'string' && props.style.length > 0) {
      props.style = rewriteStyleColors(props.style, normalizedMap);
    }
  });
}

function stripXmlPreamble(source: string): string {
  return source
    .replace(/^\uFEFF/, '')
    .replace(/<\?xml[^>]*\?>\s*/i, '')
    .replace(/<!DOCTYPE[^>]*>\s*/i, '');
}

function loadSvg(
  absolutePath: string,
  cache: Map<string, Element[] | null>,
  normalizedMap: Map<string, string> | null,
): Element[] | null {
  if (cache.has(absolutePath)) {
    return cache.get(absolutePath) ?? null;
  }

  let raw: string;
  try {
    raw = fs.readFileSync(absolutePath, 'utf8');
  } catch (error) {
    console.warn(
      `[rehype-inline-svg] Failed to read ${absolutePath}:`,
      (error as Error).message,
    );
    cache.set(absolutePath, null);
    return null;
  }

  const tree = fromHtml(stripXmlPreamble(raw), { fragment: true }) as Root;
  const svgNodes = tree.children.filter(
    (node): node is Element =>
      node.type === 'element' && node.tagName === 'svg',
  );

  if (svgNodes.length === 0) {
    cache.set(absolutePath, null);
    return null;
  }

  if (normalizedMap) {
    for (const svg of svgNodes) {
      applyColorMap(svg, normalizedMap);
    }
  }

  cache.set(absolutePath, svgNodes);
  return svgNodes;
}

function mergeAttributes(svg: Element, img: Element): Element {
  const imgProps = img.properties ?? {};
  const svgProps = { ...(svg.properties ?? {}) };

  if (imgProps.className) {
    const existing = Array.isArray(svgProps.className)
      ? svgProps.className
      : svgProps.className
        ? [svgProps.className as string]
        : [];
    const incoming = Array.isArray(imgProps.className)
      ? imgProps.className
      : [imgProps.className as string];
    svgProps.className = [...existing, ...incoming];
  }

  if (imgProps.width != null && svgProps.width == null) {
    svgProps.width = imgProps.width;
  }
  if (imgProps.height != null && svgProps.height == null) {
    svgProps.height = imgProps.height;
  }
  if (imgProps.style) {
    svgProps.style = [svgProps.style, imgProps.style].filter(Boolean).join(';');
  }

  const alt = typeof imgProps.alt === 'string' ? imgProps.alt.trim() : '';
  if (alt) {
    svgProps.role = svgProps.role ?? 'img';
    svgProps['aria-label'] = svgProps['aria-label'] ?? alt;
  } else if (
    svgProps['aria-label'] == null &&
    svgProps['aria-labelledby'] == null
  ) {
    svgProps['aria-hidden'] = svgProps['aria-hidden'] ?? 'true';
  }

  return { ...svg, properties: svgProps };
}

export default function rehypeInlineSvg(options: Options = {}) {
  const publicDir = options.publicDir ?? DEFAULT_PUBLIC_DIR;
  const colorMapOption = options.colorMap;
  const normalizedMap =
    colorMapOption === false
      ? null
      : buildNormalizedMap(colorMapOption ?? DEFAULT_COLOR_MAP);

  const cache = new Map<string, Element[] | null>();

  return function transformer(tree: Root) {
    visit(tree, 'element', (node, index, parent) => {
      if (
        !parent ||
        index == null ||
        node.tagName !== 'img' ||
        !node.properties
      ) {
        return;
      }

      const src = node.properties.src;
      if (typeof src !== 'string') return;
      if (!src.toLowerCase().endsWith('.svg')) return;
      if (!src.startsWith('/')) return;
      if (src.startsWith('//')) return;

      const cleanSrc = src.split('?')[0].split('#')[0];
      const absolutePath = path.join(publicDir, cleanSrc);
      const normalizedPublic = path.resolve(publicDir);
      const normalizedTarget = path.resolve(absolutePath);
      if (!normalizedTarget.startsWith(normalizedPublic + path.sep)) {
        return;
      }

      const svgNodes = loadSvg(normalizedTarget, cache, normalizedMap);
      if (!svgNodes || svgNodes.length === 0) return;

      const merged = svgNodes.map((svg, i) =>
        i === 0 ? mergeAttributes(svg, node) : svg,
      );

      parent.children.splice(index, 1, ...merged);
      return index + merged.length;
    });
  };
}
