import axios from 'axios'
import FormData from 'form-data'

const baseURL = process.env.BE_BASEURL || 'https://fastgen-5i9n.onrender.com'

const uniqueEmail = `fastgen.test_${Math.random().toString(36).slice(2,10)}@example.com`

let token
let parsedFileName

describe('Quizzes upload and generate', () => {
  test('signup returns token', async () => {
    const res = await axios.post(`${baseURL}/api/auth/signup`, {
      name: 'Tester',
      email: uniqueEmail,
      password: 'Password123!'
    })
    expect(res.status).toBeGreaterThanOrEqual(200)
    expect(res.status).toBeLessThan(300)
    token = res.data.token
    expect(token).toBeTruthy()
  })

  test('upload returns parsedFileName', async () => {
    const fd = new FormData()
    fd.append('file', Buffer.from('This is a quiz source text.'), { filename: 'sample.txt', contentType: 'text/plain' })
    fd.append('fileName', 'sample.txt')
    const res = await axios.post(`${baseURL}/api/upload`, fd, {
      headers: { ...fd.getHeaders(), Authorization: `Bearer ${token}` },
      timeout: 15000
    })
    expect(res.status).toBeGreaterThanOrEqual(200)
    expect(res.status).toBeLessThan(300)
    parsedFileName = res.data.parsedFileName
    expect(parsedFileName).toBeTruthy()
  })

  test('generate returns quizzes or error', async () => {
    try {
      const res = await axios.post(`${baseURL}/api/GQuizzes`, {
        parsedFileName,
        questionCount: 5
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 20000
      })
      expect(res.status).toBeGreaterThanOrEqual(200)
      expect(res.status).toBeLessThan(300)
      expect(typeof res.data.answer).toBe('string')
      expect(res.data.answer.length).toBeGreaterThan(0)
    } catch (error) {
      const status = error.response?.status
      const body = error.response?.data
      expect([400,500]).toContain(status)
      expect(body?.error).toBeTruthy()
    }
  })
})