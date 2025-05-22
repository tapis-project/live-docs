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
        name: 'GlobusProxy',
        url: 'https://raw.githubusercontent.com/tapis-project/globus-proxy/' + branch_name + '/service/resources/openapi_v3.yml'
    },
    {
        name: 'Jobs',
        url: 'https://raw.githubusercontent.com/tapis-project/openapi-jobs/' + branch_name + '/JobsAPI.yaml'
    },
    {
        name: 'Meta',
        url: 'https://raw.githubusercontent.com/tapis-project/tapis-client-java/' + branch_name + '/meta-client/src/main/resources/metav3-openapi.yaml'
    },
    {
        name: "Notifications",
        url: 'https://raw.githubusercontent.com/tapis-project/openapi-notifications/' + branch_name + '/NotificationsAPI.yaml'
    },
    {
        name: 'PgREST',
        url: 'https://raw.githubusercontent.com/TACC/paas/' + branch_name + '/pgrest/resources/openapi_v3.yml'
    },
    {
        name: 'Pods',
        url: 'https://raw.githubusercontent.com/tapis-project/pods_service/main/docs/openapi_v3-pods.yml'
    },
    {
        name: 'SK',
        url: 'https://raw.githubusercontent.com/tapis-project/openapi-security/' + branch_name + '/SkAPI.yaml'
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
    },
    {
        name: 'Workflows',
        url: 'https://raw.githubusercontent.com/tapis-project/tapis-workflows/' + branch_name + '/src/api/specs/WorkflowsAPI.yaml'
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
$(document).ready(function ($) {

    function onClick() {
        console.log("top of onclick");
        var url = this.getAttribute('data-link');
        let serviceName = this.getAttribute('service');
        Redoc.init(url);
        var queryParams = new URLSearchParams(window.location.search);
        queryParams.set("service", serviceName);
        let hashFragment = window.location.hash;
        // Consolidated history management
        updateHistory(queryParams, hashFragment);
    }

    function updateHistory(queryParams, hashFragment) {
        // Construct the new state
        let newState = "?" + queryParams.toString() + hashFragment;

        // Push the new state to history
        history.pushState(null, null, newState);

        //console.log("Updated history state:", newState);
        //console.log("Current history state:", history.state);
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

    var queryParams = new URLSearchParams(window.location.search);
    console.log("Query parameters on page load:", Object.fromEntries(queryParams.entries()));
    init(queryParams);
    
    $(window).on('popstate', function () {
        console.log("State change detected");

        // Get parameters before the popstate event
        var beforeService = window.location.search;
        var beforeHash = window.location.hash;

        // Get current parameters after the popstate event
        var afterService = this.location.search;
        var afterHash = this.location.hash;

        //console.log("Service at popstate:", beforeService, " --> ", afterService);
        //console.log("Hash at popstate:", beforeHash, " --> ", afterHash);

        if (beforeService !== afterService || beforeHash !== afterHash) {
            // This history logic helps a bit, but not great.
            console.log("Service or hash changed");
            Redoc.init(afterService + afterHash); // Initialize with the new query parameters and hash
        }
    });
})


// This block is an attempt at getting back and forward buttons working between different api pages
// each redoc page manages state. Moving between them causes issues with the code below, but might
// be useful for future debugging of the issue.
// History is deprioritized currently to get rid of error messages to user.



    // $(window).on('popstate', function(event) {
    //     console.log("state change detected");
    //     var url = this.location.search + this.location.hash; // Include hash fragment
    //     console.log("url: " + url);

    //     var queryParams = new URLSearchParams(this.location.search);
    //     console.log("Query parameters after back button:", Object.fromEntries(queryParams.entries()));

    //     let serviceName = queryParams.get("service");
    //     console.log("serviceName: " + serviceName);

    //     const matchingApi = apis.find(d => d.name.toLowerCase() === serviceName?.toLowerCase());

    //     // Only initialize Redoc if a matching API is found and it's different from current one
    //     if (matchingApi) {
    //         // Get the currently displayed API name (from document or a global variable)
    //         const currentApiName = document.querySelector('#links_container li.active')?.getAttribute('service');
    //         //const currentApiName = this.location.search("service");

    //         // Only reinitialize if the API is changing
    //         if (!currentApiName || currentApiName.toLowerCase() !== matchingApi.name.toLowerCase()) {
    //             console.log("Changing to service: " + matchingApi.name + " from " + currentApiName);
    //             Redoc.init(matchingApi.url + this.location.hash); // Pass hash fragment to Redoc

    //             // Update active state in navigation
    //             const listItems = document.querySelectorAll('#links_container li');
    //             listItems.forEach(item => {
    //                 item.classList.remove('active');
    //                 if (item.getAttribute('service').toLowerCase() === matchingApi.name.toLowerCase()) {
    //                     item.classList.add('active');
    //                 }
    //             });
    //         } else {
    //             console.log("Same service requested, no need to reinitialize");
    //         }
    //     } else {
    //         console.log("Service not found: " + serviceName);
    //     }
    //});
