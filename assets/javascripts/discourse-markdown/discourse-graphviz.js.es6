export function setup(helper) {
  if (!helper.markdownIt) {
    return;
  }

  helper.whiteList(["div.graphviz", "div.graphviz.is-loading"]);

  helper.registerOptions((opts, siteSettings) => {
    opts.features.graphviz = siteSettings.discourse_graphviz_enabled;
  });

  helper.registerPlugin(md => {
    if (md.options.discourse.features.graphviz) {
      md.inline.bbcode.ruler.push("graphviz", {
        tag: "graphviz",

        replace: function(state, tagInfo, content) {
          const engines = ["dot", "neato", "circo", "fdp", "osage", "twopi"];
          const token = state.push("html_raw", "", 0);

          // remove comments
          content = content.replace(/^\s*?\/\/.*$/m, "");

          const escaped = state.md.utils.escapeHtml(
            content.replace(/[\r\n\t]/g, "")
          );
          const inputEngine = state.md.utils.escapeHtml(tagInfo.attrs.engine);
          const engine = engines.includes(inputEngine)
            ? `data-engine='${inputEngine}'`
            : "data-engine='dot'";

          token.content = `<div class="graphviz is-loading" ${engine}>\n${escaped}\n</div>\n`;

          return true;
        }
      });
    }
  });
}
