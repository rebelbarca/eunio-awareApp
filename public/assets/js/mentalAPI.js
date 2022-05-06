var articleRes;

$(document).ready(function () {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://mental-health-info-api.p.rapidapi.com/news",
        // "url": "https://mental-health-info-api.p.rapidapi.com/news/thetimes",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "mental-health-info-api.p.rapidapi.com",
            "X-RapidAPI-Key": "6547e2e41fmsh128d7cf3f2946cfp13d3e2jsnf25e0ab747fc"
        }
    };
    
    $.ajax(settings).then(response => {
        $('#articleDisplay').empty()
        console.log(response);
        for(var i = 0; i < response.length; i++) {
            var articleSource = response[i].source;
            var articleTitle = response[i].title;
            var articleURL = response[i].url;

            var displayDiv = $('<div>');
            
            var rowDivEl = $('<div>').addClass("row");

            var sourceEl = $('<h2>').addClass("col-md-12");
            sourceEl.text(`Source: ${articleSource}`);

            var titleEl = $('<h5>').addClass("col-md-12");
            titleEl.text(`Title: ${articleTitle}`);
            
            var urlLinkEl = $('<a>').addClass("col-md-12 articleLink is-info is-rounded");
            urlLinkEl.attr({'href': articleURL, 'target': '_blank'});
            urlLinkEl.text('Article Link');
            urlLinkEl.css('margin-left', '20px')

            var breakEl = $('<hr/>');

            $(`#articleDisplay`).append(displayDiv);
            
            displayDiv.append(rowDivEl);
            rowDivEl.append(sourceEl);
            rowDivEl.append(titleEl);   
            rowDivEl.append(urlLinkEl);

            displayDiv.append(breakEl);
        }
        articleRes = response
    })

    $.get('/api/articleAPI', userData => {
        console.log("userData", userData);
    });
});
