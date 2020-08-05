import Messages from '../Messages'

/** @this Messenger */
export default function (socket, { name }) {
  Messages.info('連線成功')
  this.newPlayer(name)
}
