import React from "react"

export default class Category extends React.Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.props.rootThis.updateChart();
    }

    renderIndicators(cat, index) {
        let c = 'active';
        if (index != 0) {
            c = '';
        }
        return (
            <li data-target="#carouselIndicators" data-slide-to={index} className={c} key={'indicator-'+index}></li>
        )
    }

    renderItems(cat, index) {
        let c = 'carousel-item';
        if (index == 0) {
            c += ' active';
        }
        return (
            <div className={c} key={'item-'+index}>
                <button className="d-block btn btn-secondary" onClick={this.handleClick}>{cat}</button>
            </div>
        )
    }

    componentDidMount() {
        let rootThis = this.props.rootThis;
        let mythis = this;
        let indicators = $('#carouselIndicators');
        indicators.on('slide.bs.carousel', function (event) {
            let currentIndex = event.to;
            let newcat = mythis.props.categoryList[currentIndex];
            indicators.attr('activeindex', currentIndex);
            rootThis.setState({currentCategory: newcat});
        })
    }

    render() {
        let cats = this.props.categoryList;
        return (
            <div id="carouselIndicators" className="carousel slide" data-ride="carousel" data-interval={false} activeindex={0}>
                <ol className="carousel-indicators">
                    {cats.map(this.renderIndicators)}
                </ol>
                <div className="carousel-inner">
                    {cats.map(this.renderItems)}
                </div>
                <a className="carousel-control-prev" href="#carouselIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        )
    }
}