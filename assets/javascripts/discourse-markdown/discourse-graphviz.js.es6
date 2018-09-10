export function setup(helper) {
  if (!helper.markdownIt) {
    return;
  }

  helper.registerOptions((opts, siteSettings) => {
    opts.features.graphviz = siteSettings.discourse_graphviz_enabled;
  });

  helper.whiteList(["div.graphviz"]);

  helper.registerPlugin(md => {
    md.inline.bbcode.ruler.push("graphviz", {
      tag: "graphviz",

      replace: function(state, tagInfo, content) {
        // version 2.0.0
        // const workerURL =
        //   "/plugins/discourse-graphviz/javascripts/lite.render.js";
        // let viz = new Viz({ workerURL });

        const token = state.push("html_raw", "", 0);
        token.content = `<div class="graphviz">\n${content}\n</div>\n`;

        // version 1.8.2
        // const result = Viz(content, { engine: "dot" });
        // token.content = `<div class="graphviz">\n${result}\n</div>\n`;

        // version 2.0.0
        // viz.renderSVGElement(content).then(function(element) {
        //   document
        //     .getElementById("reply-control")
        //     .getElementsByClassName("graphviz")[0]
        //     .appendChild(element);
        //   token.content = `<div class="graphviz">\n${element}\n</div>\n`;
        // });

        return true;
      }
    });
  });
}
