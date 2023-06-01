import { useEffect, useState } from "react";
import VerticalTimeline from "./VerticalTimeline";

export const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // fetch(
    //   "http://192.168.1.110/api/new-order/operations/?from=2023-01-25&to=2024-05-27"
    // )
    fetch("https://5scontrol.pl/proxy_to_ngrok/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://743e-134-17-26-206.ngrok-free.app/api/new-order/operations/?from=2023-01-25&to=2024-05-27",
        method: "GET",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);

  return (
    <>
      <VerticalTimeline
        data={data}
        minDate={new Date("2023-02-25T00:00:00.000Z")}
        maxDate={new Date("2023-05-29T23:59:59.000Z")}
      />
    </>
  );
};

export default App;
