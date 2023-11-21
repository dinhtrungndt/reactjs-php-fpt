import React, { useEffect, useState } from "react";
import AxiosInstance from "../../helper/AxiosInstance.js";
import { defaults } from "chart.js/auto";
import "./css.css";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import revenueData from "./data/revenueData.json";
import sourceData from "./data/sourceData.json";

// Configure default options
defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

function ChartComponent() {
  const [studentFees, setStudentFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await AxiosInstance().get("/get-student-fees.php");
        setStudentFees(result);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <div className="dataCard revenueCard">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Line
            data={{
              labels: studentFees.map((data) => data.name),
              datasets: [
                {
                  label: "Tuition Fee",
                  data: studentFees.map((data) => data.tuition_fee),
                  backgroundColor: "#064FF0",
                  borderColor: "#064FF0",
                },
                {
                  label: "Misc Fee",
                  data: studentFees.map((data) => data.misc_fee),
                  backgroundColor: "#FF3030",
                  borderColor: "#FF3030",
                },
              ],
            }}
            options={{
              elements: {
                line: {
                  tension: 0.5,
                },
              },
              plugins: {
                title: {
                  text: "Tuition and Misc Fees",
                },
              },
            }}
          />
        )}
      </div>
      <div className="dataCard customerCard">
        <Bar
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Revenue Source",
              },
            },
          }}
        />
      </div>

      <div className="dataCard categoryCard">
        <Doughnut
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                borderColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Revenue Sources",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default ChartComponent;
