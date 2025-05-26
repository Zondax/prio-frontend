// import { BODY_BASE_PADDING_REM, NAVBAR_HEIGHT_REM } from '@/config/ui'
// import { Icon } from '@/components/ui/icon';

export default function EmptyPage() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: 'calc(100vh - var(--topbar-height) - (var(--body-base-padding) * 2))',
      }}
    >
      <div className="text-center">Empty</div>
    </div>
  )
}
