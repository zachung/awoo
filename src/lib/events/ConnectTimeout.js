import Messages from '../Messages'

/** @this Messenger */
export default function (socket, context, err) {
  Messages.error(`server 連線超時(${err.message})`)
}
