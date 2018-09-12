export function setup(helper) {
  if (!helper.markdownIt) {
    return;
  }

  helper.registerOptions((opts, siteSettings) => {
    opts.features.graphviz = siteSettings.discourse_graphviz_enabled;
  });

  helper.whiteList(["div.graphviz", "div.graphviz.is-loading"]);

  helper.registerPlugin(md => {
    md.inline.bbcode.ruler.push("graphviz", {
      tag: "graphviz",

      replace: function(state, tagInfo, content) {
        const engines = ["dot", "neato", "circo", "fdp", "osage", "twopi"];

        const token = state.push("html_raw", "", 0);
        const escaped = state.md.utils.escapeHtml(
          content.replace(/[\r\n\t]/g, "")
        );
        const bbEngine = tagInfo.attrs.engine;
        const engine = engines.includes(bbEngine)
          ? `data-engine='${bbEngine}'`
          : "data-engine='dot'";

        token.content = `<div class="graphviz is-loading" ${engine}>\n${escaped}\n</div>\n`;

        return true;
      }
    });
  });
}
