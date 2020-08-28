import React, { useContext, useEffect, useState } from 'react';                // Import React and useContext hook
import { useHistory } from 'react-router-dom';            // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';            // Import AppContext to use created context
import { signup } from '../../services/auth-services';    // Import signup service for API call
import AuthForm from './AuthForm';                        // Import AuthForm react component
import useForm from '../../hooks/useForm';                // Import useForm custom hook
import UIkit from 'uikit';                                // Import UIkit for notifications
import moment from 'moment';                                    // Import momentjs for date formatting

// Declare Signup functional component
const Signup = () => {

  const { form, handleInput } = useForm();      // Destructure form state variable and handleInput function
  const { user, setUser } = useContext(AppContext);   // Destructure setUser function for user state manipulation
  const { push } = useHistory();                // Destructure push method from useHistory to "redirect" user
  const [ spinnerState, setSpinnerState ] = useState(false)
  const maxDate = moment().subtract(18, 'years').format("YYYY-MM-DD")

  useEffect( () => {
    
    if ( user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      
      return push('/home');         // If not logged in, "redirect" user to login

    };
  })

  // Declare function for form submit event
  const handleSubmit = (event) => {

    event.preventDefault();                     // Prevent page reloading after submit action
    setSpinnerState(true)
    if ( !form['date_of_birth'] ) form['date_of_birth'] = maxDate
    
    // Call signup service with form state variable as parameter, which includes form data for e-mail and password
    signup(form)
    .then( res => {

      const { user, token, msg } = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      setSpinnerState(false)
      setUser(user)
      push('/home');    // "Redirect" user to registration information page

      // Send UIkit success notification
      UIkit.notification({
        message: `<p class="uk-text-center"><span uk-icon='check'></span> ${msg}</p>`,
        pos: 'bottom-center',
        status: 'success'
      });

    })
    .catch( res => {

      console.log(res.response)

      const { msg } = res.response.data;
      setSpinnerState(false);
      
      // Send UIkit error notification
      UIkit.notification({
        message: `<p class="uk-text-center">${msg}</p>`,
        pos: 'bottom-center',
        status: 'danger'
      });

    });
    
  };

  const validateEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
  }

  return (
    <div className="uk-section">
      <div className="uk-container">
        <AuthForm
          submit={handleSubmit}
          action="signup"
          handleChange={handleInput}
          validateEmail={validateEmail}
          {...form}
          spinnerState={spinnerState}
          form={form}
        />
      </div>
    </div>
  );

};

export default Signup;