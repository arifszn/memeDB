import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({type}) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light header fixed-top">
            <div className="docs-logo-wrapper">
                <div className="site-logo">
                    <Link className="navbar-brand" to="/">
                        <img className="logo-icon mr-2" src={process.env.PUBLIC_URL+'/logo.png'} width="30" alt="logo"/>
                        <span className="logo-text">
                            <span className="text-muted font-bold">meme</span><span className="text-muted text-alt">DB</span>
                        </span>
                    </Link>
                </div>    
            </div>
            <button className="navbar-toggler ml-auto btn badge" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
                    <li className={`nav-item pr-1${type === 'meme' ? ' nav-item-active' : ''}`}>
                        <Link className="nav-link" to="/">Meme</Link>
                    </li>
                    <li className={`nav-item pr-1${type === 'wallpaper' ? ' nav-item-active' : ''}`}>
                        <Link className="nav-link" to="/wallpaper">Wallpaper</Link>
                    </li>
                    <li className="nav-item pr-1">
                        <a className="nav-link" href="https://github.com/arifszn/memeDB" rel="noopener noreferrer" target="_blank"><i className="fab fa-github"></i></a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;