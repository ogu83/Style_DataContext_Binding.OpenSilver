(function () {
    var jsManifest = "bridge-manifest.json";
    var portGateway;
    var componentMounter;
    var subAppManager;
    var slLoadedFnName;
    var slErrorFnName;
    var slReceiveFnName;
    var slActivityFnName;
    var slInternetCheckFnName;
    //var silverlightApp;
    var overlayNode;
    var openLinkInClassic;

    window.jsClient = {
        checkMsieBrowserVersion: checkMsieBrowserVersion,
        init: init,
        send: send,
        renderComponentFromSL: renderComponentFromSL,
        renderComponent: renderComponent,
        unmountComponent: unmountComponent,
        disposeSubApp: disposeSubApp,
        hasSubAppWithId: hasSubAppWithId
    };

    function checkMsieBrowserVersion() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            var version = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
            return version;
        }
        return 10;
    }

    function init(hostUrl, loadedFnName, errorFnName, receiveFnName, activityFnName) {        
        //silverlightApp = document.getElementById('silvercombinexap').Content.SilverlightApp;
        //overlayNode = document.getElementById('jsclient-overlay');
        //openLinkInClassic = document.getElementById('openLinkInClassic');
        slLoadedFnName = loadedFnName;        
        slErrorFnName = errorFnName;
        slReceiveFnName = receiveFnName;
        slActivityFnName = activityFnName;

        //console.log(hostUrl, loadedFnName, errorFnName, receiveFnName, activityFnName);

        subscribeToUserActivity();

        //TODO: Remove this
        //slLoadedFnName();

        $.ajax({
            url: "http://per.localcombine.net/Classic/1.32/" + hostUrl + "/" + jsManifest,
            dataType: "json",
            type: "GET",
            cache: false,
            crossDomain: true,
            success: function (files) {
                var absoluteUrls = files.map(function (relativeUrl) {
                    return hostUrl + relativeUrl;
                });
                loadJsFiles(absoluteUrls);
            },
            error: function () {
                errorFnName(new Error("Kunde inte ladda bryggan"));
                //silverlightApp[errorFnName](new Error("Kunde inte ladda bryggan"));
            }
        });
    }

    function subscribeToUserActivity() {
        window.addEventListener("mousedown", triggerActivityCallback);
        window.addEventListener("touchstart", triggerActivityCallback);
        window.addEventListener("keypress", triggerActivityCallback);
        window.addEventListener("wheel", triggerActivityCallback);
    }

    function triggerActivityCallback() {
        //silverlightApp[slActivityFnName]();
        slActivityFnName();
    }

    function loadJsFiles(files) {
        loadjs(files, {
            async: false,
            success: function () {
                start();
                //silverlightApp[slLoadedFnName]();
                slLoadedFnName();
            }
        });
    }

    function start() {
        portGateway = window.portGateway;
        componentMounter = window.componentMounter;
        subAppManager = window.subAppManager;
        portGateway.subscribe(receive);
        renderComponent(overlayNode, "GlobalOverlays");
        renderComponent(openLinkInClassic, "OpenLinkInClassic");
    }

    function receive(namespace, name, data) {
        var message = JSON.stringify(data);
        //silverlightApp[slReceiveFnName](namespace, name, message);
        slReceiveFnName(namespace, name, message);
    }

    function send(namespace, name, message) {
        var data = JSON.parse(message);
        portGateway.send(namespace, name, data);
    }

    function renderComponentFromSL(element, type, jsonStringWithProps) {
        // Hacky way to fix some of the initial rendering issues with our Telrik component
        var renderTries = 0;
        function tryRenderInBody() {
            if (renderTries > 15) {
                //silverlightApp[slErrorFnName](
                slErrorFnName(
                    new Error("Kunde inte rendera komponent")
                );
                return;
            }
            renderTries = renderTries + 1;

            if (document.body.contains(element)) {
                renderComponent(element, type, jsonStringWithProps);
                return;
            }

            // Retry in next frame
            window.requestAnimationFrame(tryRenderInBody);
        }

        // Wait 5 frames for telrik component to apply styles, then try to render
        var currentFrame = 0;
        function waitRender() {
            if (currentFrame < 5) {
                currentFrame = currentFrame + 1;
                window.requestAnimationFrame(waitRender);
            } else {
                window.requestAnimationFrame(tryRenderInBody);
            }
        }
        window.requestAnimationFrame(waitRender);
    }

    function renderComponent(element, type, jsonStringWithProps) {
        if (jsonStringWithProps) {
            var props = JSON.parse(jsonStringWithProps);
            componentMounter.mount(element, type, props);
        } else {
            componentMounter.mount(element, type);
        }
    }

    function unmountComponent(element) {
        componentMounter.unmount(element);
    }

    function disposeSubApp(subAppId) {
        subAppManager.disposeSubAppTree(subAppId);
    }

    function hasSubAppWithId(subAppId) {
        return subAppManager.hasSubAppWithId(subAppId);
    }

})();