import React from "react"
// let echarts = require('echarts')
let echarts = require('echarts/lib/echarts');

export default class SearchItem extends React.Component {
    constructor(props) {
        super(props);

        this.renderResult = this.renderResult.bind(this);
        this.renderResults = this.renderResults.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        let target = $(event.currentTarget);
        let to = this.props.categoryList.indexOf(target.attr('category'));

        document.getElementById('filter-form-removeall').click();
        let indicators = $('#carouselIndicators');
        if (indicators.attr('activeIndex') != to) {
            indicators.carousel(to);
        } else {
            if ($('#filter-filters').children().length > 0 || $("#xySelectorWrapper").css('display') == 'none') {
                document.getElementById('filter-form-apply').click();
            }
        }
        let instance = echarts.getInstanceByDom(document.getElementById('main-graph'));
        setTimeout(function(){
            instance.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: target.attr('index'),
            });
            setTimeout(function(){
                instance.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: target.attr('index'),
                });
            }, 1500);
        }, 300);
        
    }

    renderResult(entry) {
        return (
            <li className="search-item" onClick={this.handleClick} key={entry.name+'-'+entry.category} name={entry.name} category={entry.category} index={entry.index}>
                <div className="search-item-category"><span className="added_name">Category:</span> {entry.category}</div>
                <div className="search-item-name"><span className="added_name">Dataset: </span>{entry.name}</div>
            </li>
        )
    }

    renderResults() {
        if (this.props.results.length == 0) {
            return (
                <li>
                    <div className="search-item-noresult">No result</div>
                </li>
            )
        }
        return this.props.results.map(this.renderResult);
    }



    render() {
        return (
            <ul id="search-result" className="list-group">
                {this.renderResults()}
            </ul>
        )
    }
}