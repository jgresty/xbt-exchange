const hmr = process.argv.includes('--hmr');

export default ({
  nodeResolve: true,
  open: '/',
  watch: !hmr,
});
