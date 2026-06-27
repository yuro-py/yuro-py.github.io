import {CinematicCameraControls} from './camera.js';
import {createLighting} from './lighting.js';

export function createWorkstation(canvas){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.35));
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setClearColor(0x020304);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.86;

  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x030506,.015);
  const camera=new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,.1,130);
  const controls=new CinematicCameraControls(camera,canvas);
  const lights=createLighting(scene);
  const model=new CommandCenter(scene,lights);
  const clock=new THREE.Clock();
  let frame=0;

  function animate(){
    frame=requestAnimationFrame(animate);
    const dt=Math.min(clock.getDelta(),.033);
    const time=clock.elapsedTime;
    controls.update(dt);
    model.update(time,dt);
    renderer.render(scene,camera);
  }

  function resize(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  }

  window.addEventListener('resize',resize);
  animate();

  return {
    dispose(){
      cancelAnimationFrame(frame);
      window.removeEventListener('resize',resize);
      renderer.dispose();
    }
  };
}

class CommandCenter{
  constructor(scene,lights){
    this.scene=scene;
    this.lights=lights;
    this.root=new THREE.Group();
    this.scene.add(this.root);
    this.materials=createMaterials();
    this.screenMaterials=[];
    this.motion=[];
    this.build();
  }

  build(){
    this.buildShell();
    this.buildDisplay();
    this.buildConsoleDeck();
    this.buildLift();
    this.buildWalkways();
    this.buildSideMachinery();
    this.buildCableRuns();
    this.buildHolograms();
    this.buildAtmosphere();
  }

  buildShell(){
    const m=this.materials;
    box(this.root,[74,1.1,46],[0,-7.2,0],m.concrete,true);
    box(this.root,[70,.22,38],[0,-6.55,-1],m.brushed,false);
    box(this.root,[76,22,1.4],[0,3.5,-25.5],m.concrete,false);
    box(this.root,[1.2,20,44],[-34,2.5,-1],m.concrete,false);
    box(this.root,[1.2,20,44],[34,2.5,-1],m.concrete,false);
    box(this.root,[76,1.4,46],[0,15.5,-1],m.ceiling,false);

    for(const x of [-29,29]){
      for(const z of [-20,9]){
        box(this.root,[2.9,19,3.4],[x,1.7,z],m.column,true);
        box(this.root,[4.2,.55,4.8],[x,-6.35,z],m.brushed,false);
      }
    }

    for(const z of [-21,-13,-5,3,11]){
      box(this.root,[64,.28,.34],[0,12.9,z],m.beam,false);
      box(this.root,[58,.18,.22],[0,11.7,z+.7],m.cableTray,false);
    }

    for(const x of [-21,-14,-7,7,14,21]){
      box(this.root,[4.6,.05,17],[x,-6.31,6],m.floorChannel,false);
    }

    this.addVents(-23,-6.22,-16,0);
    this.addVents(23,-6.22,-16,0);
    this.addWallVents(-31,0,-12,Math.PI/2);
    this.addWallVents(31,0,-12,-Math.PI/2);
  }

  addVents(x,y,z,rot){
    const group=new THREE.Group();
    group.position.set(x,y,z);
    group.rotation.y=rot;
    this.root.add(group);
    box(group,[7,.06,3.4],[0,0,0],this.materials.vent,false);
    for(let i=-3;i<=3;i++)box(group,[6.4,.07,.08],[0,.04,i*.42],this.materials.rubber,false);
  }

  addWallVents(x,y,z,rot){
    const group=new THREE.Group();
    group.position.set(x,y,z);
    group.rotation.y=rot;
    this.root.add(group);
    box(group,[.12,4.2,8],[0,0,0],this.materials.vent,false);
    for(let i=-4;i<=4;i++)box(group,[.16,.09,6.8],[0,i*.42,0],this.materials.rubber,false);
  }

  buildDisplay(){
    const display=new THREE.Group();
    display.position.set(0,1.2,-22.55);
    this.root.add(display);
    box(display,[31,.45,.8],[0,6.15,.1],this.materials.beam,false);
    box(display,[33,.32,.7],[0,1.05,.16],this.materials.beam,false);
    box(display,[26,.22,.42],[0,3.42,-.22],this.materials.carbon,false);

    const screens=[
      {name:'left-secondary',x:-13.1,y:4.45,z:.9,w:4.7,h:2.45,ry:.47,kind:'telemetry'},
      {name:'left-main',x:-7.15,y:3.75,z:.38,w:6.1,h:3.65,ry:.25,kind:'map'},
      {name:'center-main',x:0,y:3.9,z:.18,w:10.8,h:4.85,ry:0,kind:'command'},
      {name:'right-main',x:7.15,y:3.75,z:.38,w:6.1,h:3.65,ry:-.25,kind:'research'},
      {name:'right-secondary',x:13.1,y:4.45,z:.9,w:4.7,h:2.45,ry:-.47,kind:'diagnostic'},
      {name:'lower-left',x:-4.4,y:1.25,z:.65,w:4.1,h:1.35,ry:.08,kind:'console'},
      {name:'lower-right',x:4.4,y:1.25,z:.65,w:4.1,h:1.35,ry:-.08,kind:'console'}
    ];
    screens.forEach((spec,index)=>this.addScreen(display,spec,index));

    for(const x of [-16.6,16.6]){
      box(display,[2.4,4.7,.7],[x,3.2,.25],this.materials.brushed,false);
      box(display,[1.9,.14,.18],[x,5.2,.72],this.materials.subtleBlue,false);
      box(display,[1.9,.14,.18],[x,1.3,.72],this.materials.subtleBlue,false);
    }
  }

  addScreen(parent,spec,index){
    const frame=new THREE.Group();
    frame.position.set(spec.x,spec.y,spec.z);
    frame.rotation.y=spec.ry;
    parent.add(frame);
    box(frame,[spec.w+.34,spec.h+.34,.26],[0,0,-.08],this.materials.blackMetal,false);
    box(frame,[spec.w+.08,spec.h+.08,.16],[0,0,.03],this.materials.rubber,false);
    const material=new THREE.MeshStandardMaterial({
      map:createScreenTexture(spec.kind,index),
      color:0xbddff6,
      emissive:0x4f9fd0,
      emissiveIntensity:spec.kind==='command'?1.1:.72,
      roughness:.18,
      metalness:0
    });
    const screen=new THREE.Mesh(new THREE.PlaneGeometry(spec.w,spec.h),material);
    screen.position.z=.13;
    frame.add(screen);
    this.screenMaterials.push({material,base:material.emissiveIntensity,phase:index*.73});
  }

  buildConsoleDeck(){
    const deck=new THREE.Group();
    deck.position.set(0,-5.7,-10.9);
    this.root.add(deck);
    box(deck,[19,.75,3.2],[0,0,0],this.materials.blackMetal,true);
    box(deck,[17.8,.24,2.7],[0,.5,-.18],this.materials.carbon,false);
    box(deck,[8.4,.2,1.4],[-5.4,.78,-.85],this.materials.screenDim,false,[-.2,0,0]);
    box(deck,[8.4,.2,1.4],[5.4,.78,-.85],this.materials.screenDim,false,[-.2,0,0]);
    box(deck,[5.2,.18,1.1],[0,.82,-.92],this.materials.glass,false,[-.24,0,0]);
    for(let i=-8;i<=8;i++)box(deck,[.32,.06,.2],[i*.78,.92,.82],i%4===0?this.materials.serviceLight:this.materials.button,false);

    this.addAngledConsole(-13.2,-8.6,.34);
    this.addAngledConsole(13.2,-8.6,-.34);
    this.addAngledConsole(-8.8,-4.9,.18);
    this.addAngledConsole(8.8,-4.9,-.18);
  }

  addAngledConsole(x,z,rot){
    const g=new THREE.Group();
    g.position.set(x,-6.1,z);
    g.rotation.y=rot;
    this.root.add(g);
    box(g,[4.8,.55,2.2],[0,.15,0],this.materials.blackMetal,true);
    box(g,[4.4,.18,1.55],[0,.58,-.2],this.materials.carbon,false,[-.18,0,0]);
    box(g,[1.8,.08,.7],[-1.1,.86,-.62],this.materials.screenDim,false,[-.22,.06,0]);
    box(g,[1.8,.08,.7],[1.1,.86,-.62],this.materials.screenDim,false,[-.22,-.06,0]);
    for(let i=-4;i<=4;i++)box(g,[.2,.05,.18],[i*.42,.7,.62],this.materials.button,false);
  }

  buildLift(){
    const lift=new THREE.Group();
    lift.position.set(0,-6.45,8.2);
    this.root.add(lift);
    cylinder(lift,8.4,8.4,1.4,[0,-.55,0],this.materials.concrete,64);
    cylinder(lift,7.2,7.2,.38,[0,.04,0],this.materials.blackMetal,64);
    cylinder(lift,2.4,2.4,.42,[0,.12,0],this.materials.carbon,48);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(7.65,.12,8,96),this.materials.brushed);
    ring.rotation.x=Math.PI/2;
    ring.position.y=.18;
    lift.add(ring);
    const guide=new THREE.Mesh(new THREE.TorusGeometry(6.2,.045,6,88),this.materials.floorLine);
    guide.rotation.x=Math.PI/2;
    guide.position.y=.28;
    lift.add(guide);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      const panel=box(lift,[5.1,.16,.82],[Math.cos(a)*3.4,.32,Math.sin(a)*3.4],this.materials.brushed,false);
      panel.rotation.y=-a;
      box(lift,[4.8,.04,.06],[Math.cos(a)*3.4,.43,Math.sin(a)*3.4],this.materials.rubber,false,[0,-a,0]);
    }
    for(const [x,z,ry] of [[-9,-3.7,.28],[9,-3.7,-.28],[-9,3.7,-.28],[9,3.7,.28]]){
      const mech=new THREE.Group();
      mech.position.set(x,-.35,z);
      mech.rotation.y=ry;
      lift.add(mech);
      cylinder(mech,.22,.22,4.4,[0,0,0],this.materials.hydraulic,20,[Math.PI/2,0,.18]);
      cylinder(mech,.12,.12,4.9,[0,.16,0],this.materials.piston,20,[Math.PI/2,0,.18]);
      box(mech,[1.4,.34,.8],[0,-.34,0],this.materials.blackMetal,true);
    }
  }

  buildWalkways(){
    const paths=[
      {pos:[-18,-6.06,3.2],size:[17,.24,3.2]},
      {pos:[18,-6.06,3.2],size:[17,.24,3.2]},
      {pos:[0,-6.04,-2.2],size:[20,.24,3.0]}
    ];
    paths.forEach(path=>{
      box(this.root,path.size,path.pos,this.materials.grate,false);
      for(let i=-4;i<=4;i++)box(this.root,[path.size[0]-.8,.045,.05],[path.pos[0],path.pos[1]+.15,path.pos[2]+i*.33],this.materials.rubber,false);
      box(this.root,[path.size[0],.18,.18],[path.pos[0],path.pos[1]+.18,path.pos[2]-path.size[2]/2],this.materials.brushed,false);
      box(this.root,[path.size[0],.18,.18],[path.pos[0],path.pos[1]+.18,path.pos[2]+path.size[2]/2],this.materials.brushed,false);
    });
  }

  buildSideMachinery(){
    for(const side of [-1,1]){
      for(const z of [-18,-13,-8]){
        const rack=new THREE.Group();
        rack.position.set(side*25.2,-3.9,z);
        rack.rotation.y=side*-.18;
        this.root.add(rack);
        box(rack,[3.4,5.8,1.1],[0,0,0],this.materials.blackMetal,true);
        for(let i=0;i<8;i++){
          box(rack,[2.9,.36,.12],[0,-2.25+i*.58,.62],this.materials.rubber,false);
          box(rack,[.18,.045,.08],[-1.15,-2.25+i*.58,.7],i%4===0?this.materials.serviceLight:this.materials.indicator,false);
        }
      }
      for(const z of [-4,4]){
        const machine=new THREE.Group();
        machine.position.set(side*23.8,-5.25,z);
        machine.rotation.y=side*-.25;
        this.root.add(machine);
        box(machine,[4.2,1.8,2.4],[0,0,0],this.materials.blackMetal,true);
        cylinder(machine,.5,.5,2.7,[-1.1,.2,0],this.materials.rubber,24,[Math.PI/2,0,0]);
        cylinder(machine,.28,.28,3.6,[1.25,.24,0],this.materials.hydraulic,20,[Math.PI/2,0,.08]);
      }
    }
  }

  buildCableRuns(){
    const cable=this.materials.cable;
    const paths=[
      [[-22,9.8,-22],[-13,8.9,-22],[0,8.4,-22],[13,8.9,-22],[22,9.8,-22]],
      [[-21,-4.9,-9],[-14,-5.3,-8],[-6,-6.0,-9],[0,-5.7,-10]],
      [[21,-4.9,-9],[14,-5.3,-8],[6,-6.0,-9],[0,-5.7,-10]],
      [[-24,-2.2,3],[-18,-4.4,2],[-10,-5.4,5],[-4,-5.8,7]],
      [[24,-2.2,3],[18,-4.4,2],[10,-5.4,5],[4,-5.8,7]]
    ];
    paths.forEach(points=>tube(this.root,points,.055,cable));
    for(const x of [-20,-10,10,20])box(this.root,[4.5,.28,1.2],[x,10.8,-21.8],this.materials.cableTray,false);
  }

  buildHolograms(){
    const holo=new THREE.Group();
    holo.position.set(-11.5,-4.7,-7.2);
    this.root.add(holo);
    cylinder(holo,.78,.92,.28,[0,0,0],this.materials.blackMetal,32);
    const wire=new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(1.15,20,12)),
      new THREE.LineBasicMaterial({color:0x78c7ee,transparent:true,opacity:.24})
    );
    wire.position.y=1.35;
    holo.add(wire);
    this.motion.push({object:wire,type:'spin',speed:.22});

    const panel=new THREE.Mesh(
      new THREE.PlaneGeometry(3.2,1.45),
      new THREE.MeshBasicMaterial({color:0x78c7ee,transparent:true,opacity:.13,side:THREE.DoubleSide,depthWrite:false})
    );
    panel.position.set(10.8,-3.7,-7.5);
    panel.rotation.y=-.42;
    this.root.add(panel);
    this.motion.push({object:panel,type:'pulse',base:.13});
  }

  buildAtmosphere(){
    const count=300;
    const geo=new THREE.BufferGeometry();
    const pos=new Float32Array(count*3);
    const vel=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      pos[i*3]=(Math.random()-.5)*64;
      pos[i*3+1]=Math.random()*15-5.5;
      pos[i*3+2]=Math.random()*38-23;
      vel[i*3]=(Math.random()-.5)*.002;
      vel[i*3+1]=.0008+Math.random()*.002;
      vel[i*3+2]=(Math.random()-.5)*.002;
    }
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const points=new THREE.Points(geo,new THREE.PointsMaterial({color:0x6f8fa6,size:.045,transparent:true,opacity:.16,depthWrite:false}));
    this.root.add(points);
    this.dust={points,pos,vel,count};
  }

  update(time,dt){
    this.screenMaterials.forEach(screen=>{
      screen.material.emissiveIntensity=screen.base+Math.sin(time*1.25+screen.phase)*.06;
    });
    this.lights.screenWash.intensity=3.2+Math.sin(time*.7)*.22;
    this.motion.forEach(item=>{
      if(item.type==='spin')item.object.rotation.y+=dt*item.speed;
      if(item.type==='pulse')item.object.material.opacity=item.base+Math.sin(time*1.3)*.025;
    });
    const dust=this.dust;
    if(dust){
      for(let i=0;i<dust.count;i++){
        dust.pos[i*3]+=dust.vel[i*3];
        dust.pos[i*3+1]+=dust.vel[i*3+1];
        dust.pos[i*3+2]+=dust.vel[i*3+2];
        if(dust.pos[i*3+1]>10){
          dust.pos[i*3]=(Math.random()-.5)*64;
          dust.pos[i*3+1]=-5.5;
          dust.pos[i*3+2]=Math.random()*38-23;
        }
      }
      dust.points.geometry.attributes.position.needsUpdate=true;
    }
  }
}

function createMaterials(){
  const concreteTexture=textureFromCanvas(128,ctx=>{
    ctx.fillStyle='#202327';ctx.fillRect(0,0,128,128);
    for(let i=0;i<800;i++){
      const v=28+Math.random()*34;
      ctx.fillStyle=`rgba(${v},${v+2},${v+5},.18)`;
      ctx.fillRect(Math.random()*128,Math.random()*128,1,1);
    }
  });
  concreteTexture.wrapS=concreteTexture.wrapT=THREE.RepeatWrapping;
  concreteTexture.repeat.set(8,6);

  const brushedTexture=textureFromCanvas(128,ctx=>{
    ctx.fillStyle='#22272c';ctx.fillRect(0,0,128,128);
    for(let y=0;y<128;y+=2){
      const v=32+Math.random()*22;
      ctx.fillStyle=`rgba(${v},${v+4},${v+8},.34)`;
      ctx.fillRect(0,y,128,1);
    }
  });
  brushedTexture.wrapS=brushedTexture.wrapT=THREE.RepeatWrapping;
  brushedTexture.repeat.set(3,3);

  const carbonTexture=textureFromCanvas(96,ctx=>{
    ctx.fillStyle='#090b0d';ctx.fillRect(0,0,96,96);
    ctx.fillStyle='rgba(72,78,84,.18)';
    for(let i=-96;i<160;i+=12){
      ctx.fillRect(i,0,4,96);
      ctx.fillRect(0,i,96,4);
    }
  });
  carbonTexture.wrapS=carbonTexture.wrapT=THREE.RepeatWrapping;
  carbonTexture.repeat.set(5,5);

  return {
    concrete:new THREE.MeshStandardMaterial({map:concreteTexture,color:0x3a3d40,roughness:.94,metalness:.02}),
    ceiling:new THREE.MeshStandardMaterial({color:0x101316,roughness:.86,metalness:.18}),
    column:new THREE.MeshStandardMaterial({color:0x14171b,roughness:.55,metalness:.58}),
    beam:new THREE.MeshStandardMaterial({color:0x11161b,roughness:.46,metalness:.74}),
    brushed:new THREE.MeshStandardMaterial({map:brushedTexture,color:0x2a3035,roughness:.38,metalness:.82}),
    blackMetal:new THREE.MeshStandardMaterial({color:0x080b0e,roughness:.42,metalness:.86}),
    carbon:new THREE.MeshStandardMaterial({map:carbonTexture,color:0x111417,roughness:.35,metalness:.55}),
    rubber:new THREE.MeshStandardMaterial({color:0x030405,roughness:.86,metalness:.08}),
    glass:new THREE.MeshStandardMaterial({color:0x101b22,emissive:0x23475f,emissiveIntensity:.16,roughness:.12,metalness:.1}),
    screenDim:new THREE.MeshStandardMaterial({color:0x07121a,emissive:0x245b7d,emissiveIntensity:.32,roughness:.18,metalness:.05}),
    subtleBlue:new THREE.MeshStandardMaterial({color:0x0b151c,emissive:0x2b6e98,emissiveIntensity:.18,roughness:.32,metalness:.34}),
    floorChannel:new THREE.MeshStandardMaterial({color:0x050708,emissive:0x12364c,emissiveIntensity:.08,roughness:.5,metalness:.3}),
    floorLine:new THREE.MeshStandardMaterial({color:0x0a1b25,emissive:0x2c85b8,emissiveIntensity:.22,roughness:.3,metalness:.4}),
    vent:new THREE.MeshStandardMaterial({color:0x101317,roughness:.58,metalness:.7}),
    grate:new THREE.MeshStandardMaterial({color:0x11161a,roughness:.52,metalness:.76}),
    cableTray:new THREE.MeshStandardMaterial({color:0x0b0e11,roughness:.55,metalness:.62}),
    cable:new THREE.MeshStandardMaterial({color:0x020303,roughness:.82,metalness:.18}),
    hydraulic:new THREE.MeshStandardMaterial({color:0x20272d,roughness:.32,metalness:.9}),
    piston:new THREE.MeshStandardMaterial({color:0x8c979f,roughness:.24,metalness:.95}),
    button:new THREE.MeshStandardMaterial({color:0x1c242b,roughness:.45,metalness:.45}),
    serviceLight:new THREE.MeshStandardMaterial({color:0x3b2416,emissive:0xb66a35,emissiveIntensity:.36,roughness:.3,metalness:.2}),
    indicator:new THREE.MeshStandardMaterial({color:0x0f1b23,emissive:0x2f7dad,emissiveIntensity:.22,roughness:.3,metalness:.2})
  };
}

function createScreenTexture(kind,index){
  return textureFromCanvas(512,ctx=>{
    ctx.fillStyle='#031017';
    ctx.fillRect(0,0,512,512);
    ctx.strokeStyle='rgba(95,169,215,.18)';
    ctx.lineWidth=1;
    for(let x=36;x<500;x+=34){ctx.beginPath();ctx.moveTo(x,30);ctx.lineTo(x,482);ctx.stroke();}
    for(let y=42;y<482;y+=34){ctx.beginPath();ctx.moveTo(26,y);ctx.lineTo(486,y);ctx.stroke();}

    ctx.strokeStyle='rgba(128,199,240,.62)';
    ctx.lineWidth=2;
    if(kind==='command'){
      ctx.strokeRect(42,52,428,296);
      ctx.beginPath();
      ctx.moveTo(108,300);ctx.lineTo(180,188);ctx.lineTo(234,238);ctx.lineTo(306,132);ctx.lineTo(404,278);
      ctx.stroke();
      ctx.fillStyle='rgba(128,199,240,.18)';
      ctx.beginPath();
      ctx.moveTo(256,128);ctx.lineTo(286,176);ctx.lineTo(352,166);ctx.lineTo(306,212);ctx.lineTo(342,272);ctx.lineTo(256,232);ctx.lineTo(170,272);ctx.lineTo(206,212);ctx.lineTo(160,166);ctx.lineTo(226,176);
      ctx.closePath();ctx.fill();
    }else if(kind==='map'){
      for(let i=0;i<5;i++){ctx.strokeRect(62+i*38,70+i*28,300-i*42,240-i*30);}
      ctx.beginPath();ctx.arc(282,245,96,0,Math.PI*2);ctx.stroke();
    }else if(kind==='research'){
      for(let i=0;i<8;i++){
        ctx.beginPath();
        ctx.moveTo(56,96+i*42);
        ctx.lineTo(150+((i*37+index*19)%250),96+i*42);
        ctx.stroke();
      }
      ctx.strokeRect(326,76,110,128);
      ctx.strokeRect(86,332,328,78);
    }else{
      for(let i=0;i<14;i++){
        ctx.beginPath();
        ctx.moveTo(62,70+i*25);
        ctx.lineTo(450,70+i*25);
        ctx.stroke();
      }
      ctx.strokeRect(80,90,142,94);
      ctx.strokeRect(282,246,126,126);
    }
    ctx.fillStyle='rgba(126,198,238,.45)';
    for(let i=0;i<34;i++)ctx.fillRect(46+(i*61+index*29)%420,64+(i*43+index*17)%360,2+(i%5)*3,2);
  });
}

function textureFromCanvas(size,draw){
  const canvas=document.createElement('canvas');
  canvas.width=size;
  canvas.height=size;
  const ctx=canvas.getContext('2d');
  draw(ctx);
  const texture=new THREE.CanvasTexture(canvas);
  texture.minFilter=THREE.LinearFilter;
  texture.magFilter=THREE.LinearFilter;
  return texture;
}

function box(parent,size,pos,material,cast=false,rotation=[0,0,0]){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(size[0],size[1],size[2]),material);
  mesh.position.set(pos[0],pos[1],pos[2]);
  mesh.rotation.set(rotation[0],rotation[1],rotation[2]);
  mesh.castShadow=cast;
  mesh.receiveShadow=true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent,rTop,rBottom,height,pos,material,segments=32,rotation=[0,0,0]){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rTop,rBottom,height,segments),material);
  mesh.position.set(pos[0],pos[1],pos[2]);
  mesh.rotation.set(rotation[0],rotation[1],rotation[2]);
  mesh.castShadow=true;
  mesh.receiveShadow=true;
  parent.add(mesh);
  return mesh;
}

function tube(parent,points,radius,material){
  const curve=new THREE.CatmullRomCurve3(points.map(point=>new THREE.Vector3(point[0],point[1],point[2])));
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,36,radius,7,false),material);
  mesh.castShadow=false;
  mesh.receiveShadow=true;
  parent.add(mesh);
  return mesh;
}
