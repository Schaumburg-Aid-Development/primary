function accessLevelDeniedHandler(req, res) {
    console.log("[Prevention Module]: Preventing access to " + req.originalUrl + " due to insufficient access level. CLIENT ERROR 0403.1");
    res.status(403).sendFile(path.join(__dirname, '../public/errors/0403.1.html'));
}