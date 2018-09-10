# name: discourse-graphviz
# about: Graphviz
# version: 0.0.1
# authors: Discourse
# url: https://github.com/

enabled_site_setting :discourse_graphviz_enabled

register_asset "javascripts/lib/viz-1.8.2.js"
register_asset "stylesheets/common/graphviz.scss"

after_initialize do

  DiscourseEvent.on(:before_post_process_cooked) do |doc, post|

    # this is using vizgraph cli
    # doc.css('div.graphviz').each do |graph|
    #   tmp_dot = Tempfile.new(["dotfile", ".dot"])
    #   tmp_png = Tempfile.new(["pngfile", ".png"])
    #
    #   tmp_dot.write(graph.children[0].text)
    #   tmp_dot.rewind
    #
    #   Discourse::Utils.execute_command('dot', '-Tpng', tmp_dot.path, '-o', tmp_png.path)
    #
    #   upload = UploadCreator.new(tmp_png, File.basename(tmp_png.path)).create_for(-1)
    #
    #   new_node = Nokogiri::XML::Node.new("img", doc)
    #   new_node['src'] = upload.url
    #
    #   graph.replace new_node
    # end

    # this is using viz 1.8.2 api
    context = MiniRacer::Context.new
    context.load("#{Rails.root}/plugins/discourse-graphviz/assets/javascripts/lib/viz-1.8.2.js")

    doc.css('div.graphviz').each do |graph|
      svg_graph = context.eval("Viz('#{graph.children[0].content.gsub(/[\r\n\t]/, "")}')")

      tmp_svg = Tempfile.new(["svgfile", ".svg"])
      tmp_png = Tempfile.new(["pngfile", ".png"])

      tmp_svg.write(svg_graph)
      tmp_svg.rewind

      Discourse::Utils.execute_command('convert', tmp_svg.path, tmp_png.path)

      upload = UploadCreator.new(tmp_png, File.basename(tmp_png.path)).create_for(-1)

      new_node = Nokogiri::XML::Node.new("img", doc)
      new_node['src'] = upload.url

      graph.replace new_node

      tmp_svg.unlink rescue nil
      tmp_png.unlink rescue nil
    end

  end

end
