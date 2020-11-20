import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Img } from 'react-image';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.css';
import loadingImage from '../assets/img/loader.gif';
import darkLoadingImage from '../assets/img/darkLoader.gif';
import errorImage from '../assets/img/404.gif';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import {
  FacebookShareButton, 
  TwitterShareButton, 
  TwitterIcon, 
  WhatsappShareButton, 
  WhatsappIcon, 
  FacebookIcon
} from 'react-share';
import redditImageFetcher from 'reddit-image-fetcher';
import ReactiveButton from 'reactive-button';
import Navbar from './layouts/Navbar';

const Page = (props) => {
    const [type, setType] = useState('meme');
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [fetchNextBatchTrigger, setFetchNextBatchTrigger] = useState(0);
    const [posts, setPosts] = useState([]);

    //to handle axios request if user exit component while requesting
    var signal = axios.CancelToken.source();

    //mounting
    useEffect(() => {
        let postType = 'meme';

        if (props.location.pathname === '/wallpaper') {
            postType = 'wallpaper';
            setType('wallpaper');
        }

        fetchPostsOnce(postType);
        return () => {
            // un-mounting
            signal.cancel('Api is being canceled');
        };
        // eslint-disable-next-line
    }, []);

    //to display error message
    useEffect(() => {
        if (hasError) {
            showErrorNotification();
        }
        return () => {
            //un-mounting
        };
        // eslint-disable-next-line
    }, [hasError]);

    //to fetch posts if next post is nearly empty
    useEffect(() => {
        if (fetchNextBatchTrigger) {
            fetchNextBatch();
        }
        return () => {
            //un-mounting
            signal.cancel('Api is being canceled');
        };
        // eslint-disable-next-line
    }, [fetchNextBatchTrigger]);

    /**
     * fetch posts when page loads
     */
    const fetchPostsOnce = async (postType) => {
        try {
            setIsPageLoading(true);

            /* //keeping for future reference
            var response = await axios.get("api/v1/", {
                cancelToken: signal.token,
            }); */

            var result = await redditImageFetcher.fetch({type: postType, total: 8});
            if (typeof result !== 'undefined') {
                console.log(result);
                setPosts(result);
                setIsImageViewerOpen(false);
                setIsPageLoading(false);
                setIsLoading(false);
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                setHasError(true);
            }
            console.log(error);
        }
    }

    /**
     * fetch posts when posts state has no more post
     */
    const fetchNextBatch = async () => {
        try {
            if (!isLoading && photoIndex + 1 >= posts.length) {
                setIsLoading(true);

                if (isImageViewerOpen) {
                    showLoadingNotification();
                }

                var result = await redditImageFetcher.fetch({type: type, total: 8});

                if (typeof result !== 'undefined') {
                    let tempPosts = [...posts];
                    result.forEach(element => {
                        tempPosts.push(element);
                    });
                    setPosts(tempPosts);
                    setIsLoading(false);
                    if (isImageViewerOpen) {
                        hideLoadingNotification();
                    }
                }
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                setHasError(true);
            }
            console.log(error);
        }
    }

    /**
     * fetch posts when load more button is clicked
     */
    const loadMoreOnClick = async () => {
        if (!isLoading) {
            try {
                setIsLoading(true);
                
                var result = await redditImageFetcher.fetch({type: type, total: 8});

                if (typeof result !== 'undefined') {
                    let tempPosts = [...posts];
                    result.forEach(element => {
                        tempPosts.push(element);
                    });
                    setPosts(tempPosts);
                    setIsLoading(false);
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    setHasError(true);
                }
                console.log(error);
            }
        }
    }

    /**
     * change source of lightbox 
     */
    const changeSrc = () => {
        setFetchNextBatchTrigger(fetchNextBatchTrigger + 1);
        setPhotoIndex(photoIndex + 1);
    }

    /**
     * handler for image click from home
     * 
     * @param {int} photoIndex 
     */
    const imageOnClickHandler = (photoIndex) => {
        setPhotoIndex(photoIndex);
        setIsImageViewerOpen(true);
        setFetchNextBatchTrigger(fetchNextBatchTrigger + 1);
    }

    /**
     * show message if when exception is thrown
     *  
     * @param {String} message 
     */
    const showErrorNotification = (message = 'Something went wrong.') => {
        iziToast.show({
            theme: 'light',
            icon: 'fas fa-exclamation-triangle',
            title: 'Ops',
            message: message,
            position: 'center',
            progressBarColor: 'rgb(0, 255, 184)',
            buttons: [
                ['<button>Reload</button>', function (instance, toast) {
                    window.location.reload();
                }, true]
            ]
        });
    }

    /**
     * when fetching posts from lightbox show small loading notification
     */
    const showLoadingNotification = () => {
        iziToast.show({
            id:'loading-toast',
            title: '<i class="fas fa-spinner fa-spin fa-fw"></i>',
            titleColor: 'white',
            theme: 'dark',
            titleSize: '13',
            displayMode: 2,
            rtl: window.innerWidth > 768 ? false : true,
            backgroundColor: 'transparent',
            timeout: false,
            close: false,
            animateInside: false,
            progressBar: false,
        });
    }

    /**
     * after fetching posts from lightbox hide the loading notification
     */
    const hideLoadingNotification = () => {
        var toast = document.querySelector('#loading-toast');
        iziToast.hide({}, toast);
    }

    /**
     * render image in home page iterating posts
     */
    const renderImageList = () => {
        return posts.map((post, index) => {
            return (
                <div className="col-lg-3 col-md-4 text-center" key={index}>
                    <Img
                        src={post.image}
                        loader={<img className={`sznImg${type === 'wallpaper' ? ' sznWallpaper' : ''} sznImageBlur fade-in-fast`} src={typeof post.thumbnail !== 'undefined' && post.thumbnail !== 'spoiler' && post.thumbnail !== 'NSFW' && post.thumbnail !== 'nsfw' ? post.thumbnail : loadingImage} alt="thumbnail" />}
                        unloader={<img className={`sznImg${type === 'wallpaper' ? ' sznWallpaper' : ''}`} src={errorImage} alt="404" />}
                        className={`sznImg${type === 'wallpaper' ? ' sznWallpaper' : ''}`}
                        alt={type}
                        onClick={() =>
                            imageOnClickHandler(index)
                        }
                    />
                </div>
            )
        });
    }

    /**
     * show loading image while posts are fetched or when posts can't be retrieved
     */
    const renderDummyImageList = () => {
        const className = `sznImg${type === 'wallpaper' ? ' sznWallpaper' : ''}`;
        const dummyItems = [];

        for (let index = 0; index < 8; index++) {
            dummyItems.push(<div key={index} className="col-lg-3 col-md-4 text-center"><img className={className} src={hasError ? errorImage : loadingImage} alt="loading"/></div>);
        }

        return (
            <React.Fragment>
                {dummyItems}
            </React.Fragment>
        )
    }

    const filterBlue = () => {
        return (
            <svg className='sznSvgBlurWrapper'>
                <filter id='sznSvgSharpBlur'>
                    <feGaussianBlur stdDeviation='5'></feGaussianBlur>
                    <feComposite in2='SourceGraphic' operator='in'></feComposite>
                </filter>
            </svg>
        )
    }

    return (
        <React.Fragment>
			<Navbar type={type}/>
            <div className="page-content py-5">
                <div className="theme-bg-shapes-right rm-z-index"></div>
                <div className="theme-bg-shapes-left rm-z-index"></div>
                <div className="container fade-in">
                    <React.Fragment>
                        <div className="sznWrapper">
                            {(!isPageLoading && posts.length) ? renderImageList() : renderDummyImageList()}
                        </div>
                        { (!isPageLoading && posts.length) &&  
                            <div className="text-center p-3">
                                <ReactiveButton
                                    buttonState={!isLoading ? 'idle' : 'loading'}
                                    color="teal"
                                    size="normal"
                                    idleText={
                                        <React.Fragment>
                                            Load More<i className="fas fa-arrow-alt-circle-right ml-2"></i>
                                        </React.Fragment>
                                    }
                                    loadingText={
                                        <React.Fragment>
                                            Loading<i className="fas fa-spinner fa-spin ml-2"></i>
                                        </React.Fragment>
                                    }
                                    width={"120px"}
                                    disabled={isLoading}
                                    onClick={() =>  loadMoreOnClick() }
                                />
                            </div>
                        } 
                        
                        {(isImageViewerOpen && !isPageLoading) && (
                            // eslint-disable-next-line
                            <Lightbox
                                mainSrc={posts[photoIndex] ? posts[photoIndex].image : darkLoadingImage}
                                nextSrc={!isLoading ? (posts[(photoIndex + 1)] ? posts[(photoIndex + 1)].image : '') : ''}
                                prevSrc={posts[(photoIndex - 1)] ? posts[(photoIndex - 1)].image : ''}
                                clickOutsideToClose={false}
                                imagePadding={window.innerWidth > 768 ? 50 : 10}
                                imageTitle={ window.innerWidth > 768 ? (posts[photoIndex].title ? posts[photoIndex].title: '') : false }
                                imageCaption={ window.innerWidth <= 768 ? (posts[photoIndex].title ? posts[photoIndex].title: '') : false }
                                toolbarButtons={[
                                    <TwitterShareButton url={posts[photoIndex].image ? posts[photoIndex].image: ''} children={<TwitterIcon size={26} round={true} />} />,
                                    <WhatsappShareButton url={posts[photoIndex].image ? posts[photoIndex].image: ''} children={<WhatsappIcon size={26} round={true} />} />,
                                    <FacebookShareButton url={posts[photoIndex].image ? posts[photoIndex].image: ''} children={<FacebookIcon size={26} round={true} />} />,
                                    <a className="badge image-download-badge" href={posts[photoIndex].image ? posts[photoIndex].image: ''} download target="_blank" rel="noopener noreferrer">
                                        <i className="fas fa-save image-download-icon"></i>
                                    </a>
                                ]}
                                onCloseRequest={() => setIsImageViewerOpen(false)}
                                onMovePrevRequest={() =>
                                    setPhotoIndex(photoIndex - 1)
                                }
                                onMoveNextRequest={() =>
                                    changeSrc()
                                }
                            />
                        )}
                    </React.Fragment>
                </div>
                {filterBlue()}
            </div>
        </React.Fragment>
    );
};

export default Page;