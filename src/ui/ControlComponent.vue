<template>
  <div id="move_panel"></div>
</template>

<script>
import interact from "interactjs";
import keyboardJS from "keyboardjs";

const Threshold = 50;

export default {
  name: "ControlComponent",
  mounted() {
    const position = { x: 0, y: 0 };
    interact("#move_panel").draggable({
      listeners: {
        start(event) {
          position.x = 0;
          position.y = 0;
          console.log(event.type, event.target);
        },
        move(event) {
          position.x += event.dx;
          position.y += event.dy;

          keyboardJS.releaseAllKeys();
          if (Math.abs(position.x) > Threshold) {
            if (position.x > 0) {
              // right
              keyboardJS.pressKey("d", event);
            } else {
              // left
              keyboardJS.pressKey("a", event);
            }
          }
          if (Math.abs(position.y) > Threshold) {
            if (position.y > 0) {
              // down
              keyboardJS.pressKey("s", event);
            } else {
              // up
              keyboardJS.pressKey("w", event);
            }
          }
          // event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
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
  width: 12em;
  height: 12em;
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
