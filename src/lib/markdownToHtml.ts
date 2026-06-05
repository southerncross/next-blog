import { h } from 'hastscript';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeInlineSvg from './rehypeInlineSvg';
import rehypeWrapTable from './rehypeWrapTable';

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeInlineSvg)
    .use(rehypeWrapTable)
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
