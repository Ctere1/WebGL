var gl;
var theta = 0.0;
var thetaLoc;
var colorLocation;
var x;
var y;
var height;
var width;
window.onload = function init() {

  const canvas = document.querySelector("#glcanvas");
  // Initialize the GL context
  gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // Canvas resize
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Tell it to use our program (pair of shaders)
  var program = initShaders(gl, "vertex-shader", "fragment-shader")
  gl.useProgram(program);
  //Initialize Color - It is Blue for now You can change it if you press the button
  colorLocation = gl.getUniformLocation(program, "u_color");
  var color = [0, 0, 1.0, 1];
  gl.uniform4fv(colorLocation, color);

  //Initialize Triangles 
  var vertices = new Float32Array(
    [
      //top of the c
      -0.5, 0.2,
      - 0.1, 0.2,
      -0.5, 0.1,
      -0.1, 0.2,
      -0.5, 0.1,
      - 0.1, 0.1,
      // middle of the c
      -0.5, 0.2,
      -0.5, -0.2,
      - 0.4, -0.2,
      -0.5, 0.2,
      - 0.4, -0.2,
      - 0.4, 0.2,
      //bottom of the c
      -0.5, -0.2,
      - 0.1, -0.2,
      -0.5, -0.1,
      -0.1, -0.2,
      -0.5, -0.1,
      - 0.1, -0.1,
      //right of the n
      0, 0.2,
      0, -0.2,
      0.1, -0.2,
      0, 0.2,
      0.1, 0.2,
      0.1, -0.2,
      //middle of the n
      0, 0.2,
      0.1, 0.2,
      0.4, -0.2,
      0.5, -0.2,
      0.4, -0.2,
      0.1, 0.2,
      //left of the n
      0.4, 0.2,
      0.4, -0.2,
      0.5, -0.2,
      0.4, 0.2,
      0.5, 0.2,
      0.5, -0.2,
    ]
  );

  // Create and initialize a buffer object
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  //Movement and Scaling
  x = 0;
  y = 0;
  height = canvas.height;
  width = canvas.width;
  document.getElementById("Center X").onmousemove = function (event) {
    x = parseInt(event.target.value, 10);
    gl.viewport(x, y, width, height);
  };
  document.getElementById("Center Y").onmousemove = function (event) {
    y = parseInt(event.target.value, 10);
    gl.viewport(x, y, width, height);
  };
  document.getElementById("Size").onmousemove = function (event) {
    height = parseInt(event.target.value, 10);
    width = parseInt(event.target.value, 10);
    gl.viewport(x, y, width, height);
  };
  //Shape Random Color
  document.getElementById("color").onclick = function () {
    color = [Math.random(), Math.random(), Math.random(), 1];
    gl.uniform4fv(colorLocation, color);
  };

  //Rotation
  thetaLoc = gl.getUniformLocation(program, "theta");
  document.getElementById("rotateLeft").onclick = function () {
    theta += 0.25;
    gl.uniform1f(thetaLoc, theta);
  };
  document.getElementById("rotateRight").onclick = function () {
    theta -= 0.25;
    gl.uniform1f(thetaLoc, theta);
  };
  document.getElementById("reset").onclick = function () {
    theta = 0.0;
    gl.uniform1f(thetaLoc, theta);
  };

  //Keyboard Actions
  window.addEventListener("keydown", keyboardInput, false);
  function keyboardInput(event) {
    var keyCode = event.which;
    console.log(keyCode);
    switch (keyCode) {
      case 87:
        y += 15;
        document.getElementById("Center Y").value = y;
        gl.viewport(x, y, width, height);
        break;
      case 83:
        y -= 15;
        document.getElementById("Center Y").value = y;
        gl.viewport(x, y, width, height);
        break;
      case 68:
        x += 15;
        document.getElementById("Center X").value = x;
        gl.viewport(x, y, width, height);
        break;
      case 65:
        x -= 15;
        document.getElementById("Center X").value = x;
        gl.viewport(x, y, width, height);
        break;
      case 69:
        width *= 1.2;
        height *= 1.2;
        document.getElementById("Size").value = width;
        gl.viewport(x, y, width, height);
        break;
      case 81:
        width /= 1.2;
        height /= 1.2;
        document.getElementById("Size").value = width;
        gl.viewport(x, y, width, height);
        break;
      case 49:
        theta += 0.25;
        gl.uniform1f(thetaLoc, theta);
        break;
      case 50:
        theta = 0.0;
        gl.uniform1f(thetaLoc, theta);
        break;
      case 51:
        theta -= 0.25;
        gl.uniform1f(thetaLoc, theta);
        break;
      case 67:
        color = [Math.random(), Math.random(), Math.random(), 1];
        gl.uniform4fv(colorLocation, color);
        break;
    }
  };

  //Party Mode
  var tag = document.createElement("p");
  var text = document.createTextNode("SOUND ON!");
  var element = document.getElementById("party_on");
  var audio = new Audio('party.mp3');
  var party = document.getElementById("party");
  party.onclick = function () {
    document.body.style.backgroundImage = "url('party_background.jpg')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "20% 30%";
    document.body.style.backgroundPosition = "left";
    document.body.style.backgroundAttachment = "fixed";
    tag.appendChild(text);
    element.appendChild(tag);
    audio.play();
    partyRender();
  };

  //Refresh Page
  var party = document.getElementById("refresh");
  party.onclick = function () {
    location.reload();
    return false;
  };

  //Dont touch
  var touch = document.getElementById("dont_touch");
  var counter = 0;
  touch.onclick = function () {
    counter++;
    if (counter == 4) {
      alert("Ahh ok fine if you dare to do it again, I'll go");
    } else if (counter > 4) {
      window.close();
    } else if (counter == 3) {
      alert("I said don't");
    } else if (counter < 2) {
      alert("Do not...");
    }
  };

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  render();
}

var render = function () {
  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  //set random color for party button
  document.getElementById("party").style.background = '#' + Math.floor(Math.random() * 16777215).toString(16);
  requestAnimFrame(render);
}

var partyRender = function () {
  // Set clear color to black, fully opaque
  gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
  theta += 0.05;
  gl.uniform1f(thetaLoc, theta);
  x += 6 * Math.random();
  x -= 6 * Math.random();
  y += 6 * Math.random();
  y -= 6 * Math.random();
  gl.viewport(x, y, width, height);
  gl.drawArrays(gl.TRIANGLES, 0, 72);
  requestAnimFrame(partyRender);
}