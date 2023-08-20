const navbar = require('./navbar');

module.exports = props => `
<html>
  <head>
    <title>Acquit v${props.version}: ${props.subtitle}</title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet">
    <link href="/docs/style.css" rel="stylesheet">

    <meta name="twitter:card" content="Acquit lets you generate documentation from BDD tests written for test runners like Mocha and Jasmine."></meta>
    <meta property="og:title" content="Acquit ${props.version}: ${props.subtitle}"></meta>
    <meta property="og:description" content="Acquit lets you generate documentation from BDD tests written for test runners like Mocha and Jasmine."></meta>
    <meta property="og:image" content="http://acquit.mongoosejs.io/logo.svg"></meta>

    <script type="text/javascript" src="//m.servedby-buysellads.com/monetization.custom.js"></script>
  </head>

  <body>
    ${navbar(props)}
    <div class="content">
      ${props.content}
    </div>
    <div id="native-fixed-js"></div>
    <script>
    (function() {
      if (typeof _bsa !== 'undefined' && _bsa) {
        _bsa.init('custom', 'CK7DT53Y', 'placement:mongoosejsio', {
          target: '#native-fixed-js',
          template: \`
    <div style="background-color: ##backgroundColor##" class="native-fixed">
      <a style="color: ##textColor##" class="native-link" href="##link##">
        <div class="native-sponsor" style="background-color: ##textColor##; color: ##backgroundColor##">Sponsor</div>
        <div class="native-text">##company## — ##description##</div>
      </a>
    </div>
        \`
        });
      }
    })();
    </script>
  </body>
</html>
`.trim();
