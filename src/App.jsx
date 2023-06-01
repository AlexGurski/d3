import { useEffect, useState } from "react";
import VerticalTimeline from "./VerticalTimeline";
import { OrdersList } from "./ordersList";

export const App = () => {
  const [data, setData] = useState([]);
  const [selectOrder, setSelectOrder] = useState("");
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
        url: "https://743e-134-17-26-206.ngrok-free.app/api/new-order/operations/?from=2023-02-27&to=2023-03-07",
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
    <div className="fullScreen">
      <OrdersList
        setSelectOrder={(order) => setSelectOrder(order)}
        selectOrder={selectOrder}
      />
      <VerticalTimeline
        data={data}
        minDate={new Date("2023-02-27T00:00:00.000Z")}
        maxDate={new Date("2023-03-07T23:59:59.000Z")}
        selectOrder={selectOrder}
      />
    </div>
  );
};

export default App;
