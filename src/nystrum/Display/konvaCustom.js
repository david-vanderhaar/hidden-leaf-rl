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

    this.layer = new Konva.Layer({
      hitGraphEnabled: false,
    });
    this.stage.add(this.layer);
  }

  updateTile(tile, character, foreground, background) {
    // child[0] is the rectangle
    // child[1] is the text
    tile.children[0].fill(background);
    tile.children[1].fill(foreground);
    tile.children[1].text(character);
  }

  createTile(x, y, character, foreground, background) {
    let node = new Konva.Group({
      id: `${x},${y}`,
      x: (20 * x) + 20,
      y: (20 * y) + 20,
      width: 10,
      height: 10,
    });

    let rect = new Konva.Rect({
      name: 'rect',
      width: 10,
      height: 10,
      fill: background,
      stroke: foreground,
      // strokeWidth: 1,
      strokeEnabled: false,
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
    });

    let text = new Konva.Text({
      name: 'text',
      text: character,
      width: 10,
      height: 10,
      fill: foreground,
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
    });

    node.add(rect);
    node.add(text);
    this.layer.add(node);
    return node;
  }

  draw () {
    this.layer.batchDraw();
    // this.layer.draw();
  }
}
