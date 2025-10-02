module.exports = {
  PanelGroup: (props) => {
    return <div data-testid="mock-panel-group" {...props} />;
  },
  Panel: (props) => {
    return <div data-testid="mock-panel" {...props} />;
  },
  PanelResizeHandle: (props) => {
    return <div data-testid="mock-resize-handle" {...props} />;
  },
};