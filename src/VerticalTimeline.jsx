import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function getDuration(milli) {
  let minutes = Math.floor(milli / 60000);
  let hours = Math.round(minutes / 60);
  let days = Math.round(hours / 24);
  return days * 400;
}

const VerticalTimeline = ({ data, minDate, maxDate }) => {
  const timelineRef = useRef(null);

  useEffect(() => {
    const margin = { top: 50, right: 30, bottom: 30, left: 0 };
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

    const sortedData = (dat) =>
      dat.sort((a, b) => parseDate(a.date) - parseDate(b.date));

    const parseDate = (e) => new Date(e);

    const y = d3.scaleTime().domain([minDate, maxDate]).range([0, height]);
    const barWidth = 50;

    data.map((element, index) => {
      const bars = svg
        .selectAll(".timeline-bar" + index)
        .data(() => sortedData(element.operations))
        .enter()
        .append("g")
        .attr("class", "timeline-bar" + index)
        .attr("transform", (d, i) => `translate(0, ${y(parseDate(d.date))})`)
        .on("mouseover", function (event, d) {
          d3.select(this).select("rect").attr("fill", "yellow");
          console.log(d);
        })
        .on("mouseout", function (event, d) {
          d3.select(this).select("rect").attr("fill", "#87BC45");
        });

      bars
        .append("rect")
        .attr("x", index * 200)
        .attr("y", -barWidth / 2)
        .attr("width", 90)
        .attr("height", (d, i) => {
          if (i < sortedData(element.operations).length - 1) {
            const nextDate = new Date(parseDate(sortedData(element.operations)[i + 1].date) - 1); // Изменение шага времени на 1 час
            console.log(nextDate);
            return y(nextDate) - y(parseDate(d.date));
          }
          return barWidth;
        })
        .attr("fill", "#87BC45");
    });

    const timeFormat = d3.timeFormat("%d.%m, %H:%M");
    const yAxis = d3
      .axisRight(y)
      .ticks(d3.timeHour.every(2))
      .tickFormat(timeFormat);

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${width - 100}, 0)`)
      .call(yAxis);

    return () => {
      d3.select(timelineRef.current).selectAll("*").remove();
    };
  }, [data, minDate, maxDate]);

  return (
    <>
      <div
        ref={timelineRef}
        style={{ width: "100%", height: `${getDuration(maxDate - minDate)}px` }}
      />
      {data.map((element, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: "10px",
            left: `${index * 200}px`,
          }}
        >
          <span>{element.OperationName}</span>
        </div>
      ))}
    </>
  );
};

export default VerticalTimeline;
