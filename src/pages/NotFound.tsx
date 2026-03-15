import React from "react"
import { graphql, PageProps } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/atoms/SEO"

interface NotFoundProps extends PageProps {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
  }
}

const NotFoundPage: React.FC<NotFoundProps> = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={undefined} title={siteTitle}>
      <SEO title="404: Not Found" />
      <h1>Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default NotFoundPage