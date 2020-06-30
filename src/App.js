import React, { useState } from 'react';
import FormContainer from './components/FormContainer/FormContainer';


function App() {
  const [passengersCount, setPassengersCount] = useState(1)
  const [deletedCount, setDeletedCount] = useState(0)
  const [jsonPassengers, setJsonPassengers] = useState([])
  const [successStatus, setSuccessStatus] = useState(false)

  const handleSubmitForms = (passenger) => {
    const requestData = [...jsonPassengers, passenger]
    if (passengersCount-deletedCount === requestData.length) {
      fetch('https://webhook.site/33a0ad92-cab5-4d32-934d-82c919726c15', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ data: requestData })
      })
        .then(response => {
          if (response.status) setSuccessStatus(true)
        })
        .catch(error => console.error);
    }
  }

  const renderedForms = []
  for (let i = 0; i < passengersCount; i++) {
    renderedForms.push(
      <FormContainer
        key={i}
        number={i - deletedCount + 1}
        handleSubmitForms={handleSubmitForms}
        jsonPassengers={jsonPassengers}
        setJsonPassengers={setJsonPassengers}
        deletedCount={deletedCount}
        setDeletedCount={setDeletedCount}
        setPassengersCount={setPassengersCount}
        passengersCount={passengersCount} />
    )
  }

  return (
    <div className="container">
      {successStatus ? <div className="successMessage"><h1>Билеты успешно заказаны</h1></div> : renderedForms}
    </div>
  );
}

export default App;
