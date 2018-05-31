module.exports = props => `
<header>
  <div class="header">
    <div class="brand">
      <b><a href="/index.html">acquit</a></b>
    </div>
    <div class="links">
      <a href="/index.html" class="${getClassName(props, 'index.html')}">Home</a>
      <a href="/docs/examples.html" class="${getClassName(props, 'docs/examples.html')}">Examples</a>
      <a href="/docs/plugins.html" class="${getClassName(props, 'docs/plugins.html')}">Plugins</a>
    </div>
  </div>
</header>
`;

const getClassName = (props, path) => {
  if (props.path === path) {
    return 'selected';
  }
  return '';
};
