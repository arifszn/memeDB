import React from 'react';

const Error = () => {
    return (
        <React.Fragment>
            <section className="error-page">
                <div className="page-content">
                    <div className="theme-bg-shapes-right"></div>
                    <div className="theme-bg-shapes-left"></div>
                    <div className="container">
                        <div className="text-center">
                            <h1>404</h1>
                            <h2>Not Found</h2>
                        </div>
                        <div className="gears">
                            <div className="gear one">
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </div>
                            <div className="gear two">
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </div>
                            <div className="gear three">
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Error;