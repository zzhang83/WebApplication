import React from "react"

export default class FilterItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: props.data,
            removeFilter: props.removeFilter
        };

        this.renderFilter = this.renderFilter.bind(this);
        this.generateFilter = this.generateFilter.bind(this);
    }

    generateFilter(filter) {
        let key = filter.name + filter.relation + filter.value;
        let display = filter.name;
        switch (filter.relation) {
            case "lt":
                display += ' \u003C ';
                break;
            case "le":
                display += ' \u2264 ';
                break;
            case "eq":
                display += ' \u003D ';
                break;
            case "ne":
                display += ' \u2260 ';
                break;
            case "ge":
                display += ' \u2265 ';

                break;
            case "gt":
                display += ' \u003E ';
                break;
        }
        display += filter.value

        return (
            <li className="filter-item" key={key}>
                {display}
                <button type="button" className="close mt-1" aria-label="Close" onClick={this.state.removeFilter} id={key}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </li>
        )
    }

    renderFilter() {
        let result = [];
        this.state.filters.forEach(e=>{
            result.push(e);
        });
        return result.map(this.generateFilter);
    }

    render() {
        return (
            <ul id="filter-filters" className="list-group">
                {this.renderFilter()}
            </ul>
        )
    }
}