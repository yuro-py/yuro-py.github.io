export async function loadMarkdown(path){
  const res=await fetch(path,{cache:'no-cache'});
  if(!res.ok)throw new Error(`Unable to load ${path}`);
  return res.text();
}

export function renderMarkdown(markdown,target){
  const prepared=expandEmbeds(markdown);
  const html=window.marked.parse(prepared,{gfm:true,breaks:false});
  target.innerHTML=window.DOMPurify.sanitize(html,{
    ADD_ATTR:['target','rel','class'],
    ADD_TAGS:['iframe']
  });
  decorateLinks(target);
  highlightCode(target);
  renderEquations(target);
}

function expandEmbeds(markdown){
  return markdown.replace(/^::github\s+(https:\/\/github\.com\/[^\s]+)\s*$/gm,(_,url)=>{
    const label=url.replace('https://github.com/','');
    return `<a class="github-embed" href="${url}" target="_blank" rel="noreferrer"><strong>${label}</strong><span>GitHub repository / profile reference</span></a>`;
  });
}

function decorateLinks(root){
  root.querySelectorAll('a[href]').forEach(link=>{
    const href=link.getAttribute('href');
    if(/^https?:\/\//.test(href)){
      link.target='_blank';
      link.rel='noreferrer';
    }
    if(/\.pdf($|\?)/i.test(href))link.classList.add('pdf-link');
  });
}

function highlightCode(root){
  if(!window.hljs)return;
  root.querySelectorAll('pre code').forEach(block=>window.hljs.highlightElement(block));
}

function renderEquations(root){
  if(!window.renderMathInElement)return;
  window.renderMathInElement(root,{
    delimiters:[
      {left:'$$',right:'$$',display:true},
      {left:'$',right:'$',display:false},
      {left:'\\(',right:'\\)',display:false},
      {left:'\\[',right:'\\]',display:true}
    ],
    throwOnError:false
  });
}
