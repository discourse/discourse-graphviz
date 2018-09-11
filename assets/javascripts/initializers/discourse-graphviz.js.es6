import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-graphviz",

  initialize(container) {
    withPluginApi("0.8.22", api => {
      api.decorateCooked($elem => {
        const $graphviz = $elem.find(".graphviz");
        const engines = ["dot", "neato", "circo", "fdp", "osage", "twopi"];

        if (
          $graphviz.length &&
          Discourse.SiteSettings.discourse_graphviz_enabled
        ) {
          $graphviz.each(function(index) {
            const graphDefinition = $(this).text();
            const engine = engines.includes($(this).data("engine"))
              ? $(this).data("engine")
              : "dot";

            const $spinner = $("<div class='spinner'></div>");
            $(this)
              .empty()
              .append($spinner);

            loadScript(
              "/plugins/discourse-graphviz/javascripts/viz-1.8.2.js"
            ).then(() => {
              const svgChart = Viz(graphDefinition, {
                format: "svg",
                engine: engine
              });

              $spinner.remove();

              $(this)
                .removeClass("is-loading")
                .html(svgChart);
            });
          });
        }
      });
    });
  }
};
