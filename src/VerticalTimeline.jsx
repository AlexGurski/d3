import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const VerticalTimeline = ({ data, minDate, maxDate }) => {
  const timelineRef = useRef(null);

  useEffect(() => {
    const margin = { top: 50, right: 30, bottom: 30, left: 60 };
    const height =
      timelineRef.current.clientHeight - margin.top - margin.bottom;
    const width = 200;

    const svg = d3
      .select(timelineRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseDate = (e) => new Date(e);

    const sortedData = data.sort(
      (a, b) => parseDate(a.date) - parseDate(b.date)
    );

    const y = d3.scaleTime().domain([minDate, maxDate]).range([0, height]);

    const barWidth = 50; // Ширина столбца (измените по вашему усмотрению)
    const barPadding = 10; // Расстояние между блоками

    const bars = svg
      .selectAll(".timeline-bar")
      .data(sortedData)
      .enter()
      .append("g")
      .attr("class", "timeline-bar")
      .attr("transform", (d, i) => `translate(0, ${y(parseDate(d.date))})`)
      .on("mouseover", (d) => console.log(d)); // Обработчик события наведения мыши на блок

    bars
      .append("rect")
      .attr("x", 0)
      .attr("y", -barWidth / 2)
      .attr("width", width)
      .attr("height", (d, i) => {
        if (i < sortedData.length - 1) {
          const nextDate = parseDate(sortedData[i + 1].date);
          return y(nextDate) - y(parseDate(d.date));
        }
        return barWidth;
      })
      .attr("fill", (d, i) => `rgb(${i * 25}, 0, 0)`); // Измените цвет в соответствии с вашими требованиями

    bars
      .append("line")
      .attr("x1", 0)
      .attr("y1", -barWidth / 2)
      .attr("x2", width)
      .attr("y2", -barWidth / 2)
      .attr("stroke", "gray")
      .attr("stroke-dasharray", "2 2");

    const timeFormat = d3.timeFormat("%H:%M");

    const yAxis = d3.axisLeft(y).tickFormat(timeFormat);

    svg.append("g").attr("class", "y-axis").call(yAxis);

    return () => {
      d3.select(timelineRef.current).selectAll("*").remove();
    };
  }, [data, minDate, maxDate]);

  return <div ref={timelineRef} style={{ width: "100%", height: "500px" }} />;
};

export default VerticalTimeline;
