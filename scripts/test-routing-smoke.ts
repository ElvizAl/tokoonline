import assert from 'node:assert/strict'
import { prisma } from '../src/lib/db/prisma'
import { hashPassword } from 'better-auth/crypto'
const id = crypto.randomUUID(),
  email = id + '@tokenmaxxing.invalid',
  base = 'http://localhost:3053'
try {
  await prisma.user.create({
    data: {
      id,
      name: 'Routing fixture',
      email,
      role: 'USER',
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: id,
          providerId: 'credential',
          password: await hashPassword('routing-fixture-password'),
        },
      },
    },
  })
  const login = await fetch(base + '/api/auth/sign-in/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: new URL(process.env.BETTER_AUTH_URL || 'http://localhost:3000')
        .origin,
    },
    body: JSON.stringify({ email, password: 'routing-fixture-password' }),
  })
  assert.equal(login.status, 200)
  const cookie = login.headers
    .getSetCookie()
    .map((value) => value.split(';')[0])
    .join('; ')
  assert.ok(cookie)
  for (const path of [
    '/?period=all',
    '/api-access',
    '/settings',
  ]) {
    const response = await fetch(base + path, {
      headers: { cookie },
      redirect: 'manual',
    })
    const html = await response.text()
    assert.equal(response.status, 200, path)
    assert.ok(html.includes('Tokenmaxxing'), path)
    assert.equal(html.includes('Something went wrong'), false, path)
    console.log(JSON.stringify({ path, status: 'PASS' }))
  }
} finally {
  await prisma.user.deleteMany({ where: { id } })
  await prisma.$disconnect()
}
