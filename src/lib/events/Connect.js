import Messages from '../Messages'

/** @this Messenger */
export default function (socket, { game }) {
  Messages.info('連線成功')
  game.connected()
}
