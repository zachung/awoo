/** @this Messenger */
export default function (socket, { game }, count) {
  game.currentOnline = count
}
