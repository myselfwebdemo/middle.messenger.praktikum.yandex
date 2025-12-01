import Block from '../core/Block';

export default function renderDOM(block: Block) {
  const root = document.querySelector("#app");

  root!.innerHTML = "";
  root!.appendChild(block.getContent() || new DocumentFragment());
}

export function renderWithQuery(query: string, block: Block) {
  const root = document.querySelector(query);

  root!.innerHTML = "";
  root!.appendChild(block.getContent() || new DocumentFragment());

  block.dispatchComponentDidMount();
  return root;
}
