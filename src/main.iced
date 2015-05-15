
colors = require('colors')

HELPTEXT = """

          Quickshot #{VERSION}
          ==============================

          Commands:
            quickshot configure                     Creates/Updates the configuration file in current directory
            quickshot theme                         Manage Shopify themes
            quickshot pages                         Manage Shopify pages
            quickshot                               Show this screen.

        """

exports.run = (argv) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)
  switch command
    when "configure"
      await require('./configure').run(argv, defer(err))
    when "theme"
      await require('./theme').run(argv, defer(err))
    when "pages"
      await require('./pages').run(argv, defer(err))
    else
      console.log HELPTEXT

  if err?
    console.log colors.red(err)

  process.exit()