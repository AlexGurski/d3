import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Gorilla from "./assets/gif/gorila.gif";
import Arrow from "./assets/svg/arrow.svg";
import { Operation } from "./operation";

function getDuration(milli) {
  let minutes = Math.floor(milli / 60000);
  let hours = Math.round(minutes / 60);
  let days = Math.round(hours / 24);
  return days * 400;
}

const VerticalTimeline = ({ data, minDate, maxDate, selectOrder }) => {
  const [update, setUpdate] = useState(data);
  useEffect(() => {
    if (data.length > 0) {
      const first = data.filter((order) =>
        JSON.stringify(order.operations).includes(`"${selectOrder}"`)
      );
      const end = data.filter(
        (order) =>
          !JSON.stringify(order.operations).includes(`"${selectOrder}"`)
      );
      setUpdate([...first, ...end]);
    }
  }, [data, selectOrder]);

  const timelineRef = useRef(null);
  const wrapperRef = useRef(null);
  const [position, setPosition] = useState(0);
  const [operation, setOperation] = useState(false);
  const fieldWidth = 150;

  const positionHandler = (e) => {
    if (position + e > 0) {
      setPosition(0);
    } else {
      setPosition(position + e);
    }
  };

  const clickHandler = (e, event) => {
    fetch("https://5scontrol.pl/proxy_to_ngrok/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url:
          "https://0bc5-81-7-77-205.ngrok-free.app/api/new-order/order-detail/?operation=" +
          e.id,
        method: "GET",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOperation({
          data: data,
          x: event.pageX,
          y: event.pageY,
        });
      });
    console.log(e, event);
  };

  useEffect(() => {
    if (timelineRef.current && update.length > 0) {
      const margin = { top: 40, right: 0, bottom: 0, left: 0 };
      const height =
        timelineRef.current.clientHeight - margin.top - margin.bottom;
      const width = update.length * fieldWidth;

      const svg = d3
        .select(timelineRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const svgTime = d3
        .select(wrapperRef.current)
        .append("svg")
        .attr("width", 100)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const parseDate = (e, d) => {
        return new Date(e);
      };

      const y = d3.scaleTime().domain([minDate, maxDate]).range([0, height]);

      update.forEach((element, index) => {
        const bars = svg
          .selectAll(".timeline-bar" + index)
          .data(() => element.operations)
          .enter()
          .append("g")
          .attr("class", "timeline-bar" + index)
          .attr(
            "transform",
            (d, i) => `translate(0, ${y(parseDate(d.startTime))})`
          )
          .on("mouseover", function (event, d) {
            d3.select(this).select("rect").attr("opacity", 1);
          })
          .on("click", function (event, d) {
            d3.select(this).select("rect").attr("opacity", 1);
            clickHandler(d, event);
          })
          .on("mouseout", function (event, d) {
            d3.select(this)
              .select("rect")
              .attr("opacity", d.orderName === selectOrder ? 1 : 0.6);
          });

        bars
          .append("rect")
          .attr("x", index * fieldWidth + 35)
          .attr("y", 0)
          .attr("width", fieldWidth - 70)
          .attr(
            "height",
            (d, i) => y(parseDate(d.endTime, d)) - y(parseDate(d.startTime, d))
          )
          .attr("fill", "#87BC45")
          .attr("opacity", (d, i) => (d.orderName === selectOrder ? 1 : 0.6));
      });

      // Добавление серых блоков для заполнения разницы
      update.forEach((element, index) => {
        const greyBars = svg
          .selectAll(".grey-bar" + index)
          .data(() => element.operations)
          .enter()
          .append("g")
          .attr("class", "grey-bar" + index);

        greyBars
          .append("rect")
          .attr("x", index * fieldWidth - 1) // Ширина границы: 1px
          .attr("y", 0)
          .attr("width", 1)
          .attr("height", height)
          .attr("fill", "#C7C7C7");

        greyBars
          .append("rect")
          .attr("x", index * fieldWidth + 35)
          .attr("y", 0)
          .attr("width", fieldWidth - 70)
          .attr(
            "transform",
            (d, i) => `translate(0, ${i === 0 ? "0" : y(parseDate(d.endTime))})`
          )
          .attr("height", (d, i) => {
            if (i === 0) {
              return y(parseDate(d.startTime)) - y(minDate);
            }
            if (i < element.operations.length - 1) {
              const nextDate = parseDate(element.operations[i + 1].startTime);
              return y(nextDate) - y(parseDate(d.endTime)) > 0
                ? y(nextDate) - y(parseDate(d.endTime))
                : 1;
            }
            return y(maxDate) - y(parseDate(d.endTime));
          })
          .on("click", () => setOperation(false))
          .attr("fill", "#CCCCCC");
      });

      const timeFormat = d3.timeFormat("%d.%m, %H:%M");

      const yAxis = d3
        .axisRight(y)
        .ticks(d3.timeHour.every(2))
        .tickFormat(timeFormat);

      svgTime.append("g").attr("class", "y-axis").call(yAxis);
      d3.select(wrapperRef.current).call(yAxis);
    }
    return () => {
      d3.select(timelineRef.current).selectAll("*").remove();
      d3.select(wrapperRef.current).selectAll("*").remove();
    };
  }, [minDate, maxDate, selectOrder, timelineRef, update]);

  return (
    <div className="container">
      <div className="wrapper">
        {update.length === 0 && (
          <div className="gorilla">
            <img src={Gorilla} alt="" width={120} height={120} />
          </div>
        )}
        <img
          src={Arrow}
          alt=""
          width={20}
          height={20}
          className="prev"
          onClick={() => positionHandler(fieldWidth)}
        />
        <img
          src={Arrow}
          alt=""
          width={20}
          height={20}
          className="next"
          onClick={() => positionHandler(-fieldWidth)}
        />
        <div
          ref={timelineRef}
          style={{
            width: `${update.length * fieldWidth}px`,
            height: `${getDuration(maxDate - minDate)}px`,
            transform: `translateX(${position}px)`,
          }}
        ></div>

        {update.map((element, index) => (
          <div
            key={index}
            className="text"
            style={{
              position: "absolute",
              top: "10px",
              left: `${fieldWidth * index + 30}px`,
              width: `${fieldWidth - 60}px`,
              transform: `translateX(${position}px)`,
            }}
          >
            {element.operationName}
          </div>
        ))}
      </div>
      <div className="datetime" ref={wrapperRef}></div>
      {operation && (
        <Operation
          operation={operation.data}
          x={`${operation.x}px`}
          y={`${operation.y}px`}
        />
      )}
    </div>
  );
};

export default VerticalTimeline;
