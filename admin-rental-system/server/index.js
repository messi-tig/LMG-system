const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const DATA_DIR = path.join(__dirname, 'data')
const MERCHANTS_FILE = path.join(DATA_DIR, 'merchants.json')

function ensureDataDir(){
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(MERCHANTS_FILE)) fs.writeFileSync(MERCHANTS_FILE, '[]')
}

function readMerchants(){
  ensureDataDir()
  const txt = fs.readFileSync(MERCHANTS_FILE, 'utf8')
  try { return JSON.parse(txt || '[]') } catch(e){ return [] }
}

function writeMerchants(arr){
  ensureDataDir()
  fs.writeFileSync(MERCHANTS_FILE, JSON.stringify(arr, null, 2))
}

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

// Basic health
app.get('/api/health', (req, res) => res.json({ ok: true, now: Date.now() }))

// List merchants
app.get('/api/merchants', (req, res) => {
  const merchants = readMerchants()
  res.json(merchants)
})

// Get merchant
app.get('/api/merchants/:id', (req, res) => {
  const id = Number(req.params.id)
  const merchants = readMerchants()
  const m = merchants.find(x => x.id === id)
  if (!m) return res.status(404).json({ error: 'Not found' })
  res.json(m)
})

// Create merchant
app.post('/api/merchants', (req, res) => {
  const { fullname, email, phone } = req.body || {}
  if (!fullname || !email) return res.status(400).json({ error: 'fullname and email are required' })
  const merchants = readMerchants()
  const id = Date.now()
  const merchant = { id, fullname, email, phone: phone || null, createdAt: new Date().toISOString() }
  merchants.push(merchant)
  writeMerchants(merchants)
  res.status(201).json(merchant)
})

// Update merchant
app.put('/api/merchants/:id', (req, res) => {
  const id = Number(req.params.id)
  const merchants = readMerchants()
  const idx = merchants.findIndex(x => x.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const { fullname, email, phone } = req.body || {}
  const updated = {
    ...merchants[idx],
    fullname: fullname || merchants[idx].fullname,
    email: email || merchants[idx].email,
    phone: typeof phone !== 'undefined' ? phone : merchants[idx].phone,
    updatedAt: new Date().toISOString()
  }
  merchants[idx] = updated
  writeMerchants(merchants)
  res.json(updated)
})

// Delete merchant
app.delete('/api/merchants/:id', (req, res) => {
  const id = Number(req.params.id)
  let merchants = readMerchants()
  const idx = merchants.findIndex(x => x.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  merchants = merchants.filter(x => x.id !== id)
  writeMerchants(merchants)
  res.status(204).end()
})

// Admin register (mock) - create admin user in memory
let adminUser = null
app.post('/api/admin/register', (req, res) => {
  const { name, email, password } = req.body || {}
  if (!name || !email || !password) return res.status(400).json({ error: 'name,email,password required' })
  adminUser = { id: Date.now(), name, email, password }
  res.status(201).json({ id: adminUser.id, name: adminUser.name, email: adminUser.email })
})

// Admin sign-in (mock)
app.post('/api/admin/signin', (req, res) => {
  const { email, password } = req.body || {}
  if (!adminUser) return res.status(401).json({ error: 'no admin' })
  if (adminUser.email === email && adminUser.password === password) return res.json({ token: 'mock-token' })
  return res.status(401).json({ error: 'invalid credentials' })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Admin API listening at http://localhost:${port}`))
