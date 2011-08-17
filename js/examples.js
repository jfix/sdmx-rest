// $Id: examples.js 108 2010-10-20 22:29:32Z Fix_J $

var SDMX = {};

$(document).ready( function() {

    SDMX = {
        _defaultValues: {
            proxy: "proxy.php?url=",
            baseUrl: "http://stats.oecd.org/restsdmx/sdmx.ashx/",
            method: "GetData",
            data: "REFSERIES",
            subjects: "NETGOOD",
            locations: "OECD",
            frequency: "Y",
            org: "OECD",
            params: {
                format: "compact_v2"
            }
        },
        
        _requestObjectToURL: function( req ) {
            var url = this._defaultValues.baseUrl;
            url += (req.method ? req.method : this._defaultValues.method) + "/";
            url += (req.data ? req.data : this._defaultValues.data) + "/";
            url += (req.locations
                ? $.isArray(req.locations)
                    ? req.locations.join("+")
                    : req.locations
                : $.isArray(this._defaultValues.locations)
                    ? this._defaultValues.locations.join("+")
                    : this._defaultValues.locations) + ".";
            url += (req.subjects 
                ? $.isArray(req.subjects) 
                    ? req.subjects.join("+") 
                    : req.subjects
                : $.isArray(this._defaultValues.subjects)
                    ? this._defaultValues.subjects.join("+") 
                    : this._defaultValues.subjects) + ".";
            url += (req.frequency ? req.frequency : this._defaultValues.frequency) + "/OECD";
            url += "?" + $.param( $.extend({}, this._defaultValues.params, req.params));
            
            return this._defaultValues.proxy + encodeURIComponent(url);
        },
        
        _thead: function( obj ) {
            var thead = "<thead><tr><td>&#160;</td>"; // empty cell in header
            $.each(obj.DataSet[0].Series,
                function(i, o) {
                    thead += "<td>" + o.LOCATION + "</td>";
                }
            );
            thead += "</tr></thead>";
            return thead;
        },
        
        _tbody: function( obj) {
            var tbody = "<tbody>";
            
            var firstSeriesObs = obj.DataSet[0].Series[0].Obs; // array
            
            for (var r = 0; r < firstSeriesObs.length; r++) {
                tbody += "<tr>";
                tbody += "<td>" + obj.DataSet[0].Series[0].Obs[r].TIME + "</td>";
                    
                $.each(obj.DataSet[0].Series,
                    function(i, s) {
                        tbody += "<td>" + s.Obs[r].OBS_VALUE + "</td>";
                    }
                );
            
                tbody += "</tr>";
            }
            tbody += "</tbody>";
            return tbody;
        },

        _getValues: function( xml ) {
            var arr = [];
            $(xml).find("Obs").each( function(i, el) {
                arr.push($(el).attr("OBS_VALUE"));
            });
            return arr;
        },
        
        _getSeries: function( obj ) {
            var arr = [];
            jQuery.each( obj.DataSet[0].Series, function(i, s) {
                var obj = { name: s.LOCATION, data: [] };
                jQuery.each(s.Obs, function(j, o) {
                    obj.data.push(parseFloat(o.OBS_VALUE));
                });
                arr.push(obj);
            });
            return arr;
        },
        
        _getTimes: function( obj ) {
            var arr = [];
            jQuery.each( obj.DataSet[0].Series[0].Obs, function(i, o) {
                arr.push(o.TIME);
            });
            return arr;
        },
        _getSubject: function( obj, lang ) {
            if (!lang || lang.length <= 0) lang = "en";
            var code = obj.DataSet[0].Series[0].SUBJECT;
            return code;
        },
        
        insertSingleDatapoint: function( req, id ) {
            var url = this._requestObjectToURL(req);
            $.get(url,
                function(data) {
                    var json = $.xmlToJSON(data);
                    var val = json.DataSet[0].Series[0].Obs[0].OBS_VALUE;
                    $("#" + id).html(val);
                }
            );
        },
        
        insertSparkline: function( req, id ) {
            var url = this._requestObjectToURL(req);
            $.get(url,
                function(data) {
                    var json = $.xmlToJSON(data);
                    var series = [];
                    $.each( json.DataSet[0].Series[0].Obs, function(i, e) {
                        series.push(parseFloat($(e).attr("OBS_VALUE")));
                    });
                    $("#" + id).sparkline( series );
                }
            );
        },
        
        insertTable: function(req, id) {
            var url = this._requestObjectToURL(req);
            $.get(url,
                function(data) {
                    var json = $.xmlToJSON(data);
                    var tbl = "<table>";
                    tbl += SDMX._thead(json);
                    tbl += SDMX._tbody(json);
                    tbl += "</table>";
                    $("#" + id).html(tbl);
                    $("#" + id + " table").tablesorter({debug: false}).trigger("update");
                }
            );
        },
        
        insertChart: function(req, opts) {
            var url = this._requestObjectToURL(req);
             $.get(url,
                function(data) {
                    var json = $.xmlToJSON(data);
                    var series = SDMX._getSeries(json);
                    var years = SDMX._getTimes(json);
                    var title = SDMX._getSubject(json, "en" );
                    var options = {
                        chart: {
                            renderTo: opts.id,
                            defaultSeriesType: "line"
                        },
                        title: {
                            text: title,
                        },
                        xAxis: {
                            categories: years 
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>'+ this.series.name +'</b><br/>'+
                                this.x +': '+ this.y +' 000';
                            }
                        },
                        series: series
                    };
                    var chart = new Highcharts.Chart(options);
                }
            );
        },
        
        getSingleSeries: function( req ) {
        
        },
        
        getSeries: function( req ) {
        
        }
    }
});