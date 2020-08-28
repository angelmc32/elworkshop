import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

import { getAllJobs } from '../../services/job-services'

const Landing = () => {

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const [ jobs, setJobs ] = useState([])

  // Hook to update component when user state variable is modified
  useEffect( () => {

    getAllJobs()
    .then( res => {
      const { jobs } = res.data
      setJobs(jobs)
    })
    .catch( res => {
      console.log(res)
    })

  }, [] );
  
  return (
    <div className="content">
      <div className="uk-section">
      <h1>El Workshop</h1>
      <h2>¡Encuentra la persona perfecta para echarte la mano!</h2>
      <div className="uk-overflow-auto">
        { jobs.length < 1 ? (
            <h4 className="uk-text-danger">No existen chambas ahorita :(</h4>
          ) : null
        }
        <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
          <thead>
            <tr>
              <th className="uk-text-center">Trabajador</th>
              <th className="uk-text-center">Teléfono</th>
              <th className="uk-text-center">Chamba</th>
              <th className="uk-text-center uk-visible@s">Descripción</th>
              <th className="uk-text-center">Precio</th>
            </tr>
          </thead>
          <tbody>
            { jobs ? 
                jobs.map( (job, index) => 
                  <tr key={index} >
                    <td className="uk-text-center">{job.user.first_name} {job.user.last_name}</td>
                    <td className="uk-text-center">{job.user.phone_number}</td>
                    <td className="uk-text-center uk-visible@s">{job.category}</td>
                    <td className="uk-text-center uk-visible@s uk-width-1-3@s">{job.description}</td>
                    <td className="uk-text-center uk-visible@s">{`$ ${job.hourly_rate} c/hora`}</td>
                    
                  </tr>
                )
              : <tr>
                  <td className="uk-text-center">Cargando</td>
                  <td className="uk-text-center uk-visible@s">Cargando</td>
                  <td className="uk-text-center uk-visible@s">Cargando</td>
                  <td className="uk-text-center uk-visible@s">Cargando</td>
                  <td className="uk-text-center">Cargando</td>
                </tr>
          }
          </tbody>
        </table>
      </div>  
      </div>
    </div>
  )
}

export default Landing