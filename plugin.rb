# frozen_string_literal: true

# name: discourse-graphviz
# about: Graphviz
# version: 0.0.1
# authors: Maja Komel, Joffrey Jaffeux
# url: https://github.com/discourse/discourse-graphviz

enabled_site_setting :discourse_graphviz_enabled

register_asset "stylesheets/common/graphviz.scss"

after_initialize do

  def context
    context = MiniRacer::Context.new
    context.load("#{Rails.root}/plugins/discourse-graphviz/public/javascripts/viz-1.8.2.js")
    context
  end

  DiscourseEvent.on(:before_post_process_cooked) do |doc, post|
    if SiteSetting.discourse_graphviz_enabled

      doc.css('div.graphviz:not(.graphviz-svg)').each do |graph|
        engine = graph.attribute('data-engine').value
        svg_graph = context.eval("Viz('#{graph.children[0].content.gsub(/[\r\n\t]/, "")}', {engine: '#{engine}'})")

        tmp_svg = Tempfile.new(["svgfile", ".svg"])
        tmp_png = Tempfile.new(["vizgraph-", ".png"])

        tmp_svg.write(svg_graph)
        tmp_svg.rewind

        graph_title = Nokogiri.parse(svg_graph).at("//comment()[contains(.,'Title')]").content.match(/Title:\s(?<title>.+)\sPages:/)[:title]
        filename = graph_title != "%0" ? graph_title : File.basename(tmp_png.path)

        Discourse::Utils.execute_command('convert', '-density', '300', tmp_svg.path, tmp_png.path)

        upload = UploadCreator.new(tmp_png, filename).create_for(-1)

        # replace div.gaphviz with image node
        new_graph_node = Nokogiri::XML::Node.new("img", doc)
        new_graph_node['src'] = upload.url
        new_graph_node['alt'] = filename
        graph.replace new_graph_node

        tmp_svg.close!
        tmp_png.close!
      end
    end
  end
end
