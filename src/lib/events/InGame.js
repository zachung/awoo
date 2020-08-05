/** @this Messenger */
export default function (socket, { inGame }, ...args) {
  return inGame(...args)
}
