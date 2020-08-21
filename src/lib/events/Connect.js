import Messages from '../Messages'

/** @this Messenger */
export default function (socket, { game }) {
  Messages.info('connected')
  game.connected()
}
