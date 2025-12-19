import { RedirectType, permanentRedirect } from 'next/navigation'

export default function Home() {
  permanentRedirect('/auth/login', RedirectType.replace)
}
