
'use strict';

const _ = require('lodash');
const Color = require('./color');

class ColorPicker {

    constructor(params) {
        this._colors = params.colors.map(color => new Color(color));
        this._calculateScore = params.calculateScore;
    }

    giveColors(list) {
        const scores = list.map(this._calculateScore);
        const uniqScores = _.uniq(scores).sort();
        const colors = this._generateColors(uniqScores.length);
        return scores.map(score => {
            const index = uniqScores.findIndex(aScore => aScore === score);
            return colors[index].hexCode;
        });
    }

    _generateColors(numOfColorsToGenerate) {
        if (numOfColorsToGenerate === 1) return [this._colors[0]];
        const factor = (this._colors.length - 1) / (numOfColorsToGenerate - 1);
        return _.range(numOfColorsToGenerate).map(i => {
            const threshold = factor * i;
            const colorRangeIndex = Math.max(Math.ceil(threshold) - 1, 0);
            return this._pickColor(colorRangeIndex, threshold);
        });
    }

    _pickColor(colorRangeIndex, threshold) {
        return this._colors[colorRangeIndex]
            .blend(this._colors[colorRangeIndex + 1], threshold - colorRangeIndex);
    }

}

module.exports = ColorPicker;
