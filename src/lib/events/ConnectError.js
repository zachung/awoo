import Messages from '../Messages'

/** @this Messenger */
export default function (socket, context, err) {
  // polling server failed...
  Messages.error(`server 沒有回應(${err.message})`)
}
