import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";
import { escape } from "pretty-text/sanitizer";
const { run } = Ember;

export default {
  name: "discourse-graphviz",

  renderGraphs($containers) {
    $containers.each((_, container) => {
      const $container = $(container);

      // if the container content has not yet been replaced
      // do nothing
      if (!$container.find("svg").length) {
        this.renderGraph($container);
      }
    });
  },

  renderGraph($container) {
    const graphDefinition = $container.text().trim();
    const engine = $container.attr("data-engine");

    const $spinner = $("<div class='spinner tiny'></div>");
    $container.html($spinner);

    loadScript(
      "/plugins/discourse-graphviz/javascripts/@hpcc-js/wasm@0.3.14/dist/index.min.js"
    ).then(() => {
      $container.removeClass("is-loading");

      let hpccWasm = self["@hpcc-js/wasm"];
      hpccWasm.graphviz
        .layout(graphDefinition, "svg", engine)
        .then(svgChart => {
          $container.html(svgChart);
        })
        .catch(e => {
          // graphviz errors are very helpful so we just show them as is
          const $error = $(
            "<div class='graph-error'>" + escape(e.message) + "</div>"
          );
          $container.html($error);
        });
    });
  },

  initialize() {
    withPluginApi("0.8.22", api => {
      api.decorateCooked(
        $elem => {
          if (!Discourse.SiteSettings.discourse_graphviz_enabled) {
            return;
          }

          const $graphviz = $elem.find(".graphviz");
          if ($graphviz.length) {
            run.debounce(this, this.renderGraphs, $graphviz, 200);
          }
        },
        { id: "graphviz" }
      );
    });
  }
};
