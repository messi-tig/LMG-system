 // Minimal mock auth service (dev)
 // Replace with real API calls later
 export async function loginService({ email, password }) {
   await new Promise(r => setTimeout(r, 300))
   if (!email || !password) throw new Error('Missing credentials')
   return {
     token: 'demo-token',
     user: { id: '1', name: 'Demo Merchant', email },
   }
 }
