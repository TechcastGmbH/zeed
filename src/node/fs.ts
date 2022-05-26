import { mkdir, rm, stat, readFile, writeFile } from "node:fs/promises"
import { join as joinPath } from "node:path"

export async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
  } catch (err) {
    return false
  }
  return true
}

export async function ensureFolder(...parts: string[]): Promise<string> {
  const path = joinPath(...parts)
  if (!(await exists(path))) {
    await mkdir(path, { recursive: true })
  }
  return path
}

export async function removeFolder(...parts: string[]): Promise<string> {
  const path = joinPath(...parts)
  if (await exists(path)) {
    await rm(path, { recursive: true })
  }
  return path
}

export async function readText(
  ...parts: string[]
): Promise<string | undefined> {
  const path = joinPath(...parts)
  if (await exists(path)) {
    return await readFile(path, "utf-8")
  }
}

export async function writeText(path: string, content: string): Promise<void> {
  await writeFile(path, content, "utf-8")
}

// todo: writeBinary, readBinary
