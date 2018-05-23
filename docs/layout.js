const navbar = require('./navbar');

module.exports = props => `
<html>
  <head>
    <title>Acquit v${props.version}: ${props.subtitle}</title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet">
    <link href="/docs/style.css" rel="stylesheet">
  </head>

  <body>
    ${navbar(props)}
    <div class="content">
      ${props.content}
    </div>
  </body>
</html>
`.trim();
