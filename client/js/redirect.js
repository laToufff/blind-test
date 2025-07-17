socket.on('redirect', function (path) {
    if (window.location.pathname != path) {
        window.location.replace(path);
    }
});