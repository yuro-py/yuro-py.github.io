const SECTION_FILES={
  projects:'./content/projects.json',
  tech:'./content/tech.json',
  writings:'./content/writings.json'
};

export const SECTION_LABELS={
  projects:'Projects',
  tech:'Tech',
  writings:'Writings'
};

const cache=new Map();

export async function loadSection(section){
  if(!SECTION_FILES[section])throw new Error(`Unknown section: ${section}`);
  if(cache.has(section))return cache.get(section);
  const res=await fetch(SECTION_FILES[section],{cache:'no-cache'});
  if(!res.ok)throw new Error(`Unable to load ${SECTION_FILES[section]}`);
  const data=await res.json();
  const items=data.map(item=>normalizeItem(section,item));
  cache.set(section,items);
  return items;
}

export async function loadAllSections(){
  const entries=await Promise.all(Object.keys(SECTION_FILES).map(async section=>[section,await loadSection(section)]));
  return Object.fromEntries(entries);
}

function normalizeItem(section,item){
  return {
    id:item.id,
    section,
    label:item.label||SECTION_LABELS[section],
    title:item.title,
    summary:item.summary||item.sub||'',
    tags:Array.isArray(item.tags)?item.tags:[],
    post:item.post,
    links:Array.isArray(item.links)?item.links:[],
    date:item.date||''
  };
}
