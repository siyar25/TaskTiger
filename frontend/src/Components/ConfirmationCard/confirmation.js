export async function postReservation(data) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(
    "http://localhost:8080/api/reservation",
    options
  );
  return await response.json();
}
export { postReservation };
