// $Id: reference.js 108 2010-10-20 22:29:32Z Fix_J $

var SDMX = {};

$(document).ready( function() {
    $(".ref-section h2").click( function() {
        $(this).nextAll("div.ref").stop(true, true).slideToggle();
    });
    $("div.ref table").tablesorter( {sortList: [[0,0]]} );
    
// http://stats.oecd.org/restsdmx/sdmx.ashx/GetDataStructure/REFSERIES/OECD

    SDMX = {
    
        _xmlResponse: {},
        
        _defaultValues: {
            proxy: "proxy.php?url=",
            baseUrl: "http://stats.oecd.org/restsdmx/sdmx.ashx/",
            method: "GetDataStructure",
            data: "REFSERIES",
            org: "OECD",
            params: {
                format: "compact_v2"
            }
        },
        
        _getArray: function( xml, name ) {
            var arr = [];
            $(xml).find(name).each( function(i, el) {
                var obj = {
                    id: $(el).attr("id")
                };                        
                $(el).find("Name").each( function(i, name) {
                    obj[$(name).attr("xml:lang")] = $(name).text();
                });
                arr.push(obj);
            });
            return arr;
        },
        
        _requestObjectToURL: function( req ) {
            return "proxy.php?url=" + encodeURIComponent("http://stats.oecd.org/restsdmx/sdmx.ashx/GetDataStructure/REFSERIES/OECD");
        },
        
        insertConceptsTable: function() {
            var url = this._requestObjectToURL();
            $.get(url,
                function(data) {
                    var valueArray = SDMX._getArray(data, "Concept");
                    var textToInsert = '';
                    $.each(valueArray, function(count, item) {
                        textToInsert  += '<tr><th><span class="code">' + item.id + '</span></th><td>'+ item.en + '</td><td>' + item.fr + '</td></tr>';
                    });
                    $("#concepts-table tbody").html(textToInsert);
                }
            );        
        },
        _getCodeArray: function( data, code_id ) {
            var arr = {};
            var cl = $(data).find("#" + code_id);
            cl.find("Code").each(function(idx, item) {
                var key = $(item).attr("value");
                arr[key] = {};
                $(item).find("Description").each(function(i, e) {
                    var lang = e.attributes[0].value;
                    arr[key][lang] = $(e).text();
                });
            });
            return arr;
        },
        _insertCodeListTable: function( code ) {
            var url = this._requestObjectToURL();
            $.get(url,
                function(data) {
                    var valueArray = SDMX._getCodeArray(data, code);
                    var textToInsert = '';
                    $.each(valueArray, function(count, item) {
                        textToInsert  += '<tr><th><span class="code">' + count + '</span></th><td>'+ item.en + '</td><td>' + item.fr + '</td></tr>';
                    });
                    $("#" + code + " tbody").html(textToInsert);
                    $("table").trigger("update");
                }
            );        
        },
        
        insertLocationsTable: function() {
            SDMX._insertCodeListTable("CL_REFSERIES_LOCATION");
        },
        insertStatusTable: function() {
            SDMX._insertCodeListTable("CL_REFSERIES_OBS_STATUS");
        },
        insertSubjectsTable: function() {
            SDMX._insertCodeListTable("CL_REFSERIES_REFERENCESUBJECT");
        },
        insertPeriodsTable: function() {
            SDMX._insertCodeListTable("CL_REFSERIES_TIME");
        },
        insertFrequenciesTable: function() {
            SDMX._insertCodeListTable("CL_REFSERIES_FREQUENCY");
        }
        
    };

    SDMX.insertConceptsTable();
    SDMX.insertLocationsTable();
    SDMX.insertSubjectsTable();
    SDMX.insertStatusTable();
    SDMX.insertFrequenciesTable();
    SDMX.insertPeriodsTable();
    

});