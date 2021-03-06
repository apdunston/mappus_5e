import {Modal} from "./otherPeoplesCode/modal.js";
import {draw} from "./models/view.js";
import {addHistory, fullSizeCanvas} from "./mappusEngine.js";

var modal;
var modalBody;
var global;

export function init(inputGlobal, document) {
  global = inputGlobal;
  var img = document.getElementById("img");
  img.addEventListener("click", function () {
    fullSizeCanvas();
    canvasToImage("main", document, {
      name: 'myImage',
      type: 'png',
      quality: 1
    });
  });
  
  modal = new Modal(document.querySelector('.modal-overlay'));
  modalBody = document.getElementById("modal-body");

  var exportButton = document.getElementById("export");
  exportButton.addEventListener("click", _e => {
    modalBody.innerHTML = `<textarea style="width: 300px; height: 200px">${JSON.stringify(global.drawing.export())}</textarea>`;
    modal.open();
  });

  document.getElementById("import").addEventListener("click", _e => {
    modalBody.innerHTML = `
      <textarea id="import-box" style="width: 300px; height: 200px"></textarea>
      <br>
      <button id="do-import">IMPORT</button>
    `;    
    modal.open();
    var doImport = document.getElementById("do-import");
    doImport.addEventListener("click", _e => {
      let json = document.getElementById("import-box").value;
      global.drawing.import(JSON.parse(json));
      draw(global.view, global.drawing);
      modal.close();
    })
  });

  document.getElementById("undo").addEventListener("click", _e => {
    if(global.history.length > 0) {
      global.future.push(global.drawing);
      global.drawing = global.history.pop();
    }

    draw(global.view, global.drawing);
  });

  
  document.getElementById("redo").addEventListener("click", _e => {
    if(global.future.length > 0) {
      global.history.push(global.drawing);
      global.drawing = global.future.pop();
    }

    draw(global.view, global.drawing);
  });

  var drawButton = document.getElementById("draw");
  var fillButton = document.getElementById("fill");
  var lineButton = document.getElementById("line");
  var labelButton = document.getElementById("label");

  enableModeButtons();
  drawButton.disabled = true;

  drawButton.addEventListener("click", _e => {
    global.mode = "draw";
    enableModeButtons();
    drawButton.disabled = true;
  });

  fillButton.addEventListener("click", _e => {
    global.mode = "fill";
    enableModeButtons();
    fillButton.disabled = true;
  });

  lineButton.addEventListener("click", _e => {
    global.mode = "line";
    enableModeButtons();
    lineButton.disabled = true;
  });

  labelButton.addEventListener("click", _e => {
    global.mode = "label";
    enableModeButtons();
    label.disabled = true;
  });

  function enableModeButtons() {
    global.lineStartX = null;
    global.lineStartY = null;
    global.lineEndX = null;
    global.lineEndY = null;
    drawButton.disabled = false;
    fillButton.disabled = false;
    lineButton.disabled = false;
    labelButton.disabled = false;

    if (global.view) {
      draw(global.view, global.drawing);
    }
  }

}

export function labelModal(x, y) {
  modalBody.innerHTML = `
    [${x}, ${y}]
    <br>
    <textarea id="label-box" style="width: 300px; height: 200px"></textarea>
    <br>
    <button id="set-label">Set Label</button>
  `;    

  modal.open();
  var doLabel = document.getElementById("set-label");

  doLabel.addEventListener("click", _e => {
    let labelValue = document.getElementById("label-box").value;
    addHistory();
    global.drawing.addLabel(x, y, labelValue);
    draw(global.view, global.drawing);
    modal.close();
  })
}
