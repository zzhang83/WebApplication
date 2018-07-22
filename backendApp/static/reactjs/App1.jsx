import React from "react"
import { render } from "react-dom"
import Header from "./components/Header"
import Filter from "./components/Filter"
import Search from "./components/Search"
import MainContent from "./components/MainContent"


// import "../css/main.css"

class App1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: new Map(),
            data: [],
            categoryList: [],
            currentCategory: null,
        }
    }

    render() {
        return (

            <div id="app-container">
                {/*<div id="header-container">*/}
                    {/*<Header/>*/}
                {/*</div>*/}
                <div id="page-wrapper">
                    <div id="left-toolbar-container">
                        <Filter data={this.state.data} currentCategory={this.state.currentCategory} rootThis={this}/>
                    </div>
                    <div id="main-content-container">
                        <MainContent filters={this.state.filters} rootThis={this}/>
                    </div>
                    <div id="right-toolbar-container">
                        <Search data={this.state.data} categoryList={this.state.categoryList} rootThis={this}/>
                    </div>
                </div>
                
            </div>
        )
    }
}

render(<App1/>, document.getElementById('App1'));