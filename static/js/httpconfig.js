require(['dojo/request', 'dojo/dom-construct', 'dojo/query', 'dojo/domReady!'], function(request, domConstruct, query) {
    request.get('/api/httpconfig', {
        handleAs: 'json'
    }).then(function(res) {
        var container = domConstruct.create('table', { className: 'container' }),
            key;

        for (key in res) {
            if (res.hasOwnProperty(key)) {
                domConstruct.create('tr', {
                    className: 'result-' + key,
                    innerHTML: '<td class="property">' + res[key].displayName + '</td>' +
                               '<td class="value">' + (res[key].value || '') + '</td>'
                }, container);
            }
        }

        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(function(position) {
        //         domConstruct.create('tr', {
        //             className: 'result-latitude',
        //             innerHTML: '<td class="property">Latitude</td>' +
        //                        '<td class="value">' + position.coords.latitude + '</td>'
        //         }, container);
        //         domConstruct.create('tr', {
        //             className: 'result-longitude',
        //             innerHTML: '<td class="property">Longitude</td>' +
        //                        '<td class="value">' + position.coords.longitude + '</td>'
        //         }, container);
        //     }, function() {}, { maximumAge: 60000 });
        // }

        domConstruct.place(container, query("header")[0], "after");
    });
});
