import React from "react";
import { Redirect, withRouter } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Firebase from "firebase";
import { signOut } from "../utils/firebase";
import Loader from "../components/loader";
import { FaBars, FaTimes } from 'react-icons/fa';

function handleSignOut() {
  signOut()
    .then(() => {
      console.log("Signed Out");
    })
    .catch(e => {
      console.log("Error signing out", e);
    });
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMobileMenu: false,
      isMobile: false,
      imageData: [],
      currentImageIndices: {},
    };
  }

  handleResize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  handleMediaQuery = (event) => {
    this.setState({ isMobile: event.matches });
  }

  componentDidMount() {
    // Set the value once initially
    this.handleResize();

    // Add event listener
    window.addEventListener('resize', this.handleResize);

    // Set up media query listener
    this.mql = window.matchMedia('(max-width: 768px)');
    this.mql.addListener(this.handleMediaQuery);
    // Trigger once on mount
    this.handleMediaQuery(this.mql);

    const db = Firebase.database().ref("images");
    db.on("value", snapshot => {
      let imageData = [];
      snapshot.forEach(snap => {
        imageData.push(snap.val());
      });
      this.setState({ imageData });

      // Initialize currentImageIndices
      let currentImageIndices = {};
      imageData.forEach((post, postIndex) => {
        currentImageIndices[postIndex] = 0;
      });
      this.setState({ currentImageIndices });

      console.log(imageData);
      console.log(currentImageIndices);
    });
  }

  handleImageScroll = (postIndex, direction) => {
    this.setState(prevState => {
      let currentImageIndices = {...prevState.currentImageIndices};
      let maxIndex = this.state.imageData[postIndex].imageURLs.length - 1;
      let currentImageIndex = currentImageIndices[postIndex] || 0;
  
      currentImageIndex += direction;
  
      if (currentImageIndex < 0) {
        currentImageIndex = maxIndex;
      } else if (currentImageIndex > maxIndex) {
        currentImageIndex = 0;
      }
  
      currentImageIndices[postIndex] = currentImageIndex;
  
      return {currentImageIndices};
    });
  }
  

  componentWillUnmount() {
    // Remove event listener on cleanup
    window.removeEventListener('resize', this.handleResize);
    // Remove media query listener
    this.mql && this.mql.removeListener(this.handleMediaQuery);
  }

  toggleMobileMenu = () => {
    this.setState(prevState => ({ showMobileMenu: !prevState.showMobileMenu }));
  };

  render() {
    const { isMobile, showMobileMenu } = this.state;
    const { imageData, currentImageIndices } = this.state;
    //const { imageData } = this.state;

    if (this.props.authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (this.props.authState === authStates.LOGGED_OUT) {
      return <Redirect to="/login"></Redirect>;
    }

    return (
      <div className="container">
        <div className="navbar">
          <div className="padding80">
            <p>Welcome, let's fly!</p>
            {isMobile && (
              <>
                <button className="menu-button" onClick={this.toggleMobileMenu}>
                  {showMobileMenu ? <FaTimes /> : <FaBars />}
                </button>
                <div className={`mobile-menu ${showMobileMenu ? 'open' : ''}`}>
                  <button className="buttonsidebarback" onClick={this.toggleMobileMenu}>&lt;</button>
                  <button className="buttonsidebar" onClick={handleSignOut}> Sign Out </button>
                  <button onClick={() => this.props.history.push('/profile')} className="buttonsidebar"> Profile </button>
                </div>
              </>
            )}
            {!isMobile && (
              <div className="navbar-items">
                <button onClick={handleSignOut}  className="marginside40"> Sign Out </button>
                <button onClick={() => this.props.history.push('/profile')} className="marginside40"> Profile </button>
              </div>
            )}
          </div>
        </div>
        <div className="itemslist">
        {imageData && imageData.map((post, postIndex) => (
          <div key={postIndex} className="card uploadscreen">
            {post.imageURLs && post.imageURLs.map((imageUrl, imgIndex) => (
              <div key={imgIndex} style={{ borderRadius: "10px", alignItems: "center", justifyContent: "center", width: '100%', height: '100%', display: imgIndex === (currentImageIndices[postIndex] || 0) ? 'block' : 'none' }}>
                <img src={imageUrl} alt="uploaded" style={{ width: '250px', height: '40%', objectFit: 'contain' }} />
                {imgIndex === (currentImageIndices[postIndex] || 0) && (
                  <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: '100%',}}>
                    <button className="cardbutton" onClick={() => this.handleImageScroll(postIndex, -1)}>&lt;</button>
                    <button className="cardbutton" onClick={() => this.handleImageScroll(postIndex, 1)}>&gt;</button>
                  </div>
                )}
                <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: '100%',}}>
                  <h2 style={{fontSize: "1em"}}>{post.title}</h2>
                </div>
                <div className="itemdescription">
                  <p className="fontloader">{post.description}</p>
                </div>
              
              </div>
            ))}
          </div>
        ))}
        </div>

        <div style={{height: "30px"}}></div>


         {/*{this.state.imageData && this.state.imageData.map((data, index) => (
          <div key={index}>
            <h2>{data.title}</h2>
            <p>{data.description}</p>
            <div style={{width: '400px', height: '300px'}}>
              <img src={data.imageURL} alt="database" style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}/>
            </div>
          </div>
        ))}*/}
      </div>
    );
  }
}

export default withRouter(withAuth(Home));
