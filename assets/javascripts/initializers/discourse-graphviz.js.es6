import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-graphviz",

  renderGraph($graphContainer) {
    const graphDefinition = $graphContainer.text();
    const engine = $graphContainer.attr("data-engine");
    const $spinner = $("<div class='spinner'></div>");
    $graphContainer.empty().append($spinner);

    loadScript("/plugins/discourse-graphviz/javascripts/viz-1.8.2.js").then(
      () => {
        $spinner.remove();
        $graphContainer.removeClass("is-loading");

        try {
          const svgChart = Viz(graphDefinition, {
            format: "svg",
            engine
          });

          $graphContainer.html(svgChart);
        } catch (e) {
          // don't throw error if Viz syntax is wrong as user is typing
          // console.log(e);
        }
      }
    );
  },

  initialize(container) {
    withPluginApi("0.8.22", api => {
      api.decorateCooked($elem => {
        const $graphviz = $elem.find(".graphviz");

        if (
          $graphviz.length &&
          Discourse.SiteSettings.discourse_graphviz_enabled
        ) {
          $graphviz.each((_, graphNodeContainer) => {
            const $graphNodeContainer = $(graphNodeContainer);

            // if the container content has not yet been replaced
            // do nothing
            if (!$graphNodeContainer.find("svg").length) {
              this.renderGraph($graphNodeContainer);
            }
          });
        }
      });
    });
  }
};
