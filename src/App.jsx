import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { UpdateUserPlaces, fetchUserPlaces } from "./http.js";
import Error from "./components/Error.jsx";
function App() {
  const selectedPlace = useRef();
  const focusRef = useRef();
  const [userPlaces, setUserPlaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [errorRemovingPlaces, setErrorRemovingPlaces] = useState();

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const places = await fetchUserPlaces();
        setUserPlaces(places);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPlaces();
  }, []);

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await UpdateUserPlaces([...userPlaces, selectedPlace]);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || "Failed to Remove the Places",
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      try {
        await UpdateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setUserPlaces(userPlaces);
        setErrorRemovingPlaces({
          message: error.message || "Failed to delete place",
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces]
  );

  const handleError = () => {
    setErrorUpdatingPlaces(null);
  };

  const handleErrorRemove = () => {
    setErrorRemovingPlaces(null);
  };
  console.log(userPlaces, "userPlaces");
  const [name, setName] = useState("");
  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occured"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={errorRemovingPlaces} onClose={handleErrorRemove}>
        {errorRemovingPlaces && (
          <Error
            title="An error occured"
            message={errorRemovingPlaces.message}
            onConfirm={handleErrorRemove}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <input
        ref={focusRef}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />

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
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
