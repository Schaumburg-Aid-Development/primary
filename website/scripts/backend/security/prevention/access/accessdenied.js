function accessDenied() {
    console.log("[Prevention Module]: Preventing access to due to lack of authorization. CLIENT ERROR 0403");
    window.location.href = "../../pages/errors/0 Error Class/0403.html";
}

export { accessDenied };