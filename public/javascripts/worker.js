const scriptURL =
  "/plugins/discourse-graphviz/javascripts/@hpcc-js/wasm@0.3.14/dist/index.min.js";

// There is no document in a worker but @hpcc-js/wasm expects a document object
// so we work around the problem by declaring the document here.
const document = {
  currentScript: {
    src: scriptURL
  }
};

importScripts(scriptURL);

self.addEventListener("message", event => {
  const data = event.data;
  let hpccWasm = self["@hpcc-js/wasm"];

  hpccWasm.graphviz
    .layout(data.graphDefinition, "svg", data.engine)
    .then(svgChart => {
      self.postMessage({ svgChart });
    })
    .catch(e => {
      self.postMessage({ errorMessage: e.message });
    });
});
