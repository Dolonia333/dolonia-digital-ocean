import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'public', 'sample-invoice.html')

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('File not found')
      return
    }

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(data)
  })
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Invoice preview server running at http://localhost:${PORT}/`)
})
