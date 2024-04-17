const logger = require('hexo-log').default({debug: true, silent: false})


const ejs = require('ejs')
const fs = require('fs')
const path = require("path");

/**
 * @param minutes {Number}
 * @return {String}
 */
function formatPlayTime(minutes) {
    if (minutes < 60) {
        return `${minutes} minutes`
    } else {
        const hour = (minutes / 60).toFixed(2)
        return `${hour} hour`
    }
}

const generator = async (locals, config) => {
    let gameData = []
    const {enable = false, appKey, steamId} = config.steam
    if (enable) {
        const cachePath = path.join(__dirname, 'steamcache.json');
        if (fs.existsSync(cachePath)) {
            gameData = JSON.parse(fs.readFileSync(cachePath, {encoding: "utf-8"}));
            logger.info(`total ${gameList.length} games collected from cache... `)
        } else {
            const SteamApi = await import('steamapi');
            const steam = new SteamApi.default(appKey)
            const gameList = await steam.getUserOwnedGames(steamId, {
                includeAppInfo: true, includeExtendedAppInfo: true
            });
            logger.info(`total ${gameList.length} games collected... `)
            const gameData = gameList.sort((a, b) => b.minutes - a.minutes)
                .map((item) => {
                    return {
                        coverURL: item.game.coverURL,
                        logoURL: item.game.logoURL,
                        name: item.game.name,
                        bg: item.game.backgroundURL,
                        playTime: formatPlayTime(item.minutes),
                        link: `https://store.steampowered.com/app/${item.game.id}/${item.game.name}`
                    }
                })
            fs.writeFileSync(cachePath, JSON.stringify(gameData), {encoding: "utf-8"})
        }

        const template = fs.readFileSync(path.join(__dirname, 'templates', 'games.ejs'), {encoding: "utf-8"});
        const html = ejs.render(template, {list: gameData})
        return {
            path: '/steam/index.html',
            data: {
                title: "我的游戏",
                content: html
            },
            layout: ['page']
        }
    }
    return {};
}
module.exports = generator;