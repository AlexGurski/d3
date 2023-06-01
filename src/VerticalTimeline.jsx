import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Gorilla from "./assets/gif/gorila.gif";

function getDuration(milli) {
  let minutes = Math.floor(milli / 60000);
  let hours = Math.round(minutes / 60);
  let days = Math.round(hours / 24);
  return days * 400;
}

const VerticalTimeline = ({ data, minDate, maxDate, selectOrder }) => {
  const timelineRef = useRef(null);
  const wrapperRef = useRef(null);

  const fieldWidth = 150;

  useEffect(() => {
    const margin = { top: 70, right: 0, bottom: 0, left: 0 };
    const height =
      timelineRef.current.clientHeight - margin.top - margin.bottom;
    const width = timelineRef.current.clientWidth;

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
      // console.log(new Date(e), d);
      return new Date(e);
    };

    const y = d3.scaleTime().domain([minDate, maxDate]).range([0, height]);

    data.forEach((element, index) => {
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
          console.log(d);
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
    data.forEach((element, index) => {
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
        .attr("fill", "#CCCCCC");
    });

    const timeFormat = d3.timeFormat("%d.%m, %H:%M");

    const yAxis = d3
      .axisRight(y)
      .ticks(d3.timeHour.every(2))
      .tickFormat(timeFormat);

    svgTime.append("g").attr("class", "y-axis").call(yAxis);
    d3.select(wrapperRef.current).call(yAxis);

    return () => {
      d3.select(timelineRef.current).selectAll("*").remove();
      d3.select(wrapperRef.current).selectAll("*").remove();
    };
  }, [data, minDate, maxDate, selectOrder]);

  return (
    <div className="container">
      <div className="wrapper">
        {data.length === 0 && (
          <div className="gorilla">
            <img src={Gorilla} alt="" width={150} height={150} />
          </div>
          
        )}

        <div
          ref={timelineRef}
          style={{
            width: `${data.length * fieldWidth}px`,
            height: `${getDuration(maxDate - minDate)}px`,
          }}
        />

        {data.map((element, index) => (
          <div
            key={index}
            className="text"
            style={{
              position: "absolute",
              top: "10px",
              left: `${fieldWidth * index}px`,
              width: `${fieldWidth}px`,
            }}
          >
            <span className="title_text">{element.operationName}</span>
          </div>
        ))}
      </div>
      <div className="datetime" ref={wrapperRef}></div>
    </div>
  );
};

export default VerticalTimeline;
