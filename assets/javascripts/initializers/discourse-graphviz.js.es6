import { withPluginApi } from "discourse/lib/plugin-api";
import { escape } from "pretty-text/sanitizer";
import { getURLWithCDN } from "discourse-common/lib/get-url";
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

    loadScript("/plugins/discourse-graphviz/javascripts/viz-1.8.2.js").then(
      () => {
        $container.removeClass("is-loading");

        try {
          /* global Viz */
          const svgChart = Viz(graphDefinition, {
            format: "svg",
            engine
          });
          $container.html(svgChart);
        } catch (e) {
          // graphviz error are unhelpful so we just show a default error
          const $error = $(
            "<div class='graph-error'>Error while rendering graph.</div>"
          );
          $container.html($error);
        }
      }
    );
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
