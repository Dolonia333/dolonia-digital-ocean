#!/usr/bin/env node

/**
 * Diagnostic Script: Identify Memory Leak
 *
 * Run this to find what's consuming 3.7 GB
 */

const fs = require('fs')
const path = require('path')

console.log('\n═══════════════════════════════════════════════════════════════')
console.log('  MEMORY LEAK DIAGNOSTIC')
console.log('═══════════════════════════════════════════════════════════════\n')

// Check Node memory
const nodeMemory = process.memoryUsage()
console.log('📊 NODE PROCESS MEMORY:')
console.log(`   Heap Used:   ${Math.round(nodeMemory.heapUsed / 1024 / 1024)} MB`)
console.log(`   Heap Total:  ${Math.round(nodeMemory.heapTotal / 1024 / 1024)} MB`)
console.log(`   RSS (Total): ${Math.round(nodeMemory.rss / 1024 / 1024)} MB`)
console.log(`   External:   ${Math.round(nodeMemory.external / 1024 / 1024)} MB\n`)

// List all files in src
console.log('📁 SOURCE CODE STRUCTURE:')
const srcPath = path.join(__dirname, 'src')

function getDirectorySize(dir) {
  let size = 0
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath)
    } else {
      size += stats.size
    }
  })

  return size
}

function listDirectory(dir, indent = 0) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    if (file.startsWith('.')) return

    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)
    const prefix = indent === 0 ? '   ' : '   '.repeat(indent) + '├─ '

    if (stats.isDirectory()) {
      const size = getDirectorySize(filePath)
      console.log(`${prefix}📂 ${file}/ (${Math.round(size / 1024)} KB)`)
      if (indent < 2) listDirectory(filePath, indent + 1)
    } else {
      console.log(`${prefix}📄 ${file} (${Math.round(stats.size / 1024)} KB)`)
    }
  })
}

listDirectory(srcPath)

console.log('\n⚠️  COMMON CAUSES OF 3.7 GB MEMORY USAGE:\n')
console.log('  1. BROWSER DevTools showing memory (not Node process)')
console.log("     → Check if you're measuring React component state")
console.log('     → Large arrays in state grow rapidly')
console.log('     → Solution: Implement pagination or virtualization\n')

console.log('  2. REALTIME SUBSCRIPTIONS not being cleaned up')
console.log('     → Each subscription keeps updating state')
console.log('     → Multiply 1000s of rows × multiple listeners')
console.log('     → Solution: Unsubscribe when tab changes\n')

console.log('  3. CIRCULAR REFERENCES in component state')
console.log('     → Objects referencing each other cause memory bloat')
console.log('     → Solution: Flatten data structure\n')

console.log('  4. VITE DEV SERVER with huge source map')
console.log('     → Source maps can be 50MB+ for large apps')
console.log('     → Solution: Disable source maps or use esbuild\n')

console.log('  5. OLD NODE PROCESSES still running')
console.log('     → Multiple dev servers accumulate memory')
console.log('     → Solution: Kill all node.exe processes\n')

console.log('═══════════════════════════════════════════════════════════════\n')
