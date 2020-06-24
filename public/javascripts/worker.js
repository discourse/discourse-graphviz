// There is no document in a worker but @hpcc-js/wasm expects a document object
// so we work around the problem by declaring the document here.
const document = {
  currentScript: {
    src: undefined
  }
};

self.addEventListener("message", event => {
  const data = event.data;

  if (data.scriptURL) {
    document.currentScript.src = data.scriptURL;
    importScripts(data.scriptURL);
  } else if (data.engine) {
    let hpccWasm = self["@hpcc-js/wasm"];

    hpccWasm.graphviz
      .layout(data.graphDefinition, "svg", data.engine)
      .then(svgChart => {
        self.postMessage({ svgChart });
      })
      .catch(e => {
        self.postMessage({ errorMessage: e.message });
      });
  }
});
