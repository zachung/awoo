import Messages from '../Messages'

/** @this Messenger */
export default function (socket, context, reason) {
  Messages.error('失去連線')
  if (reason === 'io server disconnect') {
    // the disconnection was initiated by the server, you need to reconnect manually
    socket.connect()
    return
  }
  Messages.info('正在準備重新連線')
}
