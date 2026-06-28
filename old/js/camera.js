const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export class CinematicCameraControls{
  constructor(camera,canvas){
    this.camera=camera;
    this.canvas=canvas;
    this.target=new THREE.Vector3(0,1.4,-8.5);
    this.theta=0;
    this.phi=.25;
    this.radius=32;
    this.targetTheta=0;
    this.targetPhi=.25;
    this.targetRadius=32;
    this.dragging=false;
    this.last={x:0,y:0};
    this.idle=true;
    this.time=0;
    this.lastInteractionTime=0;
    this.azimuthLimit=.58;
    this.minPhi=.1;
    this.maxPhi=.58;
    this.minRadius=24;
    this.maxRadius=38;
    this.bind();
  }

  bind(){
    this.canvas.addEventListener('pointerdown',event=>{
      this.dragging=true;
      this.idle=false;
      this.lastInteractionTime=this.time;
      this.last={x:event.clientX,y:event.clientY};
      this.canvas.setPointerCapture(event.pointerId);
    });
    this.canvas.addEventListener('pointerup',event=>{
      this.dragging=false;
      this.canvas.releasePointerCapture(event.pointerId);
    });
    this.canvas.addEventListener('pointercancel',()=>{this.dragging=false;});
    this.canvas.addEventListener('pointermove',event=>{
      if(!this.dragging)return;
      this.idle=false;
      this.lastInteractionTime=this.time;
      const dx=event.clientX-this.last.x;
      const dy=event.clientY-this.last.y;
      this.targetTheta=clamp(this.targetTheta-dx*.0048,-this.azimuthLimit,this.azimuthLimit);
      this.targetPhi=clamp(this.targetPhi+dy*.0036,this.minPhi,this.maxPhi);
      this.last={x:event.clientX,y:event.clientY};
    });
    this.canvas.addEventListener('wheel',event=>{
      this.idle=false;
      this.lastInteractionTime=this.time;
      this.targetRadius=clamp(this.targetRadius+event.deltaY*.018,this.minRadius,this.maxRadius);
    },{passive:true});
  }

  update(dt){
    this.time+=dt;
    if(!this.idle&&this.time-this.lastInteractionTime>8.0){
      this.idle=true;
    }
    if(this.idle){
      this.targetTheta=Math.sin(this.time*.16)*.12;
      this.targetPhi=.25+Math.sin(this.time*.11)*.025;
    }
    this.theta+=(this.targetTheta-this.theta)*.075;
    this.phi+=(this.targetPhi-this.phi)*.075;
    this.radius+=(this.targetRadius-this.radius)*.085;
    const x=this.target.x+this.radius*Math.sin(this.theta)*Math.cos(this.phi);
    const y=this.target.y+this.radius*Math.sin(this.phi)+2.2;
    const z=this.target.z+this.radius*Math.cos(this.theta)*Math.cos(this.phi);
    this.camera.position.set(x,y,z);
    this.camera.lookAt(this.target);
  }
}
