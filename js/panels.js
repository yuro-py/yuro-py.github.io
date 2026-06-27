import {SECTION_LABELS,loadSection} from './content-loader.js';
import {loadMarkdown,renderMarkdown} from './markdown.js';

export function initPanels(){
  const overlay=document.getElementById('tablet-overlay');
  const title=document.getElementById('tablet-title');
  const context=document.getElementById('tablet-context');
  const body=document.getElementById('tablet-body');
  const status=document.getElementById('tablet-status');
  const back=document.getElementById('tablet-back');
  const close=document.getElementById('tablet-close');
  const navButtons=[...document.querySelectorAll('.nav-btn')];
  let activeSection='projects';

  navButtons.forEach(button=>{
    button.addEventListener('click',()=>openSection(button.dataset.section));
  });

  close.addEventListener('click',closePanel);
  back.addEventListener('click',()=>openSection(activeSection));
  overlay.addEventListener('click',event=>{if(event.target===overlay)closePanel();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closePanel();});

  initMobile();

  async function openSection(section){
    activeSection=section;
    title.textContent=SECTION_LABELS[section];
    context.textContent='archive';
    back.classList.add('hidden');
    setActiveNav(section);
    openOverlay();
    setStatus('Loading records...');
    body.innerHTML='';
    try{
      const items=await loadSection(section);
      body.appendChild(renderCards(items));
      setStatus('');
    }catch(error){
      setStatus(error.message);
    }
  }

  async function openItem(item){
    activeSection=item.section;
    title.textContent=item.title;
    context.textContent=item.label;
    back.classList.remove('hidden');
    openOverlay();
    setStatus('Loading document...');
    body.innerHTML='';
    const article=document.createElement('article');
    article.className='markdown';
    body.appendChild(renderArticleLinks(item));
    body.appendChild(article);
    try{
      const markdown=await loadMarkdown(item.post);
      renderMarkdown(markdown,article);
      setStatus('');
    }catch(error){
      setStatus(error.message);
    }
  }

  function renderCards(items){
    const list=document.createElement('div');
    list.className='card-list';
    items.forEach(item=>{
      const card=document.createElement('button');
      card.className='entry-card';
      card.type='button';
      card.append(
        element('div','entry-label',item.label),
        element('h3','entry-title',item.title),
        element('p','entry-summary',item.summary),
        renderTags(item.tags)
      );
      card.addEventListener('click',()=>openItem(item));
      list.appendChild(card);
    });
    return list;
  }

  function renderArticleLinks(item){
    const links=document.createElement('div');
    links.className='article-meta';
    item.links.forEach(link=>{
      const a=document.createElement('a');
      a.className='article-link';
      a.href=link.url;
      a.target='_blank';
      a.rel='noreferrer';
      a.textContent=link.label;
      links.appendChild(a);
    });
    return links;
  }

  function renderTags(tags){
    const wrap=document.createElement('div');
    wrap.className='entry-tags';
    tags.forEach(tag=>wrap.appendChild(element('span','entry-tag',tag)));
    return wrap;
  }

  function openOverlay(){
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
  }

  function closePanel(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    navButtons.forEach(button=>button.classList.remove('active'));
  }

  function setActiveNav(section){
    navButtons.forEach(button=>button.classList.toggle('active',button.dataset.section===section));
  }

  function setStatus(message){
    status.textContent=message;
  }

  function initMobile(){
    document.querySelectorAll('[data-mobile-section]').forEach(sectionNode=>{
      const section=sectionNode.dataset.mobileSection;
      const button=sectionNode.querySelector('.m-sect-header');
      const bodyNode=sectionNode.querySelector('.m-sect-body');
      button.addEventListener('click',async()=>{
        const isOpen=sectionNode.classList.contains('open');
        document.querySelectorAll('.m-section.open').forEach(node=>node.classList.remove('open'));
        if(isOpen)return;
        sectionNode.classList.add('open');
        if(bodyNode.dataset.loaded)return;
        bodyNode.textContent='Loading...';
        try{
          const items=await loadSection(section);
          bodyNode.innerHTML='';
          items.forEach(item=>bodyNode.appendChild(renderMobileCard(item)));
          bodyNode.dataset.loaded='true';
        }catch(error){
          bodyNode.textContent=error.message;
        }
      });
    });
  }

  function renderMobileCard(item){
    const card=document.createElement('button');
    card.className='m-entry';
    card.type='button';
    card.append(
      element('div','m-e-title',item.title),
      element('div','m-e-sub',item.summary),
      renderMobileTags(item.tags)
    );
    card.addEventListener('click',()=>openItem(item));
    return card;
  }

  function renderMobileTags(tags){
    const wrap=document.createElement('div');
    wrap.className='m-e-tags';
    tags.forEach(tag=>wrap.appendChild(element('span','m-e-tag',tag)));
    return wrap;
  }
}

function element(tag,className,text){
  const node=document.createElement(tag);
  node.className=className;
  node.textContent=text;
  return node;
}
