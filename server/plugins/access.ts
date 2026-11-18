import { definePlugin } from 'nitro'
import { syncCustomerAccess } from '../../src/modules/customers/access.server'
export default definePlugin((app) => {
  if (process.env.TOKENMAXXING_DISABLE_ACCESS_SYNC === 'true') return
  const run = () => {
    void syncCustomerAccess()
      .then((result) => {
        if (result.failures)
          console.error('Access sync: some customer keys could not be updated')
      })
      .catch(() =>
        console.error('Access sync unavailable; retrying next cycle'),
      )
  }
  run()
  const timer = setInterval(run, 30000)
  timer.unref?.()
  app.hooks.hook('close', () => {
    clearInterval(timer)
  })
})
