import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import moment from 'moment';
const Timeline = ({ minDate, maxDate }) => {
  const svgRef = useRef(null);

function getDuration(milli) {
  let minutes = Math.floor(milli / 60000);
  let hours = Math.round(minutes / 60);
  let days = Math.round(hours / 24);
  return days * 400;
}
const days = moment(maxDate).diff(minDate, 'days')
const proportion = 1 - Math.abs((days * 10 ) / ((days + 1) * 24 - 10));
  useEffect(() => {
    const dateArray = [];
    const currentDate = new Date(minDate);

    while (currentDate <= maxDate) {
      dateArray.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // Определение размеров графика
    const margin = { top: 40, right: 20, bottom: 0, left: 60 };
    const width = 100 - margin.left - margin.right;
    const height = getDuration(maxDate - minDate) 
    // Создание шкалы времени для оси Y - первый диапазон
    const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(5,${margin.top})`);

    for (let i = 0; i < dateArray.length; i++) {
      const yScale1 = d3
        .scaleTime()
        .domain([
          parseTime(`${dateArray[i]}T06:00:00`),
          parseTime(`${dateArray[i]}T20:00:00`),
        ])
        .range([0, height * proportion / (dateArray.length)]);

      // Создание оси Y для первого диапазона
      const yAxis1 = d3
        .axisRight(yScale1)
        .ticks(d3.timeHour.every(2))
        .tickFormat(d3.timeFormat("%d.%m, %H:%M"));

      // Добавление первой оси к графику
      svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(0, ${i * (height * proportion / (dateArray.length)) + i * 20})`)
        .call(yAxis1);
    }
    // Добавление меток дней
    svg
      .selectAll(".day-label")
      .enter()
      .append("text")
      .attr("class", "day-label")
      .attr("x", -10)
      .attr("y", 0)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .text((d) => d.label);
  }, [maxDate, minDate, proportion]);

  return <svg ref={svgRef}></svg>;
};

export default Timeline;
