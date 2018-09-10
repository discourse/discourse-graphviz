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
        const token = state.push("html_raw", "", 0);
        const escaped = state.md.utils.escapeHtml(
          content.replace(/[\r\n\t]/g, "")
        );
        token.content = `<div class="graphviz is-loading">\n${escaped}\n</div>\n`;
        return true;
      }
    });
  });
}
