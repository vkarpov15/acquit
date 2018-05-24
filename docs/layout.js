const navbar = require('./navbar');

module.exports = props => `
<html>
  <head>
    <title>Acquit v${props.version}: ${props.subtitle}</title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet">
    <link href="/docs/style.css" rel="stylesheet">

    <script type="text/javascript" src="/docs/native.js"></script>
  </head>

  <body>
    ${navbar(props)}
    <div class="content">
      ${props.content}
    </div>
    <script type="text/javascript">
      _native.init("CK7DT53Y", {
        targetClass: 'native-js',
        display: 'flex',
        visibleClass: 'native-show'
      });
    </script>
    <div class="native-js">
      <div class="native-sponsor">Sponsored by #native_company# — Learn More</div>
      <a href="#native_link#" class="native-flex">
        <style>
        .native-js {
          background: linear-gradient(-30deg, #native_bg_color#E5, #native_bg_color#E5 45%, #native_bg_color# 45%) #fff;
        }
        .native-details,
        .native-sponsor,
        .native-bsa {
          color: #native_color# !important;
        }
        .native-details:hover {
          color: #native_color_hover# !important;
        }
        .native-cta {
          color: #native_cta_color#;
          background-color: #native_cta_bg_color#;
        }
        .native-cta:hover {
          color: #native_cta_color_hover;
          background-color: #native_cta_bg_color_hover#;
        }
        </style>
        <div class="native-main">
          <img class="native-img" src="#native_logo#">
          <div class="native-details">
            <span class="native-company">#native_title#</span>
            <span class="native-desc">#native_desc#</span>
          </div>
        </div>
        <span class="native-cta">#native_cta#</span>
      </a>
    </div>
  </body>
</html>
`.trim();
