import { useEffect, useState } from "react";
import VerticalTimeline from "./VerticalTimeline";

export const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(
      "http://192.168.1.110/api/new-order/zlecenie/?from=2023-01-25&to=2024-05-27"
    )
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
