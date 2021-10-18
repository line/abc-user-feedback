import React from 'react'

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    chunkError: false
  }

  static getDerivedStateFromError(error: Error) {
    if (error.name === 'ChunkLoadError') {
      return {
        chunkError: true
      }
    }
    return { hasError: true }
  }
  componentDidCatch(error: Error, errorInfo: any) {
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error)
    }
  }

  handleResolveError = () => {
    this.setState({
      hasError: false
    })
  }
  render() {
    if (this.state.chunkError) {
      return <div>chunkError</div>
    }
    if (this.state.hasError) {
      return <div>hasError</div>
    }
    return <ErrorBoundary>{this.props.children}</ErrorBoundary>
  }
}

// type ErrorBoundaryWrapperProps = {
//   children: React.ReactNode
//   hasError: boolean
// }

// function ErrorBoundaryWrapper(props: ErrorBoundaryWrapperProps) {
//   const { isNotFound } = useNotFound()
//
//   if (isNotFound) {
//     return <NotFoundPage />
//   }
//
//   return <>{props.children}</>
// }

export default ErrorBoundary
