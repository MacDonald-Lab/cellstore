import { sampleStandardDeviation, sampleVariance, standardDeviation, variance, medianAbsoluteDeviation, interquartileRange } from 'simple-statistics'
const definition = {
  name: "dispersion",
  friendlyName: "Measures of Dispersion",
  description: "A suite of measures of Dispersion",
  group: true,

  inputs: [
    {
      name: "values",
      friendlyName: "Values",
      description: "A list of values to plot.",
      parameterName: "values",
      dataTypes: ["int", "float"],
      multiCollect: true,
    },
  ],

  outputs: [
    {
      name: "variance",
      friendlyName: "Variance",
      parameterName: "variance",
      description: "Sum of squared deviations from the mean.",
      dataType: "float",
    },
    {
      name: "sample-variance",
      friendlyName: "Sample Variance",
      parameterName: "sampleVariance",
      description: "Sum of squared deviations from the mean, using Bessel's Correction.",
      dataType: "float",
    },
    {
      name: "standard-deviation",
      friendlyName: "Standard Deviation",
      parameterName: "standardDeviation",
      description: "Square root of the variance.",
      dataType: "float",
    },
    {
      name: "sample-standard-deviation",
      friendlyName: "Sample Standard Deviation",
      parameterName: "sampleStandardDeviation",
      description: "Square root of the sample variance.",
      dataType: "float",
    },
    {
      name: "median-absolute-deviation",
      friendlyName: "Median Absolute Deviation",
      parameterName: "medianAbsoluteDeviation",
      description: "Robust measure of statistical dispersion, more resilient to outliers than the standard deviation.",
      dataType: "float",
    },
    {
      name: "interquartile-range",
      friendlyName: "Interquartile Range",
      parameterName: "interquartileRange",
      description: "Difference between the third quartile and first quartile.",
      dataType: "float",
    },
  ],
};

const dispersion = ({ values }) => {
  return {
    variance: variance(values),
    sampleVariance: sampleVariance(values),
    standardDeviation: standardDeviation(values),
    sampleStandardDeviation: sampleStandardDeviation(values),
    medianAbsoluteDeviation: medianAbsoluteDeviation(values),
    interquartileRange: interquartileRange(values),

  }

};

const exportObject = {
  definition: definition,
  function: dispersion,
};

export default exportObject;
