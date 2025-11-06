// @ts-ignore
import Block from '../core/Block';


export default function renderDOM(block: Block) {
  const root = document.querySelector("#app");

  root!.innerHTML = "";
  // @ts-ignore
  root!.appendChild(block.getContent());
}

// @ts-ignore
export function renderWithQuery(query, block) {
  const root = document.querySelector(query);

  root!.innerHTML = "";
  root!.appendChild(block.getContent());

  block.dispatchComponentDidMount();
  return root;
}
