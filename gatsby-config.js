module.exports = {
  siteMetadata: {
    title: `Notes Clementino`,
    description: `Blog técnico sobre programação, AWS, Redshift e carreira de desenvolvedor`,
    author: `@vagnerclementino`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Notes Clementino`,
        short_name: `Notes`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        production: false,
        disable: false,
        openAnalyzer: false,
        analyzerMode: `static`,
        reportFilename: `bundle-report.html`,
        defaultSizes: `parsed`,
        generateStatsFile: false,
        statsFilename: `stats.json`,
        statsOptions: null,
        logLevel: `info`,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          `G-XXXXXXXXXX`,
        ],
        pluginConfig: {
          head: false,
          respectDNT: true,
          exclude: ["/preview/**", "/do-not-track/me/too/"],
        },
      },
    },
  ],
};