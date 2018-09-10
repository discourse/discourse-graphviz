import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-graphviz",

  initialize(container) {
    withPluginApi("0.8.22", api => {
      api.decorateCooked($elem => {
        // loadScript("/plugins/discourse-graphviz/javascripts/viz-1.8.2.js");
      });
    });
  }
};
