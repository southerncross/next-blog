import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: 'github-dark-dimmed',
      defaultLang: 'ansi',
    })
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
