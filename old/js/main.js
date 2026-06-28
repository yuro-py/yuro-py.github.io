import {initPanels} from './panels.js';
import {createWorkstation} from './scene.js';

initPanels();

const canvas=document.getElementById('scene-canvas');
const desktop=window.matchMedia('(min-width: 768px)');
let workstation=null;

function syncScene(event=desktop){
  if(event.matches&&!workstation&&window.THREE){
    workstation=createWorkstation(canvas);
  }
  if(!event.matches&&workstation){
    workstation.dispose();
    workstation=null;
  }
}

desktop.addEventListener('change',syncScene);
syncScene();
