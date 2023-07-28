import React from "react";
import { Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
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
    };
  }

  toggleMobileMenu = () => {
    this.setState(prevState => ({ showMobileMenu: !prevState.showMobileMenu }));
  };

  render() {
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
            <button className="menu-button" onClick={this.toggleMobileMenu}>
              {this.state.showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
            <div className={`mobile-menu ${this.state.showMobileMenu ? 'open' : ''}`}>
              <button className="buttonsidebar" onClick={handleSignOut}> Sign Out </button>
              <button className="buttonsidebar"> Profile </button>
            </div>
            <div className="navbar-items">
              <button onClick={handleSignOut}> Sign Out </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Home);
