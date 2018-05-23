module.exports = props => `
<header>
  <div class="header">
    <div class="brand">
      <b>acquit</b>
    </div>
    <div class="links">
      <a href="/index.html" class="${getClassName(props, 'index.html')}">Home</a>
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
