const logger = require('hexo-log').default({debug: true, silent: false})
const generator = require('./lib/generator')
const path = require("path");
const fs = require("fs");
const commandOpts = {
    options: [{
        name: '-u,--update', desc: 'force update steam game data'
    },]
}
hexo.extend.generator.register('steam', (locals) => {
    logger.info("loaded steam game plugin..")
    return generator(locals,hexo.config);
})
hexo.extend.console.register('steam', 'fetch steam game data', commandOpts, (args) => {

})
const css = hexo.extend.helper.get('css').bind(hexo)
