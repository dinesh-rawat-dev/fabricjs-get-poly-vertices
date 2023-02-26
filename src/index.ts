import { fabric } from "fabric";
import "./styles.css";

const el = document.getElementById("canvas");
const canvas = (window.canvas = new fabric.Canvas(el));

canvas.setDimensions({
  width: 500,
  height: 500
});

const points = [
    { x: -50, y: 150 },
    { x: 100, y: 150 },
    { x: 50, y: 50 },
    { x: -100, y: 50 }
  ],
  polygon = new fabric.Polygon(points, {
    // top: 20,
    angle: 0
  });

var group = new fabric.Group([], {
  subTargetCheck: true
});
canvas.add(group);
canvas.centerObjectH(polygon);
group.addWithUpdate(polygon);

const boundingProps = group.getCenterPoint();

const textbox = new fabric.Textbox("Type here", {
  width: 150,
  fontSize: 20,
  textAlign: "center",
  left: boundingProps.x,
  top: boundingProps.y,
  fill: "#fff",
  originX: "center",
  originY: "center",
  selectable: true,
  evented: true,
  editable: true,
  splitByGrapheme: true,
  lockScalingX: true,
  lockScalingY: true
});

textbox.width = group.getScaledWidth() * 0.75;
group.addWithUpdate(textbox);

textbox.on("mousedown", () => {
  textbox.enterEditing();
  textbox.hiddenTextarea.focus();
});

group.on("deselected", () => {
  textbox.exitEditing();
});

function getPolyVertices(poly) {
  const points = poly.points,
    vertices = [];
  for (let i = 0; i < points.length; i++) {
    const point = points[i],
      nextPoint = points[(i + 1) % points.length],
      midPoint = {
        x: (point.x + nextPoint.x) / 2,
        y: (point.y + nextPoint.y) / 2
      };
    const x = midPoint.x - poly.pathOffset.x,
      y = midPoint.y - poly.pathOffset.y;
    vertices.push(
      fabric.util.transformPoint(
        { x: x, y: y },
        fabric.util.multiplyTransformMatrices(
          poly.canvas.viewportTransform,
          poly.calcTransformMatrix()
        )
      )
    );
  }
  return vertices;
}

const polyVertices = getPolyVertices(polygon);

const circles = [];

polyVertices.forEach((vertice) => {
  const circ = new fabric.Circle({
    radius: 5,
    originX: "center",
    originY: "center",
    fill: "blue",
    left: vertice.x,
    top: vertice.y
  });
  circles.push(circ);
  canvas.add(circ);
});

function updateCirclesPosition() {
  const newVertices = getPolyVertices(polygon);
  newVertices.forEach((vertice, idx) => {
    const circ = circles[idx];
    circ.left = vertice.x;
    circ.top = vertice.y;
  });
}

group.on("scaling", updateCirclesPosition);
group.on("skewing", updateCirclesPosition);
group.on("rotating", updateCirclesPosition);
group.on("moving", updateCirclesPosition);
