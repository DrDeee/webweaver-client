const { JSDOM } = require('jsdom')
module.exports = {
    htmlToDocument: function(html) {
        return (new JSDOM(html)).window.document
    }
}