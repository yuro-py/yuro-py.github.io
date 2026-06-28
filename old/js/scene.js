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
    this.screenTextures=[];
    this.motion=[];
    this.build();
  }

  build(){
    this.buildShell();
    this.buildDisplay();
    this.buildConsoleDeck();
    this.buildLift();
    this.buildBatmobile();
    this.buildVolumetricBeams();
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
    
    // Create animated canvas texture
    const canvas=document.createElement('canvas');
    canvas.width=512;
    canvas.height=512;
    const ctx=canvas.getContext('2d');
    
    drawScreenContent(ctx,spec.kind,index,0);
    
    const texture=new THREE.CanvasTexture(canvas);
    texture.minFilter=THREE.LinearFilter;
    texture.magFilter=THREE.LinearFilter;

    const material=new THREE.MeshStandardMaterial({
      map:texture,
      color:0xbddff6,
      emissive:0x4f9fd0,
      emissiveIntensity:spec.kind==='command'?1.1:.72,
      roughness:.18,
      metalness:0
    });
    const screen=new THREE.Mesh(new THREE.PlaneGeometry(spec.w,spec.h),material);
    screen.position.z=.13;
    frame.add(screen);

    this.screenTextures.push({ctx,texture,kind:spec.kind,index});
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

  buildBatmobile(){
    const m=this.materials;
    const car=new THREE.Group();
    // Positioned directly on the lift platform
    car.position.set(0,-6.05,8.2);
    car.rotation.y=Math.PI - 0.2; // Angled slightly inward for cinematic presentation
    this.root.add(car);

    // Chassis Base
    box(car,[2.5,0.6,6.2],[0,0.4,0],m.blackMetal,true);
    
    // Armored Cockpit
    box(car,[1.5,0.6,2.0],[0,0.95,0.2],m.glass,false,[-0.25,0,0]);
    box(car,[1.4,0.1,1.6],[0,1.25,0.1],m.carbon,false,[-0.2,0,0]);
    
    // Side Armors
    box(car,[0.6,0.8,4.4],[-1.35,0.5,-0.2],m.carbon,true,[0,0.08,0.12]);
    box(car,[0.6,0.8,4.4],[1.35,0.5,-0.2],m.carbon,true,[0,-0.08,-0.12]);

    // Front Wheel Guards
    box(car,[0.7,0.9,2.0],[-1.45,0.45,1.8],m.blackMetal,true,[-0.1,0.05,0]);
    box(car,[0.7,0.9,2.0],[1.45,0.45,1.8],m.blackMetal,true,[-0.1,-0.05,0]);

    // Front Machine Gun Turret
    box(car,[1.3,0.25,0.6],[0,0.2,2.7],m.blackMetal,true);
    cylinder(car,0.06,0.06,1.4,[-0.5,0.3,3.2],m.brushed,8,[Math.PI/2,0,0]);
    cylinder(car,0.06,0.06,1.4,[0.5,0.3,3.2],m.brushed,8,[Math.PI/2,0,0]);

    // Jet Engine Nozzle at Rear
    cylinder(car,0.45,0.6,1.2,[0,0.45,-3.2],m.brushed,16,[Math.PI/2,0,0]);
    // Jet exhaust active ring
    cylinder(car,0.32,0.32,0.25,[0,0.45,-3.7],m.floorLine,12,[Math.PI/2,0,0]);

    // Back fins
    box(car,[0.08,1.5,2.2],[-1.2,1.35,-2.4],m.carbon,false,[0.18,0.18,-0.25]);
    box(car,[0.08,1.5,2.2],[1.2,1.35,-2.4],m.carbon,false,[0.18,-0.18,0.25]);

    // Front Tires
    cylinder(car,0.75,0.75,0.8,[-1.55,0.4,1.9],m.rubber,24,[0,0,Math.PI/2]);
    cylinder(car,0.75,0.75,0.8,[1.55,0.4,1.9],m.rubber,24,[0,0,Math.PI/2]);
    // Front Hubcaps
    cylinder(car,0.4,0.4,0.84,[-1.55,0.4,1.9],m.brushed,16,[0,0,Math.PI/2]);
    cylinder(car,0.4,0.4,0.84,[1.55,0.4,1.9],m.brushed,16,[0,0,Math.PI/2]);

    // Rear Dual Tires (massive Tumbler-style twin wheels)
    cylinder(car,1.05,1.05,0.8,[-1.75,0.7,-2.2],m.rubber,24,[0,0,Math.PI/2]);
    cylinder(car,1.05,1.05,0.8,[-2.5,0.7,-2.2],m.rubber,24,[0,0,Math.PI/2]);
    cylinder(car,1.05,1.05,0.8,[1.75,0.7,-2.2],m.rubber,24,[0,0,Math.PI/2]);
    cylinder(car,1.05,1.05,0.8,[2.5,0.7,-2.2],m.rubber,24,[0,0,Math.PI/2]);
    // Rear Hubcaps
    cylinder(car,0.55,0.55,0.84,[-2.52,0.7,-2.2],m.brushed,16,[0,0,Math.PI/2]);
    cylinder(car,0.55,0.55,0.84,[2.52,0.7,-2.2],m.brushed,16,[0,0,Math.PI/2]);

    // Holographic Scanner Diagnostic Sweeper (floating above vehicle)
    const scanGeo=new THREE.RingGeometry(3.0,3.2,32);
    const scanMat=new THREE.MeshBasicMaterial({
      color:0x5aa9df,
      side:THREE.DoubleSide,
      transparent:true,
      opacity:0.4,
      blending:THREE.AdditiveBlending,
      depthWrite:false
    });
    const scanner=new THREE.Mesh(scanGeo,scanMat);
    scanner.rotation.x=Math.PI/2;
    scanner.position.y=0.5;
    car.add(scanner);
    this.scanner=scanner;
  }

  buildVolumetricBeams(){
    const createBeam=(pos,rot,color=0x5aa9df,opacity=0.045,height=18,radiusBottom=4)=>{
      const beamGeo=new THREE.CylinderGeometry(0.1,radiusBottom,height,24,1,true);
      const beamMat=new THREE.MeshBasicMaterial({
        color:color,
        transparent:true,
        opacity:opacity,
        blending:THREE.AdditiveBlending,
        depthWrite:false,
        side:THREE.DoubleSide
      });
      const beam=new THREE.Mesh(beamGeo,beamMat);
      beam.position.copy(pos);
      beam.rotation.copy(rot);
      this.root.add(beam);
      return beam;
    };

    // Main Lift Spotlight
    createBeam(new THREE.Vector3(0,2.5,8.2),new THREE.Euler(0,0,0),0x5aa9df,0.05,18,5.2);

    // Left and Right Console Workstation Spotlights
    createBeam(new THREE.Vector3(-9,2.0,-11.5),new THREE.Euler(0.2,0,0.1),0x5aa9df,0.04,16,3.8);
    createBeam(new THREE.Vector3(9,2.0,-11.5),new THREE.Euler(0.2,0,-0.1),0x5aa9df,0.04,16,3.8);

    // Service light on Left Server Racks
    createBeam(new THREE.Vector3(-25.2,0.5,-13),new THREE.Euler(0.1,0,0.6),0xc77937,0.035,15,3.2);
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
    // Update animated screens
    this.screenTextures.forEach(screen=>{
      drawScreenContent(screen.ctx,screen.kind,screen.index,time);
      screen.texture.needsUpdate=true;
    });

    this.screenMaterials.forEach(screen=>{
      screen.material.emissiveIntensity=screen.base+Math.sin(time*1.25+screen.phase)*.06;
    });
    this.lights.screenWash.intensity=3.2+Math.sin(time*.7)*.22;
    
    // Animate holograms/spinners
    this.motion.forEach(item=>{
      if(item.type==='spin')item.object.rotation.y+=dt*item.speed;
      if(item.type==='pulse')item.object.material.opacity=item.base+Math.sin(time*1.3)*.025;
    });
    
    // Animate Batmobile holographic scanner height
    if(this.scanner){
      this.scanner.position.y=0.4+Math.sin(time*1.4)*0.65;
    }

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

  // Weathered concrete bump map for pockmarks and detail
  const concreteBump=textureFromCanvas(256,ctx=>{
    ctx.fillStyle='#808080';
    ctx.fillRect(0,0,256,256);
    for(let i=0;i<60;i++){
      const x=Math.random()*256;
      const y=Math.random()*256;
      const rad=4+Math.random()*16;
      const grad=ctx.createRadialGradient(x,y,0,x,y,rad);
      const v=Math.random()>0.5?255:0;
      grad.addColorStop(0,`rgba(${v},${v},${v},0.22)`);
      grad.addColorStop(1,'rgba(128,128,128,0)');
      ctx.fillStyle=grad;
      ctx.beginPath();
      ctx.arc(x,y,rad,0,Math.PI*2);
      ctx.fill();
    }
  });
  concreteBump.wrapS=concreteBump.wrapT=THREE.RepeatWrapping;
  concreteBump.repeat.set(6,4);

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

  // Fine lines bump map for anisotropic brushed metal highlights
  const brushedBump=textureFromCanvas(128,ctx=>{
    ctx.fillStyle='#808080';
    ctx.fillRect(0,0,128,128);
    for(let y=0;y<128;y++){
      const v=128+Math.floor((Math.random()-0.5)*60);
      ctx.fillStyle=`rgb(${v},${v},${v})`;
      ctx.fillRect(0,y,128,1);
    }
  });
  brushedBump.wrapS=brushedBump.wrapT=THREE.RepeatWrapping;
  brushedBump.repeat.set(3,3);

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
    concrete:new THREE.MeshStandardMaterial({map:concreteTexture,bumpMap:concreteBump,bumpScale:.03,color:0x3a3d40,roughness:.9,metalness:.02}),
    ceiling:new THREE.MeshStandardMaterial({color:0x101316,roughness:.86,metalness:.18}),
    column:new THREE.MeshStandardMaterial({color:0x14171b,roughness:.55,metalness:.58}),
    beam:new THREE.MeshStandardMaterial({color:0x11161b,roughness:.46,metalness:.74}),
    brushed:new THREE.MeshStandardMaterial({map:brushedTexture,bumpMap:brushedBump,bumpScale:.012,color:0x2a3035,roughness:.32,metalness:.85}),
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

function drawScreenContent(ctx,kind,index,time){
  // Clear standard background
  ctx.fillStyle='#02080c';
  ctx.fillRect(0,0,512,512);
  
  // Faint technical grid background
  ctx.strokeStyle='rgba(95,169,215,0.06)';
  ctx.lineWidth=1;
  for(let x=32;x<512;x+=32){
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,512); ctx.stroke();
  }
  for(let y=32;y<512;y+=32){
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(512,y); ctx.stroke();
  }

  // Outer Screen Trim
  ctx.strokeStyle='rgba(128,199,240,0.2)';
  ctx.lineWidth=2;
  ctx.strokeRect(8,8,496,496);

  // Tech Corner Brackets
  ctx.strokeStyle='rgba(128,199,240,0.45)';
  ctx.lineWidth=1.5;
  const drawCorners=(x,y,w,h,len=12)=>{
    ctx.beginPath();
    ctx.moveTo(x+len,y); ctx.lineTo(x,y); ctx.lineTo(x,y+len);
    ctx.moveTo(x+w-len,y); ctx.lineTo(x+w,y); ctx.lineTo(x+w,y+len);
    ctx.moveTo(x+len,y+h); ctx.lineTo(x,y+h); ctx.lineTo(x,y+h-len);
    ctx.moveTo(x+w-len,y+h); ctx.lineTo(x+w,y+h); ctx.lineTo(x+w,y+h-len);
    ctx.stroke();
  };
  drawCorners(12,12,488,488,14);

  // Common Header text
  ctx.fillStyle='rgba(128,199,240,0.8)';
  ctx.font='bold 9.5px monospace';
  ctx.fillText('WAYNETECH SECURE NETWORK // HOST_BAT_AK_01', 20, 26);
  ctx.font='7.5px monospace';
  ctx.fillStyle='rgba(128,199,240,0.45)';
  ctx.fillText('SYS.LOC: BATCAVE_SUB_SECTOR_4 // STATUS: SECURE', 20, 38);
  
  // Horizontal divider
  ctx.strokeStyle='rgba(128,199,240,0.22)';
  ctx.beginPath();
  ctx.moveTo(20,44);
  ctx.lineTo(492,44);
  ctx.stroke();

  ctx.strokeStyle='rgba(128,199,240,0.6)';
  ctx.lineWidth=2;
  
  if(kind==='command'){
    // Center Main Display
    // Faint Bat-Emblem in center background
    ctx.fillStyle='rgba(109,168,216,0.035)';
    ctx.beginPath();
    ctx.moveTo(256, 75);
    ctx.lineTo(262, 90); ctx.lineTo(276, 84); ctx.lineTo(290, 96);
    ctx.lineTo(312, 75); ctx.lineTo(302, 108); ctx.lineTo(282, 118);
    ctx.lineTo(256, 126);
    ctx.lineTo(230, 118); ctx.lineTo(210, 108); ctx.lineTo(200, 75);
    ctx.lineTo(222, 96); ctx.lineTo(236, 84); ctx.lineTo(250, 90);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle='rgba(128,199,240,0.08)';
    ctx.lineWidth=1;
    ctx.stroke();

    // Left Panel: Reasoning Instance Details
    ctx.strokeStyle='rgba(128,199,240,0.35)';
    ctx.strokeRect(24, 60, 140, 130);
    ctx.fillStyle='rgba(128,199,240,0.85)';
    ctx.font='bold 9px monospace';
    ctx.fillText('COGNITIVE INSTANCE', 30, 74);
    ctx.font='8px monospace';
    ctx.fillStyle='rgba(128,199,240,0.6)';
    ctx.fillText('REASONING: MCTS TREE', 30, 89);
    ctx.fillText('SEARCH DEPTH: 1024', 30, 101);
    ctx.fillText('COMPUTE NODES: 64k', 30, 113);
    ctx.fillText('ACTIVE GOAL: UNIFIED TRM', 30, 125);
    ctx.fillText(`TEMP: ${(0.1+Math.sin(time*2)*0.015).toFixed(3)}`, 30, 137);
    ctx.fillStyle='#36a2eb';
    ctx.fillRect(30, 150, 100, 8);
    ctx.fillStyle='#02080c';
    ctx.fillRect(80+Math.floor(Math.sin(time*0.8)*20), 150, 50, 8);

    // Center Planning Search Tree (for researching efficient reasoning)
    ctx.strokeStyle='rgba(128,199,240,0.4)';
    ctx.lineWidth=1.5;
    const drawNode=(x,y,label,active)=>{
      ctx.fillStyle='#02080c';
      ctx.beginPath(); ctx.arc(x,y,14,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=active?'#36a2eb':'rgba(128,199,240,0.4)';
      ctx.stroke();
      ctx.fillStyle=active?'#f0f4f7':'rgba(128,199,240,0.8)';
      ctx.font='bold 8px monospace';
      ctx.textAlign='center';
      ctx.fillText(label,x,y+3);
    };
    ctx.beginPath();
    ctx.moveTo(256, 170); ctx.lineTo(180, 240);
    ctx.moveTo(256, 170); ctx.lineTo(256, 240);
    ctx.moveTo(256, 170); ctx.lineTo(332, 240);
    ctx.moveTo(180, 240); ctx.lineTo(130, 310);
    ctx.moveTo(180, 240); ctx.lineTo(210, 310);
    ctx.moveTo(332, 240); ctx.lineTo(300, 310);
    ctx.moveTo(332, 240); ctx.lineTo(370, 310);
    ctx.stroke();

    const activeNode=Math.floor(time*1.5)%8;
    drawNode(256,170,'ROOT',activeNode===0);
    drawNode(180,240,'A*',activeNode===1);
    drawNode(256,240,'B',activeNode===2);
    drawNode(332,240,'C*',activeNode===3);
    drawNode(130,310,'A1',activeNode===4);
    drawNode(210,310,'A2',activeNode===5);
    drawNode(300,310,'C1',activeNode===6);
    drawNode(370,310,'C2',activeNode===7);
    ctx.textAlign='left';

    // Right Panel: Scrolling Console Logs
    ctx.strokeStyle='rgba(128,199,240,0.35)';
    ctx.strokeRect(348, 60, 140, 264);
    ctx.fillStyle='rgba(128,199,240,0.9)';
    ctx.font='bold 9px monospace';
    ctx.fillText('CONSOLE MONITOR', 356, 74);
    ctx.font='7.5px monospace';
    ctx.fillStyle='rgba(128,199,240,0.55)';
    const baseLines=[
      '>> INITIALIZING PTRM CORE...',
      '>> LOADING PRETRAINED WEIGHTS',
      '>> CHECKPOINT RECOVERED',
      '>> ITERATION: 894,201',
      '>> VAL LOSS: 0.0149 (OPTIMAL)',
      '>> REASONING TRAJECTORY FOUND',
      '>> RUNNING PARALLEL ROLLOUTS...',
      '>> ENTROPY DAMPING: ACTIVE',
      '>> ATTENTION CACHE REALLOCATED',
      '>> STATE: DEEP_THINK_RUNNING',
      '>> TIME_ELAPSED: 04:22:19',
      '>> THREAD_POOL_STABILITY: 100%',
      '>> COMPUTE ALLOCATION: OPTIMAL',
      '>> DEEP_REASON_SEARCH: IN_PROGRESS',
      '>> SYNCING STATE WITH BAT_NET...'
    ];
    const logOffset=Math.floor(time*0.75)%5;
    for(let i=0;i<13;i++){
      ctx.fillText(baseLines[(i+logOffset)%baseLines.length],356,94+i*17);
    }

    // Bottom Graph: Real-time Compute allocation
    ctx.strokeStyle='rgba(128,199,240,0.35)';
    ctx.strokeRect(24, 340, 464, 148);
    ctx.fillStyle='rgba(128,199,240,0.7)';
    ctx.font='bold 9px monospace';
    ctx.fillText('REALTIME COMPUTE ALLOCATION (FLOPS/SEC)', 34, 355);
    
    ctx.strokeStyle='rgba(95,169,215,0.08)';
    ctx.lineWidth=1;
    for(let cx=54;cx<464;cx+=40){
      ctx.beginPath(); ctx.moveTo(cx,370); ctx.lineTo(cx,475); ctx.stroke();
    }
    for(let cy=380;cy<475;cy+=20){
      ctx.beginPath(); ctx.moveTo(44,cy); ctx.lineTo(474,cy); ctx.stroke();
    }
    ctx.strokeStyle='rgba(128,199,240,0.85)';
    ctx.lineWidth=2;
    ctx.beginPath();
    for(let i=0;i<21;i++){
      const gx=44+i*21.5;
      const gy=430-Math.sin(i*0.5-time*2.5)*20-Math.cos(i*0.2+time)*10-(i%4===0?8:0);
      if(i===0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    }
    ctx.stroke();

  }else if(kind==='map'){
    // Left Main Map Display
    ctx.fillStyle='rgba(128,199,240,0.7)';
    ctx.font='bold 10px monospace';
    ctx.fillText('TOPOGRAPHICAL GOTHAM GRID // SONAR GPS', 20, 60);

    // Shorelines & vector maps
    ctx.strokeStyle='rgba(95,169,215,0.22)';
    ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(30, 120); ctx.bezierCurveTo(150, 180, 200, 100, 320, 250);
    ctx.bezierCurveTo(380, 320, 250, 450, 480, 420);
    ctx.stroke();

    ctx.strokeStyle='rgba(128,199,240,0.22)';
    ctx.lineWidth=1;
    for(let i=0;i<8;i++){
      ctx.beginPath(); ctx.moveTo(40+i*50,80); ctx.lineTo(100+i*50,480); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20,100+i*45); ctx.lineTo(490,120+i*45); ctx.stroke();
    }

    // Sonar radar rings
    ctx.strokeStyle='rgba(128,199,240,0.4)';
    ctx.lineWidth=1;
    ctx.beginPath(); ctx.arc(280, 260, 60, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(280, 260, 120, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(280, 260, 180, 0, Math.PI*2); ctx.stroke();

    // Radial Radar sweep line
    ctx.strokeStyle='rgba(128,199,240,0.25)';
    ctx.beginPath();
    ctx.moveTo(280,260);
    const sweepAngle=(time*0.9)%(Math.PI*2);
    ctx.lineTo(280+Math.cos(sweepAngle)*180, 260+Math.sin(sweepAngle)*180);
    ctx.stroke();

    // Map targets
    const targets=[
      {x:280,y:260,color:'#36a2eb',label:'WORKSTATION',pulse:true},
      {x:180,y:150,color:'#ff6384',label:'SIGNAL_LOST',pulse:true},
      {x:390,y:340,color:'#ffcc00',label:'BATWING_DRONE',pulse:false},
      {x:120,y:380,color:'#36a2eb',label:'OUTPOST_B_SECURE',pulse:false}
    ];
    targets.forEach(t=>{
      ctx.fillStyle=t.color;
      ctx.beginPath(); ctx.arc(t.x, t.y, 4.5, 0, Math.PI*2); ctx.fill();
      if(t.pulse){
        ctx.strokeStyle=t.color;
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.arc(t.x,t.y,5+((time*4+t.x)%15),0,Math.PI*2);
        ctx.stroke();
      }
      ctx.fillStyle='rgba(128,199,240,0.7)';
      ctx.font='bold 7px monospace';
      ctx.fillText(t.label,t.x+8,t.y+3);
    });

    // Tracking panel overlays
    ctx.fillStyle='rgba(12,28,40,0.82)';
    ctx.fillRect(24, 390, 160, 90);
    ctx.strokeStyle='rgba(128,199,240,0.35)';
    ctx.strokeRect(24, 390, 160, 90);
    ctx.fillStyle='rgba(128,199,240,0.85)';
    ctx.font='bold 8px monospace';
    ctx.fillText('TARGET TRACKING', 30, 405);
    ctx.font='7px monospace';
    ctx.fillStyle='rgba(128,199,240,0.6)';
    ctx.fillText(`COORDS: 40°42'N 73°59'W`, 30, 420);
    ctx.fillText(`AZIMUTH: ${(182.04+Math.sin(time)*0.05).toFixed(3)}`, 30, 432);
    ctx.fillText(`ELEV: ${(11.23+Math.cos(time*2)*0.02).toFixed(3)}`, 30, 444);
    ctx.fillText('RANGE: 12.4 km', 30, 456);
    ctx.fillStyle='#ff6384';
    ctx.fillText('LINK: ACTIVE (SECURE)', 30, 468);

  }else if(kind==='research'){
    // Right Main Display: Code Repository / Attention Heatmap
    ctx.fillStyle='rgba(128,199,240,0.7)';
    ctx.font='bold 10px monospace';
    ctx.fillText('NEURAL CORE ARCHITECTURE // CODE REPOSITORY', 20, 60);

    // Code snippets box
    ctx.fillStyle='rgba(10,18,25,0.7)';
    ctx.fillRect(24, 76, 464, 180);
    ctx.strokeStyle='rgba(128,199,240,0.22)';
    ctx.strokeRect(24, 76, 464, 180);
    
    ctx.font='8px monospace';
    const code=[
      '# yuro: process-token reasoning models core mechanism',
      'import torch',
      'import torch.nn as nn',
      '',
      'class UnifiedTRM(nn.Module):',
      '    def __init__(self, d_model=512, nhead=8):',
      '        super().__init__()',
      '        self.self_attn = nn.MultiheadAttention(d_model, nhead)',
      '        self.reasoning_head = nn.Linear(d_model, 1) # process token loss',
      '        ',
      '    def forward(self, x, mask=None):',
      '        attn_output, attn_weights = self.self_attn(x, x, x, attn_mask=mask)',
      '        value = self.reasoning_head(attn_output)',
      '        return torch.softmax(value, dim=-1), attn_weights'
    ];
    code.forEach((line,i)=>{
      let fill='rgba(128,199,240,0.85)';
      if(line.startsWith('#')) fill='rgba(100,160,200,0.5)';
      else if(line.includes('import')||line.includes('class')||line.includes('def')||line.includes('return')) fill='#6da8d8';
      ctx.fillStyle=fill;
      ctx.fillText(line,36,94+i*11);
    });

    // Neural Loss curve
    ctx.strokeStyle='rgba(128,199,240,0.3)';
    ctx.strokeRect(24, 276, 220, 210);
    ctx.fillStyle='rgba(128,199,240,0.85)';
    ctx.font='bold 8.5px monospace';
    ctx.fillText('TRAINING LOSS DESCENT', 34, 292);

    ctx.strokeStyle='rgba(128,199,240,0.5)';
    ctx.beginPath();
    ctx.moveTo(34, 460); ctx.lineTo(234, 460);
    ctx.moveTo(34, 305); ctx.lineTo(34, 460);
    ctx.stroke();

    ctx.strokeStyle='#36a2eb';
    ctx.lineWidth=1.5;
    ctx.beginPath();
    for(let i=0;i<18;i++){
      const lx=36+i*11;
      const ly=450-(100/(i*0.4+1))-Math.sin(i*0.9-time*2)*6;
      if(i===0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    }
    ctx.stroke();

    // Attention heat weights
    ctx.strokeStyle='rgba(128,199,240,0.3)';
    ctx.strokeRect(268, 276, 220, 210);
    ctx.fillStyle='rgba(128,199,240,0.85)';
    ctx.fillText('ATTENTION MATRIX WEIGHTS', 278, 292);

    const cellSize=13;
    const matrixX=288;
    const matrixY=320;
    for(let r=0;r<10;r++){
      for(let c=0;c<10;c++){
        const intensity=Math.abs(Math.sin((r*1.8+c*2.5+time*1.8)))*0.72+((r===c)?0.28:0);
        ctx.fillStyle=`rgba(109,168,216,${Math.min(1.0,intensity)})`;
        ctx.fillRect(matrixX+c*cellSize,matrixY+r*cellSize,cellSize-1,cellSize-1);
      }
    }
    ctx.font='7px monospace';
    ctx.fillStyle='rgba(128,199,240,0.5)';
    ctx.fillText('TOKEN_SEQ_IN [0..9]', matrixX, 462);
    ctx.fillText(`EPOCH: ${Math.floor(time*0.5)%1000+400}`, matrixX, 474);

  }else if(kind==='telemetry'){
    // Left secondary monitor: Waveforms / Signals
    ctx.fillStyle='rgba(128,199,240,0.7)';
    ctx.font='bold 9.5px monospace';
    ctx.fillText('SYSTEM SIGNAL MONITOR // TELEMETRY', 20, 60);

    for(let boxIdx=0;boxIdx<2;boxIdx++){
      const by=80+boxIdx*200;
      ctx.strokeStyle='rgba(128,199,240,0.35)';
      ctx.strokeRect(24, by, 464, 180);
      ctx.fillStyle='rgba(128,199,240,0.8)';
      ctx.font='bold 8.5px monospace';
      ctx.fillText(boxIdx===0?'VIBRATION MONITOR (M/S²)':'HYDRAULIC PRESSURE (MPa)', 34, by+18);

      ctx.strokeStyle='rgba(95,169,215,0.08)';
      ctx.beginPath();
      ctx.moveTo(34, by+90); ctx.lineTo(478, by+90);
      ctx.stroke();

      ctx.strokeStyle=boxIdx===0?'#36a2eb':'#c77937';
      ctx.lineWidth=1.5;
      ctx.beginPath();
      for(let i=0;i<40;i++){
        const wx=34+i*11.2;
        const amp=boxIdx===0?45:30;
        const freq=boxIdx===0?0.35:0.15;
        const wy=by+90+Math.sin(i*freq+time*6.5)*amp+Math.cos(i*freq*2.5+time*3)*12;
        if(i===0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();
    }

  }else if(kind==='diagnostic'){
    // Right secondary monitor: Batmobile 2D Wireframe Diagnostics
    ctx.fillStyle='rgba(128,199,240,0.7)';
    ctx.font='bold 9.5px monospace';
    ctx.fillText('WAYNETECH ARMOR DIVISION // DIAGNOSTICS', 20, 60);

    // Batmobile side wireframe schematic
    ctx.strokeStyle='#36a2eb';
    ctx.lineWidth=1.8;
    ctx.beginPath();
    ctx.moveTo(80, 210);
    ctx.lineTo(130, 210);
    ctx.lineTo(150, 170);
    ctx.lineTo(260, 170);
    ctx.lineTo(310, 120);
    ctx.lineTo(380, 120);
    ctx.lineTo(410, 170);
    ctx.lineTo(430, 210);
    ctx.stroke();
    
    // Tires outline
    ctx.fillStyle='#02080c';
    ctx.strokeStyle='rgba(128,199,240,0.8)';
    ctx.beginPath(); ctx.arc(130, 210, 36, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(130, 210, 16, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(360, 210, 26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(360, 210, 10, 0, Math.PI*2); ctx.stroke();

    // Rear Spoiler fins
    ctx.strokeStyle='#36a2eb';
    ctx.beginPath();
    ctx.moveTo(110, 120); ctx.lineTo(160, 120); ctx.lineTo(150, 170);
    ctx.stroke();

    // Callout data tags
    ctx.strokeStyle='rgba(128,199,240,0.35)';
    ctx.lineWidth=1;
    
    const drawCallout=(x,y,tx,ty,label)=>{
      ctx.beginPath();
      ctx.moveTo(x,y); ctx.lineTo(tx,ty); ctx.lineTo(tx+(tx>x?25:-25), ty);
      ctx.stroke();
      ctx.fillStyle='rgba(128,199,240,0.85)';
      ctx.font='8px monospace';
      ctx.fillText(label, tx+(tx>x?2:-22), ty-4);
    };
    
    drawCallout(380, 120, 330, 85, 'CABIN: 100%');
    drawCallout(430, 190, 400, 260, 'EXHAUST: OPTIMIZED');
    drawCallout(130, 210, 80, 280, 'DUAL_TIRE: OK');
    drawCallout(200, 170, 180, 95, 'ARMOR: KEVLAR/CARBON');

    // System values report
    ctx.fillStyle='rgba(12,28,40,0.85)';
    ctx.fillRect(250, 330, 230, 140);
    ctx.strokeStyle='rgba(128,199,240,0.35)';
    ctx.strokeRect(250, 330, 230, 140);
    ctx.fillStyle='rgba(128,199,240,0.85)';
    ctx.font='bold 8.5px monospace';
    ctx.fillText('VEHICLE STATUS REPORT', 260, 348);
    ctx.font='7.5px monospace';
    ctx.fillStyle='rgba(128,199,240,0.6)';
    ctx.fillText('ENGINE STATUS: OPERATIONAL', 260, 368);
    ctx.fillText(`HYDRAULIC PRESSURE: ${(24.5+Math.sin(time*3)*0.4).toFixed(2)} MPa`, 260, 383);
    ctx.fillText('STEALTH COATING: ENGAGED [98%]', 260, 398);
    ctx.fillText(`BATTERY POWER: ${(99.8-time*0.001).toFixed(2)}%`, 260, 413);
    ctx.fillText('FUEL CAPACITY: 280L / 300L', 260, 428);
    ctx.fillStyle='#36a2eb';
    ctx.fillText('ALL SYSTEMS NOMINAL', 260, 452);

  }else{
    // Console / Touch screens keyboard
    ctx.fillStyle='rgba(128,199,240,0.7)';
    ctx.font='bold 10px monospace';
    ctx.fillText('INPUT DECK // INTERACTIVE PANEL', 20, 60);

    ctx.strokeStyle='rgba(95,169,215,0.22)';
    ctx.lineWidth=1;
    
    const startX=24;
    const startY=80;
    const keyW=18;
    const keyH=18;
    
    for(let r=0;r<10;r++){
      for(let c=0;c<22;c++){
        const active=(r*3+c*7+Math.floor(time*1.5))%9===0;
        ctx.fillStyle=active?'rgba(109,168,216,0.35)':'rgba(8,20,30,0.55)';
        ctx.fillRect(startX+c*(keyW+3), startY+r*(keyH+3), keyW, keyH);
        ctx.strokeRect(startX+c*(keyW+3), startY+r*(keyH+3), keyW, keyH);
      }
    }

    ctx.fillStyle='rgba(128,199,240,0.7)';
    ctx.font='bold 9px monospace';
    ctx.fillText('DECK CONTROL CHANNELS', startX, 310);
    
    for(let i=0;i<4;i++){
      const sx=startX+i*120;
      const sy=330;
      ctx.strokeStyle='rgba(128,199,240,0.25)';
      ctx.strokeRect(sx, sy, 100, 140);
      ctx.strokeStyle='rgba(128,199,240,0.4)';
      ctx.beginPath(); ctx.moveTo(sx+50, sy+10); ctx.lineTo(sx+50, sy+130); ctx.stroke();
      const valY=sy+30+Math.abs(Math.sin(time*0.9+i*0.8))*80;
      ctx.fillStyle='#36a2eb';
      ctx.fillRect(sx+40, valY-4, 20, 8);
      ctx.fillStyle='rgba(128,199,240,0.8)';
      ctx.font='8px monospace';
      ctx.fillText(`CH_0${i+1}: ${Math.floor(100-(valY-sy-10)/1.2)}%`, sx+10, sy+130);
    }
  }
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
