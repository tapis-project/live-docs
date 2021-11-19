// $(document).foundation();
// Default branch is prod
let urlParms = new URLSearchParams(location.search);
let branch_name = urlParms.has('branch') ? urlParms.get('branch') : 'prod';
// list of APIS
var apis = [
    {
        name: 'Actors',
        url: 'https://raw.githubusercontent.com/TACC/abaco/dev-v3/docs/specs/openapi_v3.yml'
    },
    {
        name: 'Apps',
        url: 'https://raw.githubusercontent.com/tapis-project/openapi-apps/' + branch_name + '/AppsAPI.yaml'
    },
    {
        name: 'Authenticator',
        url: 'https://raw.githubusercontent.com/tapis-project/authenticator/' + branch_name + '/service/resources/openapi_v3.yml'
    },
    {
        name: 'Files',
        url: 'https://raw.githubusercontent.com/tapis-project/openapi-files/' + branch_name + '/FilesAPI.yaml'
    },
    {
        name: 'Jobs',
        url: 'https://raw.githubusercontent.com/tapis-project/tapis-client-java/' + branch_name + '/jobs-client/src/main/resources/JobsAPI.yaml'
    },
    {
        name: 'Meta',
        url: 'https://raw.githubusercontent.com/tapis-project/tapis-client-java/' + branch_name + '/meta-client/src/main/resources/metav3-openapi.yaml'
    },
    {
        name: "Notifications",
        url: 'https://raw.githubusercontent.com/tapis-project/notifications/' +  branch_name + '/api/src/main/resources/openapi.yaml'
    },
    {
        name: 'PgREST',
        url: 'https://raw.githubusercontent.com/TACC/paas/' + branch_name + '/pgrest/resources/openapi_v3.yml'
    },
    {
        name: 'SK',
        url: 'https://raw.githubusercontent.com/tapis-project/tapis-client-java/' + branch_name + '/security-client/src/main/resources/SKAuthorizationAPI.yaml'
    },
    {
        name: 'Streams',
        url: 'https://raw.githubusercontent.com/tapis-project/streams-api/' + branch_name + '/service/resources/openapi_v3.yml'
    },
    {
        name: 'Systems',
        url: 'https://raw.githubusercontent.com/tapis-project/openapi-systems/' + branch_name + '/SystemsAPI.yaml'
    },
    {
        name: 'Tenants',
        url: 'https://raw.githubusercontent.com/tapis-project/tenants-api/' + branch_name + '/service/resources/openapi_v3.yml'
    },
    {
        name: 'Tokens',
        url: 'https://raw.githubusercontent.com/tapis-project/tokens-api/' + branch_name + '/service/resources/openapi_v3.yml'
    }
];

function init() {

    let service = urlParms.get("service");
    if (service) {
        apis.forEach((d) => {
            if (d.name.toLowerCase() == service.toLowerCase()) {
                Redoc.init(d.url);
            }
        });
    } else {
        // initially render first API
        Redoc.init(apis[0].url);
    }
}
$(document).ready(function($) {

    function onClick() {
        var url = this.getAttribute('data-link');
        let serviceName = this.getAttribute('service');
        Redoc.init(url);
        var queryParams = new URLSearchParams(window.location.search);
        queryParams.set("service", serviceName);
        // history.replaceState(null, null, "?"+queryParams.toString());
        // history.pushState(null, null, "?"+queryParams.toString());
        window.location.search = queryParams.toString();

    }

    // dynamically building navigation items
    var $list = document.getElementById('links_container');
    apis.forEach(function (api) {
        var $listitem = document.createElement('li');
        $listitem.setAttribute('data-link', api.url);
        $listitem.setAttribute('service', api.name);
        $listitem.innerText = api.name;
        $listitem.addEventListener('click', onClick);
        $list.appendChild($listitem);
    });

    init();

    $(window).on('popstate', function() {
        init();
    });
})
