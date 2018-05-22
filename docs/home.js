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
`.trim();
