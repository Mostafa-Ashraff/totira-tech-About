// void main()
// {
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }



 
  varying vec2 vUv;
  uniform sampler2D utexture1;
  uniform sampler2D utexture2;
  varying vec2 offsetText1;

  void main() {
      offsetText1 = vec2(0.1,0.1);
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 displacement  = texture2D(utexture1,vUv+offsetText1);
      vec4 displacement2 = texture2D(utexture2,vUv);
      modelPosition.z   += displacement.r*1.0;
      modelPosition.z   += displacement2.r*40.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  