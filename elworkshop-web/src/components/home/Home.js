import React, { useEffect, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import UIkit from 'uikit';
import useForm from '../../hooks/useForm'

import { createJob, getUserJob, editJob } from '../../services/job-services'

const Home = () => {

  const { user, resetUserContext } = useContext(AppContext); // Destructure user state variable
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { form, resetForm, handleInput } = useForm();
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: false,
    errorMessage: null,
    job: null,
    buttonText: 'Cargando'
  });

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

    getUserJob()
    .then( res => {
      const { jobs } = res.data
      if ( jobs.length > 0 ) {
        const currentJob = jobs[0]
        setState( prevState => ({...prevState, job: currentJob, buttonText: 'Guardar cambios'}));
      }
      else
        setState( prevState => ({...prevState, buttonText: 'Crear Chamba'}));
    })
    .catch( res => {
      console.log(res)
    })

  }, [user] );

  const handleSubmit = (event) => {

    event.preventDefault();
    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}));

    if ( state.job === null ) {
      createJob(form)
      .then( res => {           // Success -> notification and send to new consultation view,
        const { job } = res.data    // Destructure updated preferences document from response
        UIkit.notification({  // Send UIkit success notification
          message: '<p class="uk-text-center">La chamba fue creada exitosamente</p>',
          pos: 'bottom-center',
          status: 'success'
        });
        resetForm();
        setState( prevState => ({...prevState, job: job, isButtonDisabled: false, spinnerState: false, buttonText: 'Guardar Cambios'}))

      })
      .catch( res => {          // Error -> notification and redirect if unauthorized
        const { msg } = res.response.data;
        if ( msg === 'Sesión expirada. Reinicia sesión por favor.' ) {
          localStorage.clear();
          resetUserContext();
          UIkit.notification({  // Send UIkit error notification
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'warning'
          });
          push('/login');
        }
        else
          UIkit.notification({  // Send UIkit error notification
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'warning'
          });
        setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
      });
    }
    else {
      editJob(state.job._id, form)
      .then( res => {           // Success -> notification and send to new consultation view,
        const { job } = res.data    // Destructure updated preferences document from response
        UIkit.notification({  // Send UIkit success notification
          message: '<p class="uk-text-center">La chamba fue actualizada exitosamente</p>',
          pos: 'bottom-center',
          status: 'success'
        });
        resetForm();
        setState( prevState => ({...prevState, job: job, isButtonDisabled: false, spinnerState: false, buttonText: 'Guardar Cambios'}))

      })
      .catch( res => {          // Error -> notification and redirect if unauthorized
        const { msg } = res.response.data;
        if ( msg === 'Sesión expirada. Reinicia sesión por favor.' ) {
          localStorage.clear();
          resetUserContext();
          UIkit.notification({  // Send UIkit error notification
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'warning'
          });
          push('/login');
        }
        else
          UIkit.notification({  // Send UIkit error notification
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'warning'
          });
        setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
      });
    }

  }
  
  return (
    <div className="content">
      <div className="uk-section">
        <h2 className="uk-margin-small-top">¡Bienvenido!</h2>

        <div className="uk-container uk-margin uk-flex uk-flex-center">
          <form onSubmit={handleSubmit} className="uk-width-1-2@s">
            <fieldset className="uk-fieldset" />

            <legend className="uk-legend">Mi Chamba</legend>
            <div className="uk-margin uk-text-left">
              <label className="uk-form-label uk-margin-small-left" htmlFor="category-input">Nombre:</label>
              <input className="uk-input uk-border-pill uk-text-center" id="category-input" onChange={handleInput} name="category" type="text" defaultValue={ state.job ? state.job.category : '' } placeholder="Describe tu chamba..." required />
            </div>
            <div className="uk-margin uk-text-left">
              <label className="uk-form-label uk-margin-small-left" htmlFor="description-input">Descripción:</label>
              <input className="uk-input uk-border-pill uk-text-center" id="description-input" onChange={handleInput} name="description" type="text" defaultValue={ state.job ? state.job.description : '' } placeholder="Describe tu chamba..." required />
            </div>
            <div className="uk-margin uk-text-left">
              <label className="uk-form-label uk-margin-small-left" htmlFor="hourly-rate-input">Precio por hora (mxn):</label>
              <input className="uk-input uk-border-pill uk-text-center" id="hourly-rate-input" onChange={handleInput} name="hourly_rate" type="number" defaultValue={ state.job ? state.job.hourly_rate : '' } placeholder="Precio por hora..." required />
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-medium">
              <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-2@m uk-margin" disabled={state.isButtonDisabled} >
                { state.buttonText }  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home