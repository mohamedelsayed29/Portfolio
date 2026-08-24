import { Component } from 'react'
import { Button } from '@components/ui'

const STRINGS = {
  en: {
    title: 'Something went wrong',
    body: 'The page hit an unexpected error. Reloading usually clears it.',
    retry: 'Try again',
  },
  ar: {
    title: 'حدث خطأ ما',
    body: 'واجهت الصفحة خطأً غير متوقع، وإعادة التحميل عادةً ما تحلّ المشكلة.',
    retry: 'حاول مرة أخرى',
  },
}

/**
 * This boundary sits OUTSIDE the providers, so useLanguage() is unavailable —
 * read the persisted choice (JSON-encoded by useLocalStorage) directly and
 * never let the read itself throw.
 */
function storedLanguage() {
  try {
    return window.localStorage.getItem('portfolio:language')?.includes('ar') ? 'ar' : 'en'
  } catch {
    return 'en'
  }
}

/** Last line of defence — a render crash should not blank the whole site. */
export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state

    if (!error) return this.props.children

    const language = storedLanguage()
    const isArabic = language === 'ar'
    const s = STRINGS[language]

    return (
      <div
        lang={language}
        dir={isArabic ? 'rtl' : 'ltr'}
        className="grid min-h-screen place-items-center px-6 text-center"
      >
        <div className="flex max-w-md flex-col items-center gap-5">
          {/* Arabic is a connected script — no negative tracking, and the crash may
              happen before <html lang="ar"> (and its global reset) is ever set. */}
          <h1 className={`text-[32px] font-semibold ${isArabic ? '' : 'tracking-[-0.02em]'}`}>
            {s.title}
          </h1>
          <p className="text-[17px] text-text-muted">{s.body}</p>
          <Button onClick={this.handleReset}>{s.retry}</Button>
        </div>
      </div>
    )
  }
}
