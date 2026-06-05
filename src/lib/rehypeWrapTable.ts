import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

export default function rehypeWrapTable() {
  return function transformer(tree: Root) {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null || node.tagName !== 'table') {
        return;
      }

      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrapper'] },
        children: [node],
      };

      parent.children.splice(index, 1, wrapper);
      return index + 1;
    });
  };
}
