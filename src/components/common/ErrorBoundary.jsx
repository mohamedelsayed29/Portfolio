import { Component } from 'react'
import { Button } from '@components/ui'

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

    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div className="flex max-w-md flex-col items-center gap-5">
          <h1 className="text-[32px] font-semibold tracking-[-0.02em]">Something went wrong</h1>
          <p className="text-[17px] text-text-muted">
            The page hit an unexpected error. Reloading usually clears it.
          </p>
          <Button onClick={this.handleReset}>Try again</Button>
        </div>
      </div>
    )
  }
}
