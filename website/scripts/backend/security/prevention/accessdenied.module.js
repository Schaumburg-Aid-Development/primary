function accessDeniedHandler(req, res) {
    console.log("[Prevention Module]: Preventing access to " + req.originalUrl + " due to lack of authorization. CLIENT ERROR 0403");
    res.status(403).sendFile(path.join(__dirname, '../public/errors/403.html'));
}