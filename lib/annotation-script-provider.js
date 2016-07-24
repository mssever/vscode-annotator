
'use strict';

class AnnotationScriptProvider {

    constructor(params) {
        this._configStore = params.configStore;
    }

    provide() {
        const highlightColour = this._configStore.getExtensionConfig('annotationFocusColor');
        return `
            var stylesheet = document.styleSheets[0];
            var index = null;

            document.body.addEventListener('mouseenter', addCommitHighlightRule, true);
            document.body.addEventListener('mouseleave', removeCommitHighlightRule, true);

            function addCommitHighlightRule(event) {
                if (event.target.className !== 'annotation') return;
                var commitHash = event.target.attributes['data-commitHash'].value;
                var selectorText = '[data-commitHash="' + commitHash + '"]';
                var highlightRule = selectorText + ' {background-color: ${highlightColour};}';
                index = 0;
                stylesheet.insertRule(highlightRule, index);
            }

            function removeCommitHighlightRule(event) {
                if (event.target.className !== 'annotation') return;
                if (index !== null) {
                    stylesheet.deleteRule(index);
                    index = null;
                }
            }
        `;
    }
}

module.exports = AnnotationScriptProvider;