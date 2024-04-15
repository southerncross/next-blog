import { h } from 'hastscript';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: 'github-dark-dimmed',
      defaultLang: 'ansi',
    })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { content: () => h('span.mr-2', '#') })
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
