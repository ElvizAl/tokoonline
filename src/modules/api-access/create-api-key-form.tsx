import { useState } from 'react'
import type { FormEvent } from 'react'
import { createApiKeyServerFn } from './admin-keys.api'

export function CreateApiKeyForm({
  onCreated,
}: {
  onCreated: (key: { id: string; name: string }) => void
}) {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copyMessage, setCopyMessage] = useState('')

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const name = String(new FormData(form).get('keyName') ?? '').trim()
    if (!name) {
      setMessage('Isi nama API key terlebih dahulu.')
      return
    }
    setPending(true)
    setMessage('')
    setCopyMessage('')
    setCreatedKey(null)
    try {
      const result = await createApiKeyServerFn({ data: { name } })
      setMessage(result.message)
      if (result.success) {
        setCreatedKey(result.key.key)
        onCreated({ id: result.key.id, name: result.key.name })
        form.reset()
      }
    } catch {
      setMessage(
        'Pembuatan API key belum dapat dikonfirmasi. Muat ulang daftar key sebelum mencoba lagi.',
      )
    } finally {
      setPending(false)
    }
  }

  async function copy() {
    if (!createdKey) return
    try {
      await navigator.clipboard.writeText(createdKey)
      setCopyMessage('API key disalin.')
    } catch {
      setCopyMessage(
        'Tidak dapat menyalin otomatis. Pilih dan salin key secara manual.',
      )
    }
  }

  return (
    <section className="mb-6 rounded-2xl border border-[#e1e7e3] bg-white p-6">
      <h2 className="font-semibold">Buat API key</h2>
      <p className="mt-2 text-sm text-[#7a8980]">
        Buat key baru, lalu hubungkan ke akun pelanggan di bawah.
      </p>
      <form
        onSubmit={create}
        aria-busy={pending}
        className="mt-5 flex flex-wrap items-end gap-3"
      >
        <label className="min-w-0 flex-1 text-sm">
          Nama API key
          <input
            name="keyName"
            required
            maxLength={100}
            autoComplete="off"
            placeholder="Contoh: API pelanggan Budi"
            disabled={pending}
            className="mt-2 h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#95ae82]"
          />
        </label>
        <button
          disabled={pending}
          className="h-11 cursor-pointer rounded-lg bg-[#27583f] px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Membuat…' : 'Buat API key'}
        </button>
      </form>
      <p role="status" className="mt-3 text-sm">
        {message}
      </p>
      {createdKey && (
        <div className="mt-4 rounded-xl bg-[#f6f8f7] p-4">
          <label className="block text-sm font-medium">
            API key baru
            <input
              readOnly
              value={createdKey}
              autoComplete="off"
              spellCheck={false}
              onFocus={(event) => event.currentTarget.select()}
              className="mt-2 w-full rounded-lg border border-[#dce4de] bg-white p-3 font-mono text-xs"
            />
          </label>
          <p className="mt-2 text-xs text-[#7a8980]">
            Simpan key di tempat aman. Tampilan ini hilang saat meninggalkan
            halaman.
          </p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={copy}
              className="cursor-pointer rounded-lg border border-[#dce4de] px-4 py-2 text-xs"
            >
              Salin key
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatedKey(null)
                setCopyMessage('')
              }}
              className="cursor-pointer rounded-lg border border-[#dce4de] px-4 py-2 text-xs"
            >
              Sembunyikan key
            </button>
          </div>
          <p role="status" className="mt-2 text-xs">
            {copyMessage}
          </p>
        </div>
      )}
    </section>
  )
}
