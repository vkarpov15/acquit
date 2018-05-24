module.exports = props => `
<div class="hero">
  <div class="left">
    <img class="logo" src="/logo.svg">
  </div>
  <div class="right">
    <div class="title">
      <h1>acquit <code>v${props.version}</code></h1>
    </div>
    <div class="tagline">
      Parse <a href="https://mochajs.org/#hooks">BDD</a> tests to
      generate documentation
    </div>
    <div class="cta">
      <button>
        <a href="/bin/index.html">read the docs</a>
      </button>
      <button>
        <a href="https://github.com/vkarpov15/acquit">follow on github</a>
      </button>
    </div>
    <div class="social">
      <iframe
        class="github-btn"
        src="http://ghbtns.com/github-btn.html?user=vkarpov15&repo=acquit&type=watch&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="90px" height="20px">
      </iframe>
      <iframe
        class="github-btn"
        src="http://ghbtns.com/github-btn.html?user=vkarpov15&repo=acquit&type=fork&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="90px" height="20px">
      </iframe>
    </div>
  </div>
</div>
<div class="boxes">
  <div id="parse">
    <h3>Parse Mocha Tests</h3>
    The core <a href="https://www.npmjs.com/package/acquit">acquit module</a>
    is a lightweight parser that parses BDD test syntax and comments into a
    usable format for plugins.
  </div>
  <div id="transpile">
    <h3>Transpile Tests into Markdown</h3>
    The <a href="https://www.npmjs.com/package/acquit-markdown">acquit-markdown plugin</a>
    converts BDD test files into <a href="https://en.wikipedia.org/wiki/Markdown">markdown</a>.
    If you already have BDD tests and comments, acquit-markdown gives you
    documentation with a single command.
  </div>
  <div id="include">
    <h3>Import Test Code into HTML</h3>
    The <a href="https://www.npmjs.com/package/acquit-require">acquit-require plugin</a>
    lets you import the source code of a BDD test into HTML or markdown. Take
    your existing documentation, move the examples to a test file, and let your
    test runner verify your examples.
  </div>
  <div style="clear:both"></div>
</div>
`.trim();
