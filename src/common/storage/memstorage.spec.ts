// (C)opyright 2021-07-15 Dirk Holtwick, holtwick.it. All rights reserved.

import { MemStorage } from "./memstorage"

describe("MemStorage", () => {
  it("should store data and read it again", () => {
    {
      const db = new MemStorage()
      db.clear()
      expect(db.allKeys()).toEqual([])
      db.setItem("a", 1)
      db.setItem("b", { complex: [1, 2, "3"] })
      db.setItem("c", [0, 9, 8])
      db.setItem("c", "Again!")
      expect(db.allKeys()).toEqual(["a", "b", "c"])
      expect(db.getItem("a")).toEqual(1)
      expect(db.getItem("b")).toEqual({ complex: [1, 2, "3"] })
      expect(db.getItem("c")).toEqual("Again!")
      expect(db.getItem("d")).toBe(undefined)
      expect(db.getItem("d")).toBe(undefined)
      db.removeItem("a")
      expect(db.getItem("a")).toBe(undefined)
    }
    // {
    //   const db = new MemStorage()
    //   expect(db.allKeys()).toEqual(["a", "b", "c"])
    //   expect(db.getItem("a")).toEqual(1)
    //   expect(db.getItem("b")).toEqual({ complex: [1, 2, "3"] })
    //   expect(db.getItem("c")).toEqual("Again!")
    //   db.removeItem("b")
    //   expect(db.allKeys()).toEqual(["a", "c"])
    //   db.clear()
    //   expect(db.allKeys()).toEqual([])
    // }
  })
})
