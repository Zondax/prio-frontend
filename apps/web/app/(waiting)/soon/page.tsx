import GenerativeBackground from '@/components/teaser/generative-background'
import { GlitchLink } from '@/components/teaser/glitch-link'
import { Card } from '@/components/ui/card'

export default function WaitingPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <GenerativeBackground />
      <div className="grow flex items-center justify-center">
        <div className="max-w-xl w-[90%] mx-auto text-center">
          <Card className="p-10 backdrop-blur-xs bg-background/80">
            <h1 className="text-4xl font-bold mb-4">See you soon!</h1>
          </Card>
        </div>
      </div>
      <footer className="relative mt-auto p-4 z-10 flex justify-between items-center">
        <GlitchLink href="https://zondax.ch/terms-of-use">Terms and conditions</GlitchLink>
        <GlitchLink href="/">What is prio?</GlitchLink>
      </footer>
    </div>
  )
}
