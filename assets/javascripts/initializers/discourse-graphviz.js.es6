import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";
import { escape } from "pretty-text/sanitizer";
const { run } = Ember;
let worker = undefined;

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

    if (worker === undefined) {
      worker = new Worker("/plugins/discourse-graphviz/javascripts/worker.js");
    }

    worker.addEventListener("message", event => {
      const data = event.data;
      $container.removeClass("is-loading");

      if (data.svgChart) {
        $container.html(data.svgChart);
      } else {
        // graphviz errors are very helpful so we just show them as is
        const $error = $(
          "<div class='graph-error'>" + escape(data.errorMessage) + "</div>"
        );
        $container.html($error);
      }
    });

    worker.postMessage({ graphDefinition, engine });
  },

  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");

    if (siteSettings.discourse_graphviz_enabled) {
      withPluginApi("0.8.22", api => {
        api.decorateCooked(
          $elem => {
            const $graphviz = $elem.find(".graphviz");
            if ($graphviz.length) {
              run.debounce(this, this.renderGraphs, $graphviz, 200);
            }
          },
          { id: "graphviz" }
        );
      });
    }
  }
};
