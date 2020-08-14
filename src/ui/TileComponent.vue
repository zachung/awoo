<template>
  <div :style="tileStyle(item)" class="layer">
    <template v-if="isUrl(item)">
      <img :src="symbol(item)" alt="" />
    </template>
    <div v-else>
      <div v-if="item.props.name" class="tile-name">
        {{ item.props.name }}
      </div>
      <div
        class="symbol"
        v-html="symbol(item)"
        :class="symbolClass(item)"
      ></div>
    </div>
  </div>
</template>

<script>
import Symbols from "../lib/Symbols";

const FaceClass = [
  "",
  "north",
  "south",
  "west",
  "west-north",
  "west-south",
  "east",
  "east-north",
  "east-south"
];

export default {
  props: {
    item: Object
  },
  data() {
    return {
      Symbols
    };
  },
  methods: {
    symbol(item) {
      if (item.type === undefined) {
        return "";
      }
      return this.Symbols[item.type][item.id];
    },
    tileStyle(item) {
      return {
        color: item.color,
        "background-color": item.bgColor
      };
    },
    symbolClass(item) {
      const face = parseInt(item.props.face, 3);
      const classes = [];
      classes.push(`face-${FaceClass[face]}`);
      return classes;
    },
    isUrl(item) {
      const symbol = this.symbol(item);
      return symbol !== undefined && symbol.length > 10;
    }
  }
};
</script>

<style scoped>
.layer {
  position: absolute;
  z-index: 1;
}
.tile-name {
  position: absolute;
  top: -1em;
  left: -2em;
  width: 5em;
  color: white;
  background-color: rgba(50, 50, 50, 0.7);
  display: flex;
  justify-content: center;
  white-space: nowrap;
}
</style>
