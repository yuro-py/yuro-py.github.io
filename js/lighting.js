export function createLighting(scene){
  const lights={};

  const ambient=new THREE.HemisphereLight(0x23384b,0x020304,.32);
  scene.add(ambient);
  lights.ambient=ambient;

  const screenWash=new THREE.PointLight(0x5aa9df,3.6,36,1.7);
  screenWash.position.set(0,3.8,-17.5);
  scene.add(screenWash);
  lights.screenWash=screenWash;

  const deskGlow=new THREE.PointLight(0x2f78a8,1.2,18,1.8);
  deskGlow.position.set(0,-2.1,-8.2);
  scene.add(deskGlow);
  lights.deskGlow=deskGlow;

  const serviceAmber=new THREE.PointLight(0xc77937,.55,13,1.8);
  serviceAmber.position.set(-15,-4.6,6);
  scene.add(serviceAmber);
  lights.serviceAmber=serviceAmber;

  const overhead=new THREE.DirectionalLight(0x9fb5c7,.72);
  overhead.position.set(-8,18,6);
  overhead.castShadow=true;
  overhead.shadow.mapSize.set(1024,1024);
  overhead.shadow.camera.near=1;
  overhead.shadow.camera.far=60;
  overhead.shadow.camera.left=-28;
  overhead.shadow.camera.right=28;
  overhead.shadow.camera.top=24;
  overhead.shadow.camera.bottom=-18;
  scene.add(overhead);
  lights.overhead=overhead;

  return lights;
}
