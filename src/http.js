export async function fetchAvailablePlaces() {
  const response = await fetch(
    "https://tourist-backend-zeta.vercel.app/places"
  );
  const resData = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch Places");
  }
  return resData.places;
}

export async function fetchUserPlaces() {
  const response = await fetch(
    "https://tourist-backend-zeta.vercel.app/user-places"
  );
  const resData = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch User Places");
  }
  return resData.places;
}

export async function UpdateUserPlaces(places) {
  debugger;
  const response = await fetch(
    "https://tourist-backend-zeta.vercel.app/user-places",
    {
      method: "PUT",
      body: JSON.stringify({ places }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("failed to update the Data");
  }

  return resData.message;
}
