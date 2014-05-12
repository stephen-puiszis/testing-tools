$(document).ready(function() {
  var testResults = {};
  var chartData = [];
  $inputs = $("#inputs");

  $("#add-variation").on("click", function() {
    $row = $(".data-row").last().clone();
    $tableRows = $inputs.find("tbody > tr").length;
    $name = "Variation" + $tableRows
    $row.find("input[name='label']").val($name);
    $row.appendTo("#inputs > tbody");
  });

  $resultRowHTML = "<li class='result-row'><ul><li name='label' value=''></li><li name='impressions'></li><li name='conversions'></li><li name='conversion-rate'></li><li name='percent-change'></li><li name='standard-error'></li><li name='low-interval'></li><li name='high-interval'></li><li name='z-score' ></li><li name='z-probability'></li><li name='confident'></li></ul>";

  function addOutput(results) {
    $("#results > ul").append($resultRowHTML);
    $resultRow = $("#results > ul > li.result-row").last();
    $resultRow.find("li[name='label']").val(results.name).text(results.name);
    $resultRow.find("li[name='impressions']").text(results.impressions);
    $resultRow.find("li[name='conversions']").text(results.conversions);
    $resultRow.find("li[name='conversion-rate']").text(formatPercent(results.conversionRate,2));
    $resultRow.find("li[name='percent-change']").text(formatPercent(results.percentChange,2));
    $resultRow.find("li[name='standard-error']").text(formatPercent(results.standardError,2));
    $resultRow.find("li[name='low-interval']").text(formatPercent(results.lowInterval, 2));
    $resultRow.find("li[name='high-interval']").text(formatPercent(results.highInterval,2));
    $resultRow.find("li[name='z-score']").text(results.zScore.toFixed(2));
    $resultRow.find("li[name='z-probability']").text(formatPercent(results.zProbability, 2));
    $resultRow.find("li[name='confident']").text(results.confidence);
  }

  function addVariation(object, variationName){
    object[variationName] = {
      "name":           variationName,
      "impressions":    0.0,
      "conversions":    0.0,
      "conversionRate": 0.0,
      "standardError":  0.0,
      "percentChange":  0.0,
      "lowInterval":    0.0,
      "highInterval":   0.0,
      "zScore":         0.0,
      "zProbability":   0.0,
      "confidence":     0.0,
    };
  }

  function calcPercentChange(a,b) {
    var value = (b - a) / a;
    return value;
  }

  function calcStandardError(pValue, sampleSize) {
    var numerator = pValue * (1 - pValue);
    return Math.sqrt(numerator / sampleSize);
  }

  function calcLowInterval(rate,standardError) {
    var value = parseFloat(rate) - (1.96 * standardError);
    return value;
  }

  function calcHighInterval(rate,standardError) {
    var value = parseFloat(rate) + (1.96 * standardError);
    return value;
  }

  function calcZScore(aRate,aStandardError,bRate,bStandardError) {
    var numerator = (parseFloat(bRate) - parseFloat(aRate));
    var denominator = Math.sqrt(Math.pow(aStandardError, 2) + Math.pow(bStandardError, 2));
    var value = numerator / denominator;
    return value;
  }

  function calcZProbability(zScore) {
    if( zScore > 6.5) { return 1.0; }//if z > 6.5 stdevs, # of sig digits will be unreasonable
    if(zScore < -6.5) { return 0.0; }
    var factK = 1;
    var sum = 0;
    var term = 1;
    var k = 0;
    var loopStop = Math.exp(-23);
    while(Math.abs(term) > loopStop) {
      term = .3989422804 * Math.pow(-1,k) * Math.pow(zScore,k) / (2 * k + 1) / Math.pow(2,k) * Math.pow(zScore,k+1) / factK;
      sum += term;
      k++;
      factK *= k;
    }
    sum += 0.5;
    return sum;
  }

  function determineConfidence(probability) {
    $desiredConfidence = $("#confidence-level > option:selected").val();
    if(probability > $desiredConfidence) { return true; } else { return false; }
  }

  function formatPercent(float, decimals) {
    result = float * 100;
    return result.toFixed(decimals) + "%"
  }

  $("#calculate").on("click", function() {
    $("#results > ul > li").remove();
    $inputRows = $inputs.find(".data-row");

    $.each($inputRows, function() {
      var name = $(this).find("input[name='label']").val().toLowerCase();
      addVariation(testResults, name);
      testResults[name].impressions     = parseFloat($(this).find("input[name='impressions']").val());
      testResults[name].conversions     = parseFloat($(this).find("input[name='conversions']").val());
      testResults[name].conversionRate  = parseFloat((testResults[name].conversions / testResults[name].impressions));
      testResults[name].standardError   = calcStandardError(testResults[name].conversionRate, testResults[name].impressions)
    });

    var cont = testResults.control;

    $.each(testResults, function() {
      this.percentChange  = calcPercentChange(cont.conversionRate, this.conversionRate);
      this.lowInterval    = calcLowInterval(this.conversionRate, this.standardError);
      this.highInterval   = calcHighInterval(this.conversionRate, this.standardError);
      this.zScore         = calcZScore(cont.conversionRate, cont.standardError, this.conversionRate, this.standardError);
      this.zProbability   = calcZProbability(this.zScore);
      this.confidence     = determineConfidence(this.zProbability);
    });

    $.each(testResults, function() {
      addOutput(this);
      chartData.push(this);
    });

    console.log(chartData);
    candleChart(chartData);
    barChart(chartData);
  });
});
