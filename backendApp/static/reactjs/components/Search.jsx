import React from "react"
import SearchItem from "./SearchItem"
let Fuse = require('fuse.js');

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            fuse: null,
            results: [],
        }

        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        let mythis = this;
    }

    handleSearch(event) {
        event.preventDefault();
        if (this.state.fuse == null) {
            return
        }

        let target = $('#search-input').val();
        let results = this.state.fuse.search(target);
        
        this.setState({results: results});
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let entries = [];
        for (let i = 0; i < nextProps.categoryList.length; i++) {
            for (let j = 0; j < nextProps.data[nextProps.categoryList[i]].length; j++) {
                entries.push({
                    name: nextProps.data[nextProps.categoryList[i]][j].name,
                    category: nextProps.categoryList[i],
                    index: j,
                });
            }
        }

        let option = {
            sort: true,
            threshold: 0.5,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
              "name",
            ]
        };
        return {
            fuse: new Fuse(entries, option),
            entries: entries
        }
    }

    render() {
        return (
            <div id="search-wrapper">
                <form className="input-group mb-2" onSubmit={this.handleSearch}>
                    <input id="search-input" type="text" className="form-control" placeholder="Search Data..." aria-label="Search"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" type="submit">
                            <i className="fas fa-search" color="black"></i>
                        </button>
                    </div>
                </form>

                <div id="search-result-wrapper">
                    <span className="label mb-2">
                        Search Result
                    </span>
                    <SearchItem results={this.state.results} categoryList={this.props.categoryList}/>
                </div>

                
            </div>
        )
    }
}