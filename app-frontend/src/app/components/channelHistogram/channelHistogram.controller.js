export default class ChannelHistogramController {
    constructor() {
        'ngInject';
    }

    $onInit() {
        this.histOptions = {
            chart: {
                type: 'lineChart',
                showLegend: false,
                showXAxis: false,
                showYAxis: false,
                interactive: false,
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                height: 100,
                xAxis: {
                    showLabel: false
                },
                yAxis: {
                    showLabel: false
                }
            }
        };

        if (this.data) {
            this.histData = Array.from(this.data);
        }
    }

    $onChanges(changesObj) {
        if ('data' in changesObj && changesObj.data.currentValue) {
            this.histData = Array.from(changesObj.data.currentValue);
        }
    }
}
