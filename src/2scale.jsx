import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const VerticalTimeline = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Определение размеров графика
    const margin = { top: 40, right: 20, bottom: 40, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Создание шкалы времени для оси Y - первый диапазон
    const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
    const yScale1 = d3.scaleTime()
      .domain([parseTime("2023-05-20T06:00:00"), parseTime("2023-05-20T16:00:00")])
      .range([0, height * 0.5]);

    // Создание шкалы времени для оси Y - второй диапазон
    const yScale2 = d3.scaleTime()
      .domain([parseTime("2023-05-21T06:00:00"), parseTime("2023-05-21T16:00:00")])
      .range([height * 0.5, height]);

    // Создание оси Y для первого диапазона
    const yAxis1 = d3.axisLeft(yScale1)
      .ticks(d3.timeHour.every(2))
      .tickFormat(d3.timeFormat("%d.%m, %H:%M"));

    // Создание оси Y для второго диапазона
    const yAxis2 = d3.axisLeft(yScale2)
      .ticks(d3.timeHour.every(2))
      .tickFormat(d3.timeFormat("%d.%m, %H:%M"));

    // Создание контейнера SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Добавление первой оси к графику
    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis1);

    // Добавление второй оси к графику
    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis2)
      .attr("transform", `translate(0, 15)`);

    // Добавление меток дней
    svg.selectAll(".day-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "day-label")
      .attr("x", -10)
      .attr("y",0)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .text((d) => d.label);

  }, []);

  return <svg ref={svgRef}></svg>;
};

export default VerticalTimeline;
