import { useEffect, useState } from "react";
import VerticalTimeline from "./VerticalTimeline";
import { OrdersList } from "./ordersList";

export const App = () => {
  const [data, setData] = useState([]);
  const [selectOrder, setSelectOrder] = useState("");
  const startDate = '2023-02-27'
  const endDate = '2023-03-01'
  useEffect(() => {
    fetch("https://5scontrol.pl/proxy_to_ngrok/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `https://743e-134-17-26-206.ngrok-free.app/api/new-order/operations/?from=${startDate}&to=${endDate}`,
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
        startDate={startDate}
        endDate={endDate}
      />
      <VerticalTimeline
        data={data}
        minDate={new Date(`${startDate}T00:00:00.000Z`)}
        maxDate={new Date(`${endDate}T23:59:59.000Z`)}
        selectOrder={selectOrder}
      />
    </div>
  );
};

export default App;
