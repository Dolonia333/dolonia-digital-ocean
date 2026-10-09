import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, '..', 'frontend', 'public', 'ocean', 'index.html')
mkdirSync(dirname(out), { recursive: true })
copyFileSync(join(root, 'dist', 'index.html'), out)
console.log('Copied preview to frontend/public/ocean/index.html')
