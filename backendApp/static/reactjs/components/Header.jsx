import React from "react"

export default class Header extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a href="/" className="nav-link">
                                <i className="fas fa-home" color="black" style={{marginRight:'20px'}}></i>
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/data/" className="nav-link">
                                Data
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/lab/" className="nav-link">
                                Contact Lab
                            </a>
                        </li>

                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <i className="fas fa-envelope" color="black"></i>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <i className="fab fa-twitter" color="black"></i>
                            </a>
                        </li>
                    </ul>


            </nav>
        )
    }
}