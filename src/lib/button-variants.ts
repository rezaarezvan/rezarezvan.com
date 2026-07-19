// Vanilla button class generator (replaces the cva variants). The actual styles
// live in src/styles/buttons.css and are applied via these class names.
const variants = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
] as const
const sizes = ['default', 'sm', 'lg', 'icon'] as const

export type ButtonVariant = (typeof variants)[number]
export type ButtonSize = (typeof sizes)[number]

export function buttonVariants({
  variant = 'default',
  size = 'default',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}): string {
  return ['btn', `btn-${variant}`, `btn-size-${size}`, className]
    .filter(Boolean)
    .join(' ')
}
