import React from "react"

export default class XYSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xAxis: 'baseline',
            yAxis: 'our',
            options: []
        }
        this.renderOptions = this.renderOptions.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    renderOptions() {
        if (this.props.data == null) {
            return ''
        }

        let results = this.props.data[this.props.currentCategory];
        if (results.length == 0) {
            return ''
        }
        let options = Object.keys(results[0].most_recent_result);
        this.state.options = options;

        let fa = $('#filter-form-attribute');
        fa.children().remove();
        return options.map(function(op, index){
            fa.append($('<option>', {
                value: op,
                text: op,
            }));
            return <option value={op} key={'xyselector-'+op}>{op}</option>
        });

    }

    handleChange(event) {
        if (event.target.id == 'XSelector') {
            this.setState({xAxis: event.target.value});
            this.props.rootThis.setState({xAxis: event.target.value});
        } else {
            this.setState({yAxis: event.target.value});
            this.props.rootThis.setState({yAxis: event.target.value});
        }
    }

    componentDidUpdate() {
        if (this.state.options.includes(this.state.xAxis) == false) {
            this.setState({xAxis: 'baseline'});
            this.props.rootThis.setState({xAxis: 'baseline'});
        }
        if (this.state.options.includes(this.state.yAxis) == false) {
            this.setState({yAxis: 'our'});
            this.props.rootThis.setState({yAxis: 'our'});
        }
    }

    render() {
        return (
            <div id="xySelectorWrapper">
                <label htmlFor="xAxis">X Axis</label>
                <select name="xAxis" id="XSelector" value={this.state.xAxis} onChange={this.handleChange}>
                    {this.renderOptions()}
                </select>
                <label htmlFor="yAxis">Y Axis</label>
                <select name="yAxis" id="YSelector" value={this.state.yAxis} onChange={this.handleChange}>
                    {this.renderOptions()}
                </select>
            </div>
        )
    }
}