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

    const parseDate = (e, d) => {
        
      return new Date(e);
    };

    const y = d3.scaleTime().domain([minDate, maxDate]).range([0, height]);
    const barWidth = 50;

    data.map((element, index) => {
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
          d3.select(this).select("rect").attr("opacity", 0.6);
        });

      bars
        .append("rect")
        .attr("x", (index * (width - 100)) / data.length)
        .attr("y", -barWidth / 2)
        .attr("width", (width - 100) / data.length)
        .attr(
          "height",
          (d, i) => y(parseDate(d.endTime, d)) - y(parseDate(d.startTime, d))
        )
        .attr("fill", "#87BC45")
        .attr("opacity", "0.6");
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
            left: `${
              ((timelineRef.current.clientWidth - 100) / data.length) * index
            }px`,
          }}
        >
          <span>{element.OperationName}</span>
        </div>
      ))}
    </>
  );
};

export default VerticalTimeline;
