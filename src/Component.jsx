import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Component = () => {
  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);
  const [xDataContinue, setXDataContinue] = useState([]);
  const [yDataContinue, setYDataContinue] = useState([]);
  // const [max, setMax] = useState(20);

  console.log(xDataContinue);
  console.log(yDataContinue);

  // console.log(xData);
  // console.log(yData);

  const data = {
    labels: xData,
    datasets: [
      {
        label: "Errors",
        data: yData,
        pointStyle: false,
        fill: true,
        borderWidth: 1,
        borderColor: "rgba(74,169,230,0.5)",
        backgroundColor: "rgba(74,169,230,0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        min: 0,
        // max,
        max: 20,
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          color: "rgba(74,169,230,0.9)",
        },

        border: {
          color: "rgba(74,169,230,1)",
        },

        grid: {
          color: "rgba(74,169,230,0.3)",
        },
      },
      y: {
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          color: "rgba(74,169,230,0.9)",
        },

        border: {
          color: "rgba(74,169,230,1)",
        },

        grid: {
          color: "rgba(74,169,230,0.3)",
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },
    },

    animation: {
      duration: 600,
      easing: "linear",
    },
  };

  const realTime = (
    _xData,
    _yData
    //  _xDataContinue, _yDataContinue
  ) => {
    let j = 0;

    const eventSource = new EventSource("http://localhost:8080/");

    eventSource.onmessage = (event) => {
      const _data = JSON.parse(event.data);

      _xData.push(_data.date);
      _yData.push(_data.value);

      console.log(_data);

      setXDataContinue(_xData.slice(j + 1, _xData.length));

      setYDataContinue(_yData.slice(j + 1, _yData.length));

      ++j;
    };

    // let interval = setInterval(() => {
    //   if (j >= 20) clearInterval(interval);
    //   else {
    //     setXDataContinue([
    //       ..._xData.slice(j + 1, _xData.length),
    //       ..._xDataContinue.slice(0, j + 1),
    //     ]);
    //     setYDataContinue([
    //       ..._yData.slice(j + 1, _yData.length),
    //       ..._yDataContinue.slice(0, j + 1),
    //     ]);
    //   }

    //   ++j;
    // }, 1000);
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        "https://www.alphavantage.co/query?function=ALUMINUM&interval=monthly&apikey=demo"
      );

      let _xData = [];
      let _yData = [];
      // let _xDataContinue = [];
      // let _yDataContinue = [];

      for (let i = 0; i < 20; i++) {
        if (response.data.data[i].value !== ".") {
          // if (i < 20) {
          _xData.push(response.data.data[i].date);
          _yData.push(response.data.data[i].value);
          // } else {
          // _xDataContinue.push(response.data.data[i].date);
          // _yDataContinue.push(response.data.data[i].value);
          // }
        }
      }

      // console.log(_xDataContinue);
      // console.log(_yDataContinue);

      setXData(_xData.reverse());
      setYData(_yData.reverse());

      realTime(
        _xData,
        _yData
        // _xDataContinue.reverse(),
        // _yDataContinue.reverse()
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // setMax(max + 2);

    setXData(xDataContinue);
    setYData(yDataContinue);
  }, [xDataContinue, yDataContinue]);

  return (
    <>
      <Line data={data} options={options} />
    </>
  );
};

export default Component;
