/* */
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Provider as StyletronProvider } from 'styletron-react'

/* */
import { styletron } from '~/styletron'

class FeedbackDocument extends Document {
  static async getInitialProps(context) {
    const renderPage = () =>
      context.renderPage({
        /*eslint-disable */
        enhanceApp: (App) => (props) =>
          (
            <StyletronProvider value={styletron}>
              <App {...props} />
            </StyletronProvider>
          )
      })

    const initialProps = await Document.getInitialProps({
      ...context,
      renderPage
    })

    const stylesheets = (styletron as any).getStylesheets?.() || []
    return { ...initialProps, stylesheets }
  }

  render() {
    return (
      <Html>
        <Head>
          {(this.props as any).stylesheets.map((sheet, i) => (
            <style
              className='_styletron_hydrate_'
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs['data-hydrate']}
              key={i}
            />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default FeedbackDocument
