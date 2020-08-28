import React, { Fragment, useEffect, useContext, useState } from 'react';           // Import React and useContext hook
import { useHistory } from 'react-router-dom';                  // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                  // Import AppContext to use created context
import { editProfile } from '../../services/auth-services';  // Import edit API call
import useForm from '../../hooks/useForm';                      // Import useForm custom hook
import UIkit from 'uikit';                                      // Import UIkit for notifications
import moment from 'moment';                                    // Import momentjs for date formatting

const Profile = ({ push, url }) => {

  const { form, resetForm, handleInput, handleFileInput } = useForm();
  const [ state, setState ] = useState({
    isUserEditing: false,
    isButtonDisabled: true,
    spinnerState: false,
    errorMessage: null,
    showNewProfilePic: false
  });
  const [ imgPreviewState, setImgPreviewState ] = useState({file: '',imagePreviewUrl: ''})
  
  const { user, setUser, resetUserContext } = useContext(AppContext); // Destructure user state variable

  const now = moment();
  const maxDate = moment().subtract(18, 'years').format("YYYY-MM-DD")

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: "<p class='uk-text-center'>Por favor inicia sesión</p>",
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    }

  }, [user] );

  

  // Declare function for form submit event
  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setState( prevState => ({...prevState, spinnerState: true, isButtonDisabled: true}))

    // if ( form.first_name && form.last_name1 && form.last_name2 && form.date_of_birth || user.isProfileComplete ) form['isProfileComplete'] = true

    // if ( form.profile_picture ) {
      
    const formData = new FormData();      // Declare formData as new instance of FormData class
    const { profile_picture } = form;     // Destructure profile_picture from form

    // Iterate through every key in form object and append name:value to formData
    for (let key in form) {

      // If profile_picture, append as first item in array (currently 1 file allowed, index 0)
      if ( key === 'profile_picture' ) formData.append(key, profile_picture[0]);

      else formData.append(key, form[key]);
      
    }
      
    // Call edit service with formData as parameter, which includes form data for user profile information
    editProfile(formData)
    .then( res => {

      const { user } = res.data   // Destructure updated user document from response
      
      setUser(user);              // Modify user state variable with updated information
      resetForm();
      setState( prevState => ({...prevState, isUserEditing: false, spinnerState: false}))

      // Send UIkit success notification
      UIkit.notification({
        message: `<p class="uk-text-center">Tu perfil fue actualizado exitosamente</p>`,
        pos: 'bottom-center',
        status: 'success'
      });

    })
    .catch( res => {

      const { msg } = res.response.data;
      if ( msg === 'Sesión expirada. Reinicia sesión por favor.' ) {
        localStorage.clear();
        resetUserContext();
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'warning'
        });
        push('/login');
      }
      else 
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });
      setState( prevState => ({...prevState, spinnerState: false, isButtonDisabled: false}))

    });

  };

  const toggleIsUserEditing = (event) => {
    event.preventDefault()
    resetForm();
    document.getElementById('date_of_birth_input').value = moment(user.date_of_birth).format('YYYY-MM-DD')
    setState( prevState => ({...prevState, isUserEditing: !prevState.isUserEditing, errorMessage: null, isButtonDisabled: false}))
  }

  const validateDate = (event) => {
    const { value } = event.target
    if ( now.diff(value, 'years') < 18 ) {
      setState( prevState => ({...prevState, isButtonDisabled: true, errorMessage: 'Debes tener 18 años'}))
    }
    else if ( now.diff(value, 'years') > 99 ) {
      setState( prevState => ({...prevState, isButtonDisabled: true, errorMessage: 'Introduce una fecha menor'}))
    }
    else {
      setState( prevState => ({...prevState, isButtonDisabled: false, errorMessage: null}))
    }
  }

  const handleImageChange = (event) => {
    event.preventDefault();
    handleFileInput(event)

    let reader = new FileReader();
    let file = event.target.files[0];

    if (!file) 
      return
    else {
      reader.onloadend = () => {
        setImgPreviewState({
          file: file,
          imagePreviewUrl: reader.result
        });
        setState( prevState => ({...prevState, showNewProfilePic: true}) )
      }
      reader.readAsDataURL(file)
    }
  }

  const cancelImageChange = () => {
    delete form['profile_picture']
    setState( prevState => ({...prevState, showNewProfilePic: false}) )
  }

  return (
    <Fragment>
      <div className="uk-width-1-1 uk-inline">
        <img className="uk-border-circle" width={128} height={128} src={ state.showNewProfilePic ? imgPreviewState.imagePreviewUrl : user.profile_picture} alt="User profile" />
          
        <div className="js-upload uk-position-right-bottom uk-icon-button avatar" uk-icon="pencil" uk-form-custom="true" style={{"display": "box!important"}}>
          <input onChange={handleImageChange} name="profile_picture" type="file" accept="image/*" />
        </div>
        
        
        
      </div>
      { form['profile_picture'] ?
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-small">
          <div className="uk-width-1-2 uk-width-1-6@s uk-flex uk-flex-around">
            <a className="uk-icon-button uk-text-danger" uk-icon="ban" onClick={cancelImageChange}></a>
            <a className="uk-icon-button uk-text-success" uk-icon="check" onClick={handleSubmit}></a>
          </div>
        </div>
        : null
      }
      <h2 className="uk-margin-small-top">{user.first_name} {user.last_name}</h2>
      <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-small-top">
        <ul className="uk-flex uk-flex-center uk-width-1-1 uk-margin-remove@s" uk-tab="connect: #my-id" >
          <li className="uk-active"><a href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }>Datos</a></li>
        </ul>
      </div>
      <div id="my-id" className="uk-switcher uk-flex uk-flex-center" uk-switcher="true">
        <div className="uk-card uk-card-hover uk-card-body uk-padding-small uk-padding@s uk-width-1-2@s">
          <h4 className="uk-margin-remove-bottom">Datos Personales</h4>
          <a className={ state.isUserEditing ? "uk-text-danger uk-position-top-right uk-position-small" : "eva-edit uk-position-top-right uk-position-small"} href="#" onClick={toggleIsUserEditing}>
            <span uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
          </a>
          <a className={ state.isUserEditing ? "uk-text-danger" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
            { state.isUserEditing ? "Cancelar cambios" : "Editar" }
          </a>
          <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
            <p className="uk-margin-remove">Nombres:</p>
            <div className="uk-form-controls uk-margin-small">
              <input className="uk-input uk-border-pill uk-text-center" type="text" name="first_name" onChange={handleInput} value={form.first_name !== undefined ? form.first_name : user.first_name} disabled={!state.isUserEditing} required />
            </div>
            <p className="uk-margin-remove">Apellidos:</p>
            <div className="uk-form-controls uk-margin-small">
              <input className="uk-input uk-border-pill uk-text-center" type="text" name="last_name" onChange={handleInput} value={form.last_name !== undefined ? form.last_name : user.last_name} disabled={!state.isUserEditing} required />
            </div>
            <p className="uk-margin-remove">Teléfono:</p>
            <div className="uk-form-controls uk-margin-small">
              <input className="uk-input uk-border-pill uk-text-center border-white" type="text" name="phone_number" onChange={handleInput} value={form.phone_number !== undefined ? form.phone_number : user.phone_number} minLength={10} maxLength={10} disabled={!state.isUserEditing} />
            </div>
            <p className="uk-margin-remove">Fecha de nacimiento:</p>
            <div className="uk-form-controls uk-margin-small" hidden={state.isUserEditing}>
              <input className="uk-input uk-border-pill uk-text-center" type="text" id="date_of_birth" value={moment(user.date_of_birth).format('LL')} disabled={!state.isUserEditing} />
            </div>
            <div className="uk-form-controls uk-margin-small" hidden={!state.isUserEditing}>
              <input onChange={event=> {validateDate(event); handleInput(event)} } id="date_of_birth_input" name="date_of_birth" className="uk-input uk-border-pill uk-text-center" type="date" defaultValue={moment(user.date_of_birth).format('YYYY-MM-DD')} max={maxDate} disabled={!state.isUserEditing} required />
            </div>
            <p className="uk-text-center uk-text-danger">{state.errorMessage}</p>
            <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-align-center uk-margin" hidden={!state.isUserEditing} disabled={state.isButtonDisabled}>
              { !state.spinnerState ? "Guardar cambios" : "Guardando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
            </button>
          </form>
        </div>
        
      </div>
    </Fragment>
  )

}

export default Profile