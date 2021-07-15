// (C)opyright 2021-07-15 Dirk Holtwick, holtwick.it. All rights reserved.

import { empty, size } from "./utils"

describe("size", () => {
  it("should calc size of map", () => {
    let map = new Map()
    map.set("a", 1)
    map.set("b", 2)
    expect(size(map)).toBe(2)
  })

  it("should calc size of set", () => {
    let set = new Set()
    set.add(1)
    set.add(2)
    set.add(3)
    expect(size(set)).toBe(3)
  })

  it("should calc size of object", () => {
    expect(size({ a: 1, b: 2 })).toBe(2)
  })

  it("should calc size of array", () => {
    expect(size([1, 2, undefined])).toBe(3)
  })

  it("should calc size of primitives", () => {
    expect(size("hello")).toBe(5)
    expect(size(3)).toBe(0)
    expect(size(true)).toBe(0)
    expect(size(null)).toBe(0)
    expect(size(undefined)).toBe(0)
    expect(size(NaN)).toBe(0)
  })
})

describe("empty", () => {
  it("should calc empty of map", () => {
    let map = new Map()
    expect(empty(map)).toBe(true)
    map.set("a", 1)
    map.set("b", 2)
    expect(empty(map)).toBe(false)
  })

  it("should calc empty of set", () => {
    let set = new Set()
    expect(empty(set)).toBe(true)
    set.add(1)
    set.add(2)
    set.add(3)
    expect(empty(set)).toBe(false)
  })

  it("should calc empty of object", () => {
    expect(empty({})).toBe(true)
    expect(empty({ a: 1, b: 2 })).toBe(false)
  })

  it("should calc empty of array", () => {
    expect(empty([])).toBe(true)
    expect(empty([undefined])).toBe(false)
    expect(empty([1, 2, undefined])).toBe(false)
  })

  it("should calc empty of primitives", () => {
    expect(empty("")).toBe(true)
    expect(empty("hello")).toBe(false)
    expect(empty(3)).toBe(true)
    expect(empty(0)).toBe(true)
    expect(empty(false)).toBe(true)
    expect(empty(true)).toBe(true)
    expect(empty(null)).toBe(true)
    expect(empty(undefined)).toBe(true)
    expect(empty(NaN)).toBe(true)
  })
})
