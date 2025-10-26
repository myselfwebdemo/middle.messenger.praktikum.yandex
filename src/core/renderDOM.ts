import Block from '../core/block';


export default function renderDOM(block: Block) {
  const root = document.querySelector("#app");

  root!.innerHTML = "";
//   @ts-ignore
root!.appendChild(block.getContent());
}

//   @ts-ignore
export function render(query, block) {
  const root = document.querySelector(query);

  root.appendChild(block.getContent());

  block.dispatchComponentDidMount();

  return root;
}
