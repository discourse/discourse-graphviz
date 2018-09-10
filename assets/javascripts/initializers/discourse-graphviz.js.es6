import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-graphviz",

  initialize(container) {
    withPluginApi("0.8.22", api => {
      api.decorateCooked($elem => {
        const $graphviz = $elem.find(".graphviz");
        if ($graphviz.length) {
          const graphDefinition = $graphviz.text();
          const $spinner = $("<div class='spinner'></div>");
          $graphviz.empty().append($spinner);

          loadScript(
            "/plugins/discourse-graphviz/javascripts/viz-1.8.2.js"
          ).then(() => {
            const svgChart = Viz(graphDefinition, {
              format: "svg",
              engine: "dot"
            });

            $spinner.remove();

            $graphviz.removeClass("is-loading").html(svgChart);
          });
        }
      });
    });
  }
};
