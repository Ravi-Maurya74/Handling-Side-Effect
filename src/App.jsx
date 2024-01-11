import { useCallback, useEffect, useRef, useState } from "react";
import { sortPlacesByDistance } from "./loc.js";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";

// Below 3 lines of code does not require use effect as
// it runs synchronously, i.e., instantly and does not take time to
// finish during which some app component execution would finish.
// We can even move this code to the top of the file as this code
// needs to run only once and not on every component rendering.

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Below code require use effect as it takes time to finish.
  // During this time, the app component execution would finish.
  // The below code runs asynchronously. as the callback would
  // finish sometime in the future and not instantly.

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // the below side effect does not require use effect as
    // it is not related to the component rendering and
    // it is not related to the state of the component.
    // Even if it updated the state, it would not cause an infinite loop
    // as this code is only executed on user interaction and not on component rendering.

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (!storedIds.includes(id)) {
      storedIds.push(id);
      localStorage.setItem("selectedPlaces", JSON.stringify(storedIds));
    }
  }

  // below code require use callback as it is used as a dependency
  // in the dependency array of the use effect. If we don't use
  // use callback, then the reference of the function would change
  // on every component rendering and the use effect would run
  // on every component rendering. To prevent this, we use use callback
  // to ensure that the reference of the function does not change.
  // It also takes dependencies as the function uses the state and prop.

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalOpen(false);

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    const updatedIds = storedIds.filter((id) => id !== selectedPlace.current);
    localStorage.setItem("selectedPlaces", JSON.stringify(updatedIds));
  }, []);

  return (
    <>
      <Modal open={modalOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText={"Sorting Places by distance."}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
