// Inspired by https://developer.apple.com/documentation/foundation/progress#

import { arrayRemoveElement } from '../data'
import { Emitter } from '../msg'
import { uname } from '../uuid'

export class Progress extends Emitter<{
  progressCancelled(progress: Progress): void
  progressChanged(progress: Progress): void
  progressDispose(progress: Progress): void
}> {
  private _totalUnits: number
  private _completedUnits: number
  private _isCancelled = false
  private _resetWhenFinished = true
  private _children: Progress[] = []

  name: string

  constructor(opt: {
    totalUnits?: number
    completeUnits?: number
    resetWhenFinished?: boolean
    name?: string
  } = {}) {
    super()

    this._totalUnits = opt.totalUnits ?? 0
    this._completedUnits = opt.completeUnits ?? 0
    this._resetWhenFinished = opt.resetWhenFinished ?? true
    this.name = opt.name ?? uname('progress')

    this.dispose.add(async () => {
      // log('dispose', this._children)
      for (const child of this._children)
        await child.dispose()
      await this.emit('progressDispose', this)
    })
  }

  private update() {
    void this.emit('progressChanged', this)

    if (this._isCancelled && this._resetWhenFinished) {
      if (this.getTotalUnits() <= this.getCompletedUnits())
        this.reset()
    }
  }

  /** Fresh start */
  reset() {
    if (this._isCancelled) {
      this._isCancelled = false
      for (const child of this._children)
        child.reset()
      this.update()
    }
  }

  /** Notify and mark as cancelled. May take some time before having an effect. */
  async cancel() {
    if (!this._isCancelled) {
      this._isCancelled = true
      await this.emit('progressCancelled', this)
      for (const child of this._children)
        await child.cancel()
      this.update()
    }
  }

  /** Add child progress, which count into its parents units. On `dispose` it will auto remove itself from parent. */
  addChild(child: Progress) {
    child.on('progressDispose', () => this.removeChild(child))
    child.on('progressChanged', () => this.update())
    if (!this._children.includes(child))
      this._children.push(child)
    this.update()
  }

  removeChild(child: Progress) {
    arrayRemoveElement(this._children, child)
    this.update()
  }

  /** Total units including children */
  getTotalUnits(): number {
    if (this.isIndeterminate())
      return 0
    let units = this._totalUnits
    for (const child of this._children)
      units += child.getTotalUnits()
    return units
  }

  /** Completed units including children */
  getCompletedUnits(): number {
    if (this.isIndeterminate())
      return 0
    let units = this._completedUnits
    for (const child of this._children)
      units += child.getCompletedUnits()
    return units
    //  return Math.min(this.getTotalUnits(), units)
  }

  /** Cannot calculate progress, because totalUnits are missing. Special representation in UI. */
  isIndeterminate(): boolean {
    return this._totalUnits <= 0 && this._children.length <= 0
  }

  isCancelled() {
    return this._isCancelled
  }

  /** Either disposed or all units completed. */
  isFinished() {
    return this.dispose.isDisposed() || (!this.isIndeterminate() && (this.getTotalUnits() <= this.getCompletedUnits()))
  }

  /** Value from 0 to 1, where 1 is 100% completeness. */
  getFraction() {
    if (this.isIndeterminate())
      return 0
    return Math.min(1, Math.max(0, this.getCompletedUnits() / this.getTotalUnits()))
  }

  getChildrenCount() {
    return this._children.length
  }

  setTotalUnits(units: number, completedUnits?: number) {
    this._totalUnits = units
    if (completedUnits != null)
      this._completedUnits = completedUnits
    this.update()
  }

  setCompletetedUnits(units: number) {
    this._completedUnits = units
    this.update()
  }

  setCompleted() {
    this._completedUnits = this._totalUnits
    this.update()
  }

  incCompletedUnits(step = 1) {
    this._completedUnits += step
    this.update()
  }

  toString(indent = 0) {
    let s = `${'  '.repeat(indent)}${this.name}: ${this._completedUnits} of ${this._totalUnits} units, ${Math.floor(this.getFraction() * 100)} %, cancel=${this._isCancelled}\n`
    for (const child of this._children)
      s += child.toString(indent + 1)
    if (indent === 0)
      return s.trim()
    return s
  }
}
