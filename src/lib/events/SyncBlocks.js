/** @this Messenger */
export default function (socket, { stage }, data) {
  // update data
  for (const itemData of data) {
    // change itemData
    stage.replace(itemData)
  }
}
