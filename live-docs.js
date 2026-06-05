// $(document).foundation();

const BRANCH_TEMPLATE_STR = "{{ branch }}"

let urlParams = new URLSearchParams(location.search);

class Api {
    constructor(name, urlTemplate, defaultBranch) {
        this.name = name;
        this.urlTemplate = urlTemplate;
        this.defaultBranch = defaultBranch;
    }

    getUrlForCurrentBranch = () => {
        let branch_name = urlParams.has('branch') ? urlParams.get('branch') : this.defaultBranch;
        this.urlTemplate.replace(BRANCH_TEMPLATE_STR, branch_name)
    }
}

// list of APIS
var apis = [
    {
        name: 'Actors',
        urlTemplate: 'https://raw.githubusercontent.com/TACC/abaco/dev-v3/docs/specs/openapi_v3.yml',
        defaultBranch: "prod",
    },
    {
        name: 'Apps',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/openapi-apps/${BRANCH_TEMPLATE_STR}/AppsAPI.yaml`,
        defaultBranch: "prod",
    },
    {
        name: 'Authenticator',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/authenticator/${BRANCH_TEMPLATE_STR}/service/resources/openapi_v3.yml`,
        defaultBranch: "prod",
    },
    {
        name: 'Files',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/openapi-files/${BRANCH_TEMPLATE_STR}/FilesAPI.yaml`,
        defaultBranch: "prod",
    },
    {
        name: 'GlobusProxy',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/globus-proxy/${BRANCH_TEMPLATE_STR}/service/resources/openapi_v3.yml`,
        defaultBranch: "prod",
    },
    {
        name: 'Jobs',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/openapi-jobs/${BRANCH_TEMPLATE_STR}/JobsAPI.yaml`,
        defaultBranch: "prod",
    },
    {
        name: 'Meta',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/tapis-client-java/${BRANCH_TEMPLATE_STR}/meta-client/src/main/resources/metav3-openapi.yaml`,
        defaultBranch: "prod",
    },
    {
        name: "Notifications",
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/openapi-notifications/${BRANCH_TEMPLATE_STR}/NotificationsAPI.yaml`,
        defaultBranch: "prod",
    },
    {
        name: 'PgREST',
        urlTemplate: `https://raw.githubusercontent.com/TACC/paas/${BRANCH_TEMPLATE_STR}/pgrest/resources/openapi_v3.yml`,
        defaultBranch: "prod",
    },
    {
        name: 'Pods',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/pods_service/${BRANCH_TEMPLATE_STR}/docs/openapi_v3-pods.yml`,
        defaultBranch: "prod",
    },
    {
        name: 'SK',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/openapi-security/${BRANCH_TEMPLATE_STR}/SkAPI.yaml`,
        defaultBranch: "prod",
    },
    {
        name: 'Streams',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/streams-api/${BRANCH_TEMPLATE_STR}/service/resources/openapi_v3.yml`,
        defaultBranch: "prod",
    },
    {
        name: 'Systems',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/openapi-systems/${BRANCH_TEMPLATE_STR}/SystemsAPI.yaml`,
        defaultBranch: "prod",
    },
    {
        name: 'Tenants',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/tenants-api/${BRANCH_TEMPLATE_STR}/service/resources/openapi_v3.yml`,
        defaultBranch: "prod",
    },
    {
        name: 'Tokens',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/tokens-api/${BRANCH_TEMPLATE_STR}/service/resources/openapi_v3.yml`,
        defaultBranch: "prod",
    },
    {
        name: 'Workflows',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/tapis-workflows/${BRANCH_TEMPLATE_STR}/src/api/specs/WorkflowsAPI.yaml`,
        defaultBranch: "prod",
    },
    {
        name: 'MLHub Models',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/ml-hub-rust/refs/heads/${BRANCH_TEMPLATE_STR}/services/models/spec/v1/openapi.json`,
        defaultBranch: "main",
    },
    {
        name: 'MLHub Deployments',
        urlTemplate: `https://raw.githubusercontent.com/tapis-project/ml-hub-rust/refs/heads/${BRANCH_TEMPLATE_STR}/services/deployments/spec/v1/openapi.json`,
        defaultBranch: "main"
    },
].map((api) => new Api(api.name, api.urlTemplate, api.defaultBranch));


function init() {
    let service = urlParams.get("service");
    if (service) {
        apis.forEach((api) => {
            if (api.name.toLowerCase() == service.toLowerCase()) {
                Redoc.init(api.getUrlForCurrentBranch());
            }
        });

        return 
    }
    
    // initially render first API
    Redoc.init(apis[0].getUrlForCurrentBranch());
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
        $listitem.setAttribute('data-link', api.getUrlForCurrentBranch());
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
