import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { saveCustomerAccessServerFn, syncAccessServerFn } from './customers.api'
function dateValue(date: Date | null) {
  if (!date) return ''
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Pacific/Fiji',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(date))
  const get = (key: string) => parts.find((part) => part.type === key)?.value
  return `${get('year')}-${get('month')}-${get('day')}`
}
export function CustomerAccessPanel({
  customer,
}: {
  customer: {
    id: string
    isActive: boolean
    planName: string | null
    accessExpiresAt: Date | null
    tokenQuota: number | null
    blockedRouterKeyId: string | null
  }
}) {
  const router = useRouter()
  const [active, setActive] = useState(customer.isActive)
  const [name, setName] = useState(customer.planName ?? '')
  const [until, setUntil] = useState(dateValue(customer.accessExpiresAt))
  const [quota, setQuota] = useState(
    customer.tokenQuota === null ? '' : String(customer.tokenQuota),
  )
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    try {
      const result = await saveCustomerAccessServerFn({
        data: {
          userId: customer.id,
          isActive: active,
          planName: name,
          accessExpiresAt: until
            ? new Date(until + 'T23:59:59.999+12:00').toISOString()
            : null,
          tokenQuota: quota === '' ? null : Number(quota),
        },
      })
      setMessage(result.message)
      if (result.success) await router.invalidate()
    } catch {
      setMessage('Gagal menyimpan status atau paket.')
    } finally {
      setPending(false)
    }
  }
  async function sync() {
    setPending(true)
    try {
      const result = await syncAccessServerFn()
      setMessage(result.message)
      await router.invalidate()
    } catch {
      setMessage('Gagal sinkronisasi. Coba lagi.')
    } finally {
      setPending(false)
    }
  }
  return (
    <section className="mt-6 rounded-2xl border border-[#e1e7e3] bg-white p-6">
      <h2 className="font-semibold">Status akses dan paket</h2>
      <p className="mt-2 text-xs leading-5 text-[#7a8980]">
        Menonaktifkan akun mengakhiri sesi login dan menonaktifkan key terkait.
        Masa aktif dan kuota diperiksa setiap 30 detik selama server aktif.
      </p>
      <p className="mt-3 text-sm">
        Status:{' '}
        <strong>
          {!customer.isActive
            ? 'Akun dinonaktifkan'
            : customer.blockedRouterKeyId
              ? 'Key diblokir / menunggu sinkronisasi'
              : 'Akun aktif'}
        </strong>
      </p>
      <form
        className="mt-5 grid gap-5 sm:grid-cols-2"
        onSubmit={submit}
        aria-busy={pending}
      >
        <label className="text-sm sm:col-span-2">
          Pilih paket
          <select
            defaultValue="custom"
            className="mt-2 h-11 w-full rounded-lg border border-[#dce4de] px-3"
            onChange={(event) => {
              const value = event.target.value
              if (value === 'custom') return
              setName(value === 'starter' ? 'Starter' : 'Pro')
              setQuota(value === 'starter' ? '10000000' : '50000000')
              setUntil(dateValue(new Date(Date.now() + 30 * 86400000)))
            }}
          >
            <option value="custom">Custom</option>
            <option value="starter">Starter · 10 juta token · 30 hari</option>
            <option value="pro">Pro · 50 juta token · 30 hari</option>
          </select>
        </label>
        <label className="text-sm">
          Nama paket
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className="mt-2 h-11 w-full rounded-lg border border-[#dce4de] px-3"
          />
        </label>
        <label className="text-sm">
          Aktif sampai (akhir hari, Fiji)
          <input
            type="date"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-[#dce4de] px-3"
          />
          <span className="mt-1 block text-xs text-[#7a8980]">
            Kosongkan untuk tanpa tanggal berakhir.
          </span>
        </label>
        <label className="text-sm">
          Kuota 30 hari berjalan
          <input
            type="number"
            min={0}
            max={2147483647}
            step={1}
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            placeholder="Tanpa batas"
            className="mt-2 h-11 w-full rounded-lg border border-[#dce4de] px-3"
          />
          <span className="mt-1 block text-xs text-[#7a8980]">
            Termasuk penggunaan key sebelum paket dipilih. Memilih paket tidak
            mereset usage.
          </span>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Akun pelanggan aktif
        </label>
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button
            disabled={pending}
            className="rounded-lg bg-[#27583f] px-4 py-3 text-sm text-white disabled:opacity-50"
          >
            {pending ? 'Memproses…' : 'Simpan status dan paket'}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={sync}
            className="rounded-lg border border-[#dce4de] px-4 py-3 text-sm disabled:opacity-50"
          >
            Sinkronkan key sekarang
          </button>
        </div>
        <p role="status" className="text-sm sm:col-span-2">
          {message}
        </p>
      </form>
    </section>
  )
}
