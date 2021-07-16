import { ScatterChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

const definition = {
  name: "scatter-plot",
  friendlyName: "Scatter Plot",
  description: "View a scatter plot.",
  group: true,

  inputs: [
    {
      name: "values",
      friendlyName: "Values",
      description: "A list of values to plot.",
      parameterName: "values",
      multiCollect: true,
      inputs: [
        {
          name: "xValues",
          friendlyName: "X Values",
          parameterName: "x",
          description: "The first value",
          dataTypes: ["int", "float"],
          required: true,
        },
        {
          name: "yValues",
          friendlyName: "Y Values",
          parameterName: "y",
          description: "The second value",
          dataTypes: ["int", "float"],
          required: true,
        },
      ],
    },
  ],

  outputs: [
    {
      name: "plot",
      friendlyName: "Plot",
      parameterName: "plot",
      description: "A view of the scatter plot",
      dataType: "view",
    },
  ],
};

const scatterPlot = ({ values }) => {
  const data = values;

  const options = {
    title: "Scatter Plot",
    axes: {
      bottom: {
        title: "X Axis",
        mapsTo: "x",
      },
      left: {
        title: "Y Axis",
        mapsTo: "y",
      },
    },
    height: "400px",
  };
  return { plot: () => <ScatterChart data={data} options={options} /> };
};

const exportObject = {
  definition: definition,
  function: scatterPlot,
};

export default exportObject;
