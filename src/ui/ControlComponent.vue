<template>
  <div id="move_panel"></div>
</template>

<script>
import interact from "interactjs";
import keyboardJS from "keyboardjs";

const Threshold = 0;
const directions = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1]
];

export default {
  name: "ControlComponent",
  mounted() {
    const position = { x: 0, y: 0 };
    interact("#move_panel").draggable({
      listeners: {
        start(event) {
          position.x = 0;
          position.y = 0;
        },
        move(event) {
          position.x += event.dx;
          position.y += event.dy;
          // (1 ~ 360) + 45/2
          const angle = (Math.atan2(-position.y, position.x) * 180) / Math.PI;
          // 0, 1,  2, 3,  4, 5,  6, 7
          // w, ws, s, es, e, en, n, nw
          let direction = Math.floor((angle + 180 + 22.5) / 45);
          const [x, y] = directions[direction === 8 ? 0 : direction];

          keyboardJS.releaseAllKeys();
          if (x === 1) {
            // right
            keyboardJS.pressKey("d", event);
          } else if (x === -1) {
            // left
            keyboardJS.pressKey("a", event);
          }
          if (y === 1) {
            // down
            keyboardJS.pressKey("s", event);
          } else if (y === -1) {
            // up
            keyboardJS.pressKey("w", event);
          }
        },
        end(event) {
          keyboardJS.releaseAllKeys(event);
        }
      }
    });
  }
};
</script>

<style scoped>
#move_panel {
  display: grid;
  position: absolute;
  bottom: 0;
  width: 8em;
  height: 8em;
  padding: 1em;
  margin: 0 auto;
  box-sizing: border-box;

  border-radius: 100%;

  font-size: 1.125em;
  text-align: center;
  color: #fff;
  background-color: rgba(200, 200, 200, 0.3);

  cursor: pointer;
  touch-action: none;
  user-select: none;
  z-index: 10;
}
</style>
