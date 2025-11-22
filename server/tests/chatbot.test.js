import axios from 'axios'

const baseURL = process.env.BE_BASEURL || 'https://fastgen-5i9n.onrender.com'

const uniqueEmail = `fastgen.test_${Math.random().toString(36).slice(2,10)}@example.com`

let token
let chatId

describe('Chatbot endpoints', () => {
  test('signup returns token', async () => {
    const res = await axios.post(`${baseURL}/api/auth/signup`, {
      name: 'Tester',
      email: uniqueEmail,
      password: 'Password123!'
    })
    expect(res.status).toBeGreaterThanOrEqual(200)
    expect(res.status).toBeLessThan(300)
    expect(res.data.token).toBeTruthy()
    token = res.data.token
  })

  test('create chat returns chatId', async () => {
    const res = await axios.post(`${baseURL}/api/chats`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    expect(res.status).toBeGreaterThanOrEqual(200)
    expect(res.status).toBeLessThan(300)
    chatId = res.data.chatId || res.data._id || res.data.id
    expect(chatId).toBeTruthy()
  })

  test('non-stream generate returns answer or error', async () => {
    try {
      const res = await axios.post(`${baseURL}/api/gemini`, {
        chatId,
        prompt: 'hello',
        parsedFileName: ''
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000
      })
      expect(res.status).toBeGreaterThanOrEqual(200)
      expect(res.status).toBeLessThan(300)
      expect(typeof res.data.answer).toBe('string')
      expect(res.data.answer.length).toBeGreaterThan(0)
    } catch (error) {
      const status = error.response?.status
      const body = error.response?.data
      expect(status).toBe(500)
      expect(body?.error).toBeTruthy()
    }
  })
})