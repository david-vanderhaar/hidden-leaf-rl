import Konva from 'konva';

export class Display {
  constructor({
    containerId = null,
    width = 100,
    height = 100,
  }) {
    this.containerId = containerId;
    this.width = width;
    this.height = height;
    this.stage = null;
    this.layer = null;
  }

  initialize (document) {
    let d = document.getElementById(this.containerId)
    let displayContainer = document.createElement('div');
    d.appendChild(displayContainer);

    this.stage = new Konva.Stage({
      container: 'display',   // id of container <div>
      width: this.width,
      height: this.height
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  draw () {
    this.layer.draw();
  }
}

// // first we need to create a stage
// let stage = new Konva.Stage({
//   container: 'display',   // id of container <div>
//   width: 500,
//   height: 500
// });

// // then create layer
// let layer = new Konva.Layer();

// // create our shape
// let circle = new Konva.Circle({
//   x: stage.width() / 2,
//   y: stage.height() / 2,
//   radius: 70,
//   fill: 'red',
//   stroke: 'black',
//   strokeWidth: 4
// });

// // add the shape to the layer
// layer.add(circle);

// // add the layer to the stage
// stage.add(layer);

// // draw the image
// layer.draw();