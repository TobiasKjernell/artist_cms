type IconName = 'left' | 'right' | 'up' | 'down' | 'close' | 'plus' | 'external'

const paths: Record<IconName, string> = {
  left: 'M10 3 5 8l5 5',
  right: 'M6 3l5 5-5 5',
  up: 'M3 10l5-5 5 5',
  down: 'M3 6l5 5 5-5',
  close: 'M3.5 3.5l9 9M12.5 3.5l-9 9',
  plus: 'M8 3v10M3 8h10',
  external: 'M6 3H3v10h10v-3M9 3h4v4M13 3 7 9',
}

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
