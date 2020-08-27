import React, { useContext } from 'react';                // Import React and useContext hook
import { Link, NavLink } from 'react-router-dom';         // Import NavLink for "navigation"
import { useHistory } from 'react-router-dom';            // Import useHistory for "redirection"
import { AppContext }  from '../../AppContext';           // Import AppContext to use created context
import { logout } from '../../services/auth-services';    // Import logout service for logout functionality


// Declare Nav functional component (Navigation Bar)
const Navbar = () => {
  
  // Destructure user state variable and resetUserContext function from context
  const { user, resetUserContext } = useContext(AppContext);
  // Destructure push method from useHistory to "redirect" user
  const { push } = useHistory();

  // Declare function for handling logout button
  const handleLogout = () => {

    logout();                   // Execute logout function (clear localStorage)
    push('/login');             // Redirect user to login
    resetUserContext();         // delete user data from context to an empty object
    closeMenu();

  };

  const closeMenu = () => {
    const toggle = document.getElementById('toggle');
    toggle.checked = !toggle.checked;
  }

  return (

    <nav className="uk-navbar uk-navbar-container uk-navbar-transparent uk-flex uk-flex-between uk-flex-middle uk-flex-wrap">
      
      <ul className="uk-navbar-nav uk-height-1-1">
          <li className="uk-active uk-flex uk-flex-middle uk-height-1-1">
              <NavLink to="/">
                El Workshop
              </NavLink>
          </li>
      </ul>

      <label id="nav-menu" htmlFor="toggle" className="uk-margin-right uk-height-1-1"><span uk-icon="menu"></span></label>
      <input type="checkbox" id="toggle"/>
      
      
          
          { user._id ? 
            <ul className="menu uk-navbar-nav">
              <li className="uk-active">
                <NavLink to="/perfil">
                  <div className="uk-width-auto uk-margin-small-right">
                    <img className="uk-border-circle" width={40} height={40} src={user.profile_picture} alt="User profile" />
                  </div>
                  <p className="uk-margin-remove">Mi Perfil</p>
                </NavLink>
              </li>
              <li className="uk-active">
                <NavLink to="/login">
                  <button className="uk-button uk-button-primary uk-border-pill" onClick={handleLogout} >
                    Logout
                  </button>
                </NavLink>
              </li>
              <div className="mobile-only uk-overflow-auto">
                <li className="uk-active">
                  <NavLink to="/home">Mis chambitas</NavLink>
                </li>
              </div>
            </ul>
            :
            <ul className="menu uk-navbar-nav">
              <li className="uk-active uk-flex uk-flex-center uk-flex-middle" onClick={closeMenu} ><Link to="/servicios">Servicios</Link></li>
              <li className="uk-active uk-flex uk-flex-center uk-flex-middle" onClick={closeMenu} ><Link to="/nosotros">Nosotros</Link></li>
              <li className="uk-active uk-flex uk-flex-center uk-flex-middle" onClick={closeMenu} >
                <Link to="/login" className="uk-margin-remove uk-padding-remove">
                  <button className="uk-button uk-button-white uk-border-pill">
                    Inicia Sesión
                  </button>
                </Link>
              </li>
              <li className="uk-active uk-flex uk-flex-center uk-flex-middle" onClick={closeMenu} >
                <Link to="/registro">
                  <button className="uk-button uk-button-primary uk-border-pill">
                    Regístrate
                  </button>
                </Link>
              </li>
            </ul>
          }

    </nav>
    
  );

};

export default Navbar;