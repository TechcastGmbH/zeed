// (C)opyright 2021-07-15 Dirk Holtwick, holtwick.it. All rights reserved.

import { Logger } from "../log"
import { Emitter } from "./emitter"
import { cloneObject } from "../data/utils"
import { uuid } from "../uuid"

const log = Logger("zeed:channel")

/** See http://developer.mozilla.org/en-US/docs/Web/API/MessageEvent */
export interface ChannelMessageEvent {
  data: ArrayBuffer
  origin?: string
  lastEventId?: string
}

/**
 * Inspired by
 * http://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
 * https://deno.com/deploy/docs/runtime-broadcast-channel
 * */
export abstract class Channel extends Emitter<{
  message(event: ChannelMessageEvent): void
  messageerror(event: ChannelMessageEvent): void
  connect(): void // optional
  disconnect(): void // optional
}> {
  abstract isConnected?: boolean
  abstract postMessage(data: ArrayBuffer): void
  close() {}
}

/** Very basic channel demonstrating local communication */
export class LocalChannel extends Channel {
  isConnected = true

  other?: LocalChannel

  postMessage(data: any) {
    this.other?.emit("message", {
      data: cloneObject(data),
      origin: "local",
      lastEventId: uuid(),
    })
  }
}

/** Channel that requires  */
export class CommandChannel {}
