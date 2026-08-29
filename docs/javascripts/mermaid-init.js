document$.subscribe(function() {
  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: true });
  }
});
