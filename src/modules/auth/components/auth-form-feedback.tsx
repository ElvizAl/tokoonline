import { Info } from 'lucide-react'
import { Alert, AlertDescription } from '#/components/ui/alert'

export function AuthFormFeedback({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite">
      {message && (
        <Alert
          role="presentation"
          className="rounded-[10px] border-[#dce4d1] bg-[#f0f4e9] px-3 py-2.5 text-[#4d6544]"
        >
          <Info size={16} aria-hidden="true" />
          <AlertDescription className="text-[11px] leading-relaxed text-[#4d6544]">
            {message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
