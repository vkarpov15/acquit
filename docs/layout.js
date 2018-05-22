module.exports = props => `
<html>
  <head>
    <title>Acquit v${props.version}: ${props.subtitle}</title>

    <link href="https://fonts.googleapis.com/css?family=Philosopher" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans+Mono" rel="stylesheet">
    <link href="/docs/style.css" rel="stylesheet">
  </head>

  <body>
    ${props.content}
  </body>
</html>
`.trim();
