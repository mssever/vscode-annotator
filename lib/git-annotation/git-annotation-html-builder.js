
'use strict';

class GitAnnotationHtmlBuilder {

    addCss(css) {
        this._css = css;
    }

    addScript(script) {
        this._script = script;
    }

    addSafeBody(safeBodyHtml) {
        this._safeBodyHtml = safeBodyHtml;
    }

    getHtml() {
        return [
            /* eslint-disable indent */
            `<style>${this._css}</style>`,
            '<body>',
                this._safeBodyHtml,
                `<script type="text/javascript">${this._script}</script>`,
            '</body>'
            /* eslint-enable indent */
        ].join('');
    }
}

module.exports = GitAnnotationHtmlBuilder;
