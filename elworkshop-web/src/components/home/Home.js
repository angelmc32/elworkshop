import React, { useEffect, useContext, useState } from 'react'
import { useHistory, NavLink } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import UIkit from 'uikit';
import moment from 'moment';

const Home = () => {

  const { user, setUser } = useContext(AppContext); // Destructure user state variable
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

  // Hook to update component when user state variable is modified
  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: `<span uk-icon='close'></span> Por favor inicia sesión.`,
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    };

  }, [user] );
  
  return (
    <div className="content">
      <div className="uk-section">
        <h2 className="uk-margin-small-top">¡Bienvenido!</h2>
        <h4 className="uk-margin-remove">Hoy es {moment(Date.now()).locale('es').format('LL')}</h4>

        <div className="uk-container uk-margin">
          <div className="uk-grid uk-grid-collapse uk-child-width-1-1 uk-child-width-1-2@s uk-height-large" uk-grid="true">
            <div className=" uk-height-1-1@s uk-flex uk-flex-column uk-flex-center uk-flex-middle">
              <h1>La <span className="uk-text-secondary uk-text-bold">salud</span> de tu <span className="uk-text-primary uk-text-bold">familia</span>, <br/> en tus manos.</h1>
              <h3 className="uk-margin-remove">Tus datos. Tus medicamentos. Tu salud.</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home