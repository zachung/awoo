import Messages, { Types } from '../Messages'

import colors from 'colors'

/** @this Messenger */
export default function (socket, context, { name, message }) {
  Messages.info(message, { name, type: Types.CHAT })
}
