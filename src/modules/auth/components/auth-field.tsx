import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { ComponentProps } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'

type AuthFieldProps = ComponentProps<'input'> & {
  label: string
  icon: LucideIcon
  hint?: string
}

export function AuthField({
  label,
  icon: Icon,
  hint,
  id,
  type = 'text',
  ...props
}: AuthFieldProps) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="space-y-2">
      <Label
        className="text-[13px] leading-normal text-[#243e34] lg:text-xs"
        htmlFor={id}
      >
        {label}
      </Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-[#7d8976]"
          size={18}
          aria-hidden="true"
        />
        <Input
          {...props}
          id={id}
          type={isPassword && visible ? 'text' : type}
          className={`h-13 rounded-[10px] border-[#dfe4d9] bg-white py-3 pl-11 text-base text-[#243e34] shadow-xs placeholder:text-[#858f7e] focus-visible:border-[#6b8f60] focus-visible:ring-[#6b8f60]/20 lg:h-12.5 lg:text-[13px] ${isPassword ? 'pr-12' : 'pr-4'}`}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        {isPassword && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md text-[#718069] hover:bg-[#eff3e9] hover:text-[#365e30] focus-visible:ring-[#6b8f60]/30"
            type="button"
            aria-label={
              visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
            }
            aria-pressed={visible}
            aria-controls={id}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        )}
      </div>
      {hint && (
        <span
          className={`block text-[11px] leading-relaxed lg:text-[10px] ${props['aria-invalid'] ? 'text-destructive' : 'text-[#737e69]'}`}
          id={`${id}-hint`}
        >
          {hint}
        </span>
      )}
    </div>
  )
}
